package io.s3test.service;

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
import java.util.UUID;

@RequiredArgsConstructor
@Service
public class S3Service {
    private final S3Client s3Client;

    @Value("${AWS_S3_BUCKET_NAME}")
    private String bucketName;

    private static final String FOLDER_PATH = "uploads/";

    // 1. 파일 업로드
    public String uploadFile(MultipartFile multipartFile) {
        String originalFileName = multipartFile.getOriginalFilename();
        if (originalFileName == null) {
            throw new IllegalArgumentException("파일 이름이 없습니다.");
        }

        String fileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));
        String uniqueFileName = UUID.randomUUID().toString() + fileExtension;
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
}