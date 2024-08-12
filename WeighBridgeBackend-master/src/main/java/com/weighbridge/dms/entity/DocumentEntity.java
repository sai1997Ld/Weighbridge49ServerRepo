package com.weighbridge.dms.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Entity
@Table(name = "document")
@AllArgsConstructor
@NoArgsConstructor
public class DocumentEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name="file_name")
    private String fileName;
    @Column(name="file_path")
    private String filePath;
    private String contentType;
    private LocalDate createdDate;
    private LocalDate modifiedDate;
    private String createdBy;
    private String modifiedBy;
    private Long fileSize;
}