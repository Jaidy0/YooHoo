package com.yoohoo.backend.repository;

import com.yoohoo.backend.entity.File;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FileRepository extends JpaRepository<File, Long> {

    // entityType과 entityId로 File을 찾는 메서드
    Optional<File> findByEntityTypeAndEntityId(Integer entityType, Long entityId);

    // entityType과 entityId로 fileUrl을 찾는 메서드
    @Query("SELECT f.fileUrl FROM File f WHERE f.entityType = :entityType AND f.entityId = :entityId")
    String findFileUrlByEntityTypeAndEntityId(@Param("entityType") Integer entityType, @Param("entityId") Long entityId);

    List<File> findByEntityTypeAndEntityIdIn(int entityType, List<Long> entityIds);
}
