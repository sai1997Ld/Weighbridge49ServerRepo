package com.weighbridge.weighbridgeoperator.payloads;

import lombok.Data;

import java.time.LocalDate;

@Data
public class WeighbridgeOperatorPrint {
    private String companyName;
    private String companyAdress;
    private Integer ticketNo;
    private String vehicleNo;
    private String productName;
    private String materialName;
    private String transporterName;
    private String customerName;
    private String supplierName;
    private String transactionType;
    private String challanNo;
    private String grossWeight;
    private String tareWeight;
    private String netWeight;
    private String grossWeightDate;
    private String grossWeightTime;
    private String tareWeightDate;
    private String tareWeightTime;
}