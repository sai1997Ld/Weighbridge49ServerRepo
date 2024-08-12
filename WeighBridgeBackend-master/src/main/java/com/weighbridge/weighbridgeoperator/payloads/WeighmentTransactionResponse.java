package com.weighbridge.weighbridgeoperator.payloads;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;

@Data
public class WeighmentTransactionResponse {
        private String ticketNo;
        private String weighmentNo;
        private String transactionType;
        private LocalDate transactionDate;
        private String vehicleIn;
        private String vehicleOut;
        private String grossWeight;
        private String tareWeight;
        private String netWeight;
        private String vehicleNo;
        private String vehicleFitnessUpTo;
        private String supplierName;
        private String customerName;
        private String transporterName;
        private String materialName;
        private String materialType;
}