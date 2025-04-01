package com.yoohoo.backend.service;

import com.yoohoo.backend.entity.File;
import com.yoohoo.backend.repository.FileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.ResponseInputStream;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.*;

import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.Optional;

@RequiredArgsConstructor
@Service
public class S3Service {
    private final S3Client s3Client; // S3Client로 수정
    private final FileRepository fileRepository;

    @Value("${AWS_S3_BUCKET_NAME}")
    private String bucketName;

    private static final String FOLDER_PATH = "uploads/";

    // 1. 파일 업로드
    public String uploadFile(MultipartFile multipartFile) {
        String originalFileName = multipartFile.getOriginalFilename();
        if (originalFileName == null) {
            throw new IllegalArgumentException("파일 이름이 없습니다.");
        }

        String fileExtension = getFileExtension(originalFileName);
        String uniqueFileName = createFileName(originalFileName);
        String s3Key = FOLDER_PATH + uniqueFileName;

        try (InputStream inputStream = multipartFile.getInputStream()) {
            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(s3Key)
                    .contentType(multipartFile.getContentType())
                    .build();

            s3Client.putObject(putObjectRequest, RequestBody.fromInputStream(inputStream, multipartFile.getSize()));

            // 업로드된 파일 URL 생성
            URL fileUrl = s3Client.utilities().getUrl(builder -> builder
                    .bucket(bucketName)
                    .key(s3Key));
            return fileUrl.toString();
        } catch (IOException e) {
            throw new RuntimeException("파일 업로드 실패", e);
        }
    }

    // 2. 파일 다운로드
    public ResponseEntity<byte[]> downloadFileDirectly(String fileName) {
        try {
            GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                    .bucket(bucketName)
                    .key(FOLDER_PATH + fileName)
                    .build();

            // S3에서 파일 가져오기
            ResponseInputStream<GetObjectResponse> s3Object = s3Client.getObject(getObjectRequest);
            byte[] fileBytes = s3Object.readAllBytes(); // 파일 데이터를 바이트 배열로 읽음

            HttpHeaders headers = new HttpHeaders();
            headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + fileName);

            return ResponseEntity.ok()
                    .headers(headers)
                    .body(fileBytes);
        } catch (S3Exception e) {
            return ResponseEntity.status(e.statusCode()).body(null);
        } catch (IOException e) {
            return ResponseEntity.status(500).body(null);
        }
    }


    // 3. 파일 삭제
    public void deleteFile(String fileName) {
        try {
            DeleteObjectRequest deleteObjectRequest = DeleteObjectRequest.builder()
                    .bucket(bucketName)
                    .key(FOLDER_PATH + fileName)
                    .build();

            s3Client.deleteObject(deleteObjectRequest);
        } catch (S3Exception e) {
            throw new RuntimeException("파일 삭제 실패", e);
        }
    }

    // id리스트로 한번에 호출
    public Map<Long, String> getFileUrlsByEntityTypeAndEntityIds(int entityType, List<Long> entityIds) {
        List<File> files = fileRepository.findByEntityTypeAndEntityIdIn(entityType, entityIds);
    
        return files.stream()
                .collect(Collectors.toMap(
                    File::getEntityId,
                    File::getFileUrl, // 👉 이미 저장된 URL을 사용
                    (existing, replacement) -> existing // 중복 방지
                ));
    }
    

    // File 엔티티 저장
    public File saveFileEntity(MultipartFile file, int entityType, Long entityId, String fileUrl) throws IOException {
        String fileName = createFileName(file.getOriginalFilename());

        File fileEntity = new File();
        fileEntity.setFileName(fileName);
        fileEntity.setFileSize(file.getSize());
        fileEntity.setContentType(file.getContentType());
        fileEntity.setEntityType(entityType);
        fileEntity.setEntityId(entityId);
        fileEntity.setFileUrl(fileUrl);
        fileEntity.setCreatedAt(Date.from(LocalDate.now().atStartOfDay(ZoneId.systemDefault()).toInstant()));
        return fileRepository.save(fileEntity); // ✅ return 추가!
    }

    // 파일 이름 생성 로직
    private String createFileName(String originalFileName) {
        return UUID.randomUUID().toString().concat(getFileExtension(originalFileName));
    }

    // 파일 확장자 추출 로직
    private String getFileExtension(String fileName) {
        try {
            return fileName.substring(fileName.lastIndexOf("."));
        } catch (StringIndexOutOfBoundsException e) {
            throw new RuntimeException("잘못된 형식의 파일입니다.");
        }
    }

    // entityType과 entityId로 파일 URL 조회
    public String getFileUrlByEntityTypeAndEntityId(Integer entityType, Long entityId) {
        return fileRepository.findFileUrlByEntityTypeAndEntityId(entityType, entityId);
    }
}
