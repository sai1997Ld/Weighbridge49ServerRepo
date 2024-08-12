package com.weighbridge.weighbridgeoperator.payloads;

import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class WeighbridgeReportResponse {
    private String materialName;
    private String supplierOrCustomer;
    private List<WeighbridgeReportResponseList> weighbridgeResponse2List;
    private BigDecimal ch_SumQty;
    private BigDecimal weight_SumQty;
    private BigDecimal shtExcess_SumQty;
}

