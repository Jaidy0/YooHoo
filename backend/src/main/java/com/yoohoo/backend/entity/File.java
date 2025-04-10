package com.yoohoo.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.util.Date;

@Entity
@Data
public class File {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long fileId;

    @Column(length = 225, nullable = false)
    private String fileName;

    @Column(nullable = false)
    private Long fileSize;

    @Column(length = 100, nullable = false)
    private String contentType;

    @Column(nullable = false)
    private Integer entityType;

    @Column(nullable = false)
    private Long entityId;

    @Column(length = 255, nullable = false)
    private String fileUrl;

    @Column(nullable = false)
    private Date createdAt;

}