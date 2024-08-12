package com.weighbridge.dms.repository;


import org.springframework.data.jpa.repository.JpaRepository;

import com.weighbridge.dms.entity.DocumentEntity;

public interface DocumentsRepository extends JpaRepository<DocumentEntity,Long> {

    long countByFileName(String pattern);
    
    DocumentEntity findByFileName(String fileName);
}