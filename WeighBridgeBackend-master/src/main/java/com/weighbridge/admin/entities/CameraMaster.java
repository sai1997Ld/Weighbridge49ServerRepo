package com.weighbridge.admin.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "camera_master")
public class CameraMaster {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String companyId;
    private String siteId;
    private Integer roleId;
    private String topCamUrl1;
    private String bottomCamUrl2;
    private String frontCamUrl3;
    private String backCamUrl4;
    private String leftCamUrl5;
    private String RightCamUrl6;
    private String createdBy;
    private String modifiedBy;
    private LocalDateTime createdDate;
    private LocalDateTime modifiedDate;
}
