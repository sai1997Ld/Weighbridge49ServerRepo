package com.weighbridge.dms.service;

import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import com.weighbridge.dms.entity.DocumentEntity;
import com.weighbridge.dms.payload.FileResponse;

import org.springframework.core.io.Resource;

import java.io.IOException;
import java.util.List;

public interface DocumentManagementService {

    public FileResponse saveDocument(MultipartFile file,String companyName,String siteName,String userType) throws IOException;

    public DocumentEntity getDocumentById(Long id);

    public List<DocumentEntity> getAllData();

    public Resource loadFileAsResource(String fileName) throws IOException;
    byte[] getFromServer(String fileName) throws IOException;
   public String createDirectory(String parentDirectory,String companyName,String siteName,String userType);
   public String saveDocumentString(MultipartFile file,String companyName,String siteName,String userType) throws IOException;

}