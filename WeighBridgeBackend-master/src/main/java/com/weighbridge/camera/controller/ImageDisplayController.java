package com.weighbridge.camera.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.io.*;
import java.nio.file.*;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

@Controller
@RequestMapping("/api/v1/camera")
/**
 * Controller for upload image from Client Jar File
 *
 */

public class ImageDisplayController {

//    java -jar target/your-application.jar --company.name=YourCompanyName --site.name=YourSiteName



    private static final String UPLOAD_DIR = "E:/Camera/";

    @PostMapping("/upload/image")
    public ResponseEntity<String> handleImageUpload(@RequestBody Map<String, String> payload) {
        String company = payload.get("company");
        String site = payload.get("site");
        String location = payload.get("type");  // "gate1", "weigh1", etc.
        String index = payload.get("index");

        // Get the filename for the current image
        String filename = String.format("%s_%s_%s_img.jpg", company, site, location + index);
        File uploadFile = new File(UPLOAD_DIR + company + "/" + site + "/" + location + index + "/" + filename);
        uploadFile.getParentFile().mkdirs();

        String base64Image = payload.get("image");

        try {
            // Delete the old file if it exists
            if (uploadFile.exists()) {
                uploadFile.delete();
            }

            // Decode the base64 string to byte array
            byte[] imageBytes = Base64.getDecoder().decode(base64Image);

            // Write the byte array to the file
            Files.write(uploadFile.toPath(), imageBytes);

            return ResponseEntity.ok("File uploaded successfully: " + filename);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to upload file: " + e.getMessage());
        }
    }

    @GetMapping("/latest-images")
    public ResponseEntity<Map<String, String>> getLatestImage(@RequestParam("company") String company,
                                                              @RequestParam("site") String site,
                                                              @RequestParam("location") String location) {
        String key = String.format("%s_%s_%s", company, site, location);
        String filename = String.format("%s_%s_%s_img.jpg", company, site, location);
        File file = new File(UPLOAD_DIR + company + "/" + site + "/" + location + "/" + filename);

        if (file.exists()) {
            try {
                byte[] fileContent = Files.readAllBytes(file.toPath());
                String base64Image = Base64.getEncoder().encodeToString(fileContent);

                Map<String, String> imageMap = new HashMap<>();
                imageMap.put("image", base64Image);

                return ResponseEntity.ok(imageMap);
            } catch (IOException e) {
                e.printStackTrace();
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
            }
        }

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
    }
}
