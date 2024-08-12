package com.weighbridge.dms.service.Impl;


import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.weighbridge.dms.entity.DocumentEntity;
import com.weighbridge.dms.payload.FileResponse;
import com.weighbridge.dms.repository.DocumentsRepository;
import com.weighbridge.dms.service.DocumentManagementService;

import org.springframework.core.io.Resource;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.net.URI;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;

@Service
public class DocumentManagementServiceImpl implements DocumentManagementService {

	/*
	 * @Value("${file.directory}") private String FILE_DIRECTORY;
	 */
 /* private final FileStorageProperties fileStorageProperties;*/
//    private static final String FILE_DIRECTORY = "c:\\DMS\\DMS\\dms_image_file";
    @Autowired
    private DocumentsRepository documentsRepository;

    
    private String FILE_DIRECTORY;
    
    @Autowired
    private HttpServletRequest request;

   /* public DocumentManagementServiceImpl(FileStorageProperties fileStorageProperties) {
        this.fileStorageProperties = fileStorageProperties;
    }*/

    public FileResponse saveDocument(MultipartFile file,String companyName,String siteName,String userType) throws IOException {
    	FILE_DIRECTORY = getRootDirectory();
        String directory = createDirectory(FILE_DIRECTORY, companyName, siteName, userType);
        String originalFilename = file.getOriginalFilename();
        String[] fileExtension = file.getContentType().split("/"); // Optionally, extract the actual file extension
        String extension=fileExtension[fileExtension.length-1];
        String customFileName = UUID.randomUUID().toString() + "_" + LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd")) +"."+extension;
        String fullPath = directory + "\\" + customFileName; // Use forward slash here
        Path path = Paths.get(fullPath);

        // Ensure the parent directories exist
        Files.createDirectories(path.getParent());

        // Write file content to the specified path
        Files.write(path, file.getBytes());

        // Create and save DocumentEntity object
        DocumentEntity document = new DocumentEntity();
        document.setFileName(customFileName);
        document.setFilePath(fullPath);
        document.setContentType(file.getContentType());
        document.setCreatedDate(LocalDate.now());
        document.setFileSize(file.getSize());
        document.setModifiedDate(LocalDate.now());

        DocumentEntity savedDoc = documentsRepository.save(document);

        // Create and return FileResponse object
        FileResponse fileResponse = new FileResponse();
        fileResponse.setFileName(customFileName);
        fileResponse.setFilePath(fullPath);
        fileResponse.setFileSize(file.getSize());
        fileResponse.setCreatedDate(savedDoc.getCreatedDate());

        return fileResponse;

    }
    public String saveDocumentString(MultipartFile file,String companyName,String siteName,String userType) throws IOException {
    	   FILE_DIRECTORY = getRootDirectory();
           String directory = createDirectory(FILE_DIRECTORY, companyName, siteName, userType);
           
           // Use original filename instead of generating a custom one
           String originalFilename = file.getOriginalFilename();
           if (originalFilename == null || originalFilename.isEmpty()) {
               throw new IOException("Original filename is missing.");
           }

           // Full path including directory and the original filename
           String fullPath = directory + "\\" + originalFilename; // Use backslash for Windows paths
           Path path = Paths.get(fullPath);

           // Ensure the parent directories exist
           Files.createDirectories(path.getParent());

           // Write file content to the specified path
           Files.write(path, file.getBytes());

           // Create and return the file path
           return path.toString();

    }

    private String getRootDirectory() {
        // Get the root directory of the system
        File[] roots = File.listRoots();
        if (roots != null && roots.length > 0) {
            return roots[0].getAbsolutePath();
        } else {
            throw new IllegalStateException("No root directory found");
        }
    }

 /*   private String createFileName(Long ticketNo,String userType,String originalFileName){
        String fileExtension = null;
        if (originalFileName != null && originalFileName.contains(".")) {
            fileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));
        }

        String pattern = ticketNo + "_" + userType;
        long existingCount = documentsRepository.countByFileNamePattern(pattern);
        String customFileName = ticketNo + "_" + userType + (existingCount + 1) + fileExtension;
        return customFileName;
    }*/

    public DocumentEntity getDocumentById(Long id) {
        return documentsRepository.findById(id).orElse(null);
    }
    public List<DocumentEntity> getAllData(){
        List<DocumentEntity> findAll = documentsRepository.findAll();
        return findAll;
    }
    public Resource loadFileAsResource(String fileName) throws IOException {
    	 DocumentEntity byFileName = documentsRepository.findByFileName(fileName);
         String fullPath = byFileName.getFilePath();
         String[] paths = fullPath.split("\\\\");  // Use "\\\\" for escaping backslashes in regex

         // Join the array elements except for the last one to get the directory path
         StringBuilder directoryPathBuilder = new StringBuilder();
         for (int i = 0; i < paths.length - 1; i++) {
             directoryPathBuilder.append(paths[i]);
             if (i < paths.length - 2) {
                 directoryPathBuilder.append("\\"); // Add back the separator
             }
         }
         String directoryPath = directoryPathBuilder.toString();
         System.out.println("hi"+directoryPathBuilder);
         try {
             Path filePath = Paths.get(directoryPath).resolve(fileName).normalize();
             System.out.println(filePath);
             Resource resource = new UrlResource(filePath.toUri());
             if (resource.exists() || resource.isReadable()) {
                 System.out.println(resource);
                 return resource;
             } else {
                 throw new IOException("File not found or not readable: " + fileName);
             }
         } catch (MalformedURLException e) {
             throw new IOException("File not found or not readable: " + fileName, e);
         }
    }

    public byte[] getFromServer(String filePath) throws IOException {
    	InputStream inputStream = null;
        ByteArrayOutputStream byteArrayOutputStream = null;

        try {
            // Normalize the file path
            String normalizedPath = filePath.replace("\\", "/");
            System.out.println("path=========="+normalizedPath);
            // Create a URL from the file path
            URL fileUrl = new URL("file:///" + normalizedPath);
            Resource resource = new UrlResource(fileUrl);

            if (resource.exists() && resource.isReadable()) {
                inputStream = resource.getInputStream();
                byteArrayOutputStream = new ByteArrayOutputStream();

                byte[] buffer = new byte[1024];
                int bytesRead;

                while ((bytesRead = inputStream.read(buffer)) != -1) {
                    byteArrayOutputStream.write(buffer, 0, bytesRead);
                }

                return byteArrayOutputStream.toByteArray();
            } else {
                throw new IOException("File not found or not readable: " + filePath);
            }
        } catch (MalformedURLException e) {
            throw new IOException("Invalid file URL: " + filePath, e);
        } catch (Exception e) {
            throw new IOException("Error accessing file: " + filePath, e);
        } finally {
            if (inputStream != null) {
                try {
                    inputStream.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
            if (byteArrayOutputStream != null) {
                try {
                    byteArrayOutputStream.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
    }
    public String createDirectory(String parentDirectory, String companyName, String siteName, String userType) {
        try {
            HttpSession httpSession = request.getSession();
            parentDirectory = parentDirectory.replace("\\", "/"); // Ensure the directory uses forward slashes
            File parentDir = new File(parentDirectory);
            if (!parentDir.exists()) {
                return "Parent directory does not exist.";
            }

            // Construct the full path for the new directory
            File newFolder = new File(parentDir, companyName + "/" + siteName + "/" + userType);

            if (newFolder.exists()) {
                httpSession.setAttribute("path", newFolder.getAbsolutePath());
                System.out.println(newFolder.getAbsolutePath());
                return newFolder.getAbsolutePath();
            }

            boolean created = newFolder.mkdirs(); // Use mkdirs() to create intermediate directories if necessary
            if (created) {
                httpSession.setAttribute("path", newFolder.getAbsolutePath());
                System.out.println(newFolder.getAbsolutePath());
                return newFolder.getAbsolutePath();
            } else {
                return "Failed to create directory.";
            }
        } catch (Exception e) {
            e.printStackTrace();
            return "Error creating directory: " + e.getMessage();
        }
    }
}