package com.weighbridge.dms.payload;

import lombok.Data;

import java.time.LocalDate;

@Data
public class FileResponse {
    private String filePath;
    private String fileName;
    private Long fileSize;
    private LocalDate createdDate;
}
