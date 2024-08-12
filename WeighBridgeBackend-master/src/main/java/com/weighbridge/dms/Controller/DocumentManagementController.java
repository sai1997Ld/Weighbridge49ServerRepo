package com.weighbridge.dms.Controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.weighbridge.dms.entity.DocumentEntity;
import com.weighbridge.dms.payload.FileResponse;
import com.weighbridge.dms.service.DocumentManagementService;

import org.springframework.core.io.Resource;
import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.util.List;

@RestController
@RequestMapping("/api/v1/documents")
public class DocumentManagementController {

    @Autowired
    private DocumentManagementService documentService;

	/*
	 * @Autowired private UserDetailsService userDetailsService;
	 */

	/*
	 * @Autowired private AuthenticationManager authenticationManager;
	 */

/*    @Autowired
    private FileStorageProperties fileStorageProperties;*/

    @PostMapping("/uploadDoc")
    public ResponseEntity<FileResponse> uploadDocument(@RequestParam("file") MultipartFile file,@RequestParam String companyName,@RequestParam String siteName,@RequestParam String userType) {
        try {
            FileResponse document = documentService.saveDocument(file,companyName,siteName,userType);
            return new ResponseEntity<>(document, HttpStatus.OK);
        } catch (IOException e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @GetMapping("/{id}")
    public ResponseEntity<DocumentEntity> getDocumentById(@PathVariable Long id) {
        DocumentEntity document = documentService.getDocumentById(id);
        if (document != null) {
            return new ResponseEntity<>(document, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }
    @GetMapping
    public ResponseEntity<List<DocumentEntity>> getAlldata(){
        List<DocumentEntity> allData = documentService.getAllData();
        return new ResponseEntity<List<DocumentEntity>>(allData,HttpStatus.OK);
    }
    @GetMapping("/retrieve/{fileName}")
    public ResponseEntity<Resource> retrieveDocument(@PathVariable String fileName) {
        try {
            Resource resource = documentService.loadFileAsResource(fileName);
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(Files.probeContentType(resource.getFile().toPath())))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                    .body(resource);
        }
        catch (IOException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @PostMapping("/createDirectory")
    public ResponseEntity<String> makeDirectory(@RequestParam String parentDirectory, @RequestParam String companyName, @RequestParam String siteName, @RequestParam String user) {
        String directory = documentService.createDirectory(parentDirectory, companyName, siteName, user);
        return ResponseEntity.ok(directory);
    }

    @GetMapping("/download/{file}")
    public ResponseEntity<Resource> downloadDocument(@PathVariable String file) {
        try {
            Resource resource = documentService.loadFileAsResource(file);
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(Files.probeContentType(resource.getFile().toPath())))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                    .body(resource);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

 /*   @PostMapping("/updateDirectory")
    public void updateDirectory(@RequestParam String directory) {
        fileStorageProperties.setDirectory(directory);
    }

    @GetMapping("/getDirectory")
    public String getDirectory() {
        return fileStorageProperties.getDirectory();
    }*/

	/*
	 * @PostMapping("/login") public String login(@RequestBody UserDetailsEntity
	 * user){ String userName = user.getUserName(); String password =
	 * user.getPassword(); Authentication authenticate =
	 * authenticationManager.authenticate( new
	 * UsernamePasswordAuthenticationToken(userName, password));
	 * SecurityContextHolder.getContext().setAuthentication(authenticate); return
	 * "login Successfull"; }
	 */
}