package com.weighbridge.admin.dtos;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CustomerMasterDto {
    private long customerId;
    @NotBlank(message = "supplier Name is required")
    private String customerName;

    private String customerEmail;

    private String customerContactNo;
    private String customerStatus;
    private String customerAddressLine1;
    private String customerAddressLine2;
    private String city;
    private String state;
    private String country;
    private String zip;
}
