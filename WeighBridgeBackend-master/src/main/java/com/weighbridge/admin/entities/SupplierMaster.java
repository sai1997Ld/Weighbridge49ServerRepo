package com.weighbridge.admin.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Entity
@Data
@Table(name = "supplier_master", indexes = {
        @Index(name = "idx_supplier_master1 ", columnList = "supplier_id"),
        @Index(name = "idx_supplier_master2", columnList = "supplier_id, supplierName, supplierAddressLine1, supplierAddressLine2")
})
public class SupplierMaster {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long supplierId;

    @NotBlank(message = "supplier Name is required")
    @Column(nullable = false)
    private String supplierName;
    @Column(name = "supplier_email_id")
    private String supplierEmail;

    @Column(name = "supplier_contact_no")
    private String supplierContactNo;
    @Column(nullable = false)
    private String supplierAddressLine1;
    private String supplierAddressLine2;
    
    private String city;
    private String state;
    private String country;
    private String zip;
    @Column(name = "supplier_status")
    private String supplierStatus="ACTIVE";

    @Column(name = "supplier_created_by")
    private String supplierCreatedBy;

    @Column(name = "supplier_created_date")
    private LocalDateTime supplierCreatedDate;

    @Column(name = "supplier_modified_by")
    private String supplierModifiedBy;

    @Column(name = "supplier_modified_date")
    private LocalDateTime supplierModifiedDate;
}
