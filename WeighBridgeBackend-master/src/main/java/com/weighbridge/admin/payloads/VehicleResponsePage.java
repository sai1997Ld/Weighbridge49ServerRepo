package com.weighbridge.admin.payloads;

import com.weighbridge.gateuser.payloads.GateEntryTransactionResponse;
import lombok.Data;
import org.springframework.data.domain.Page;

import java.util.List;

@Data
public class VehicleResponsePage {
    private List<VehicleResponse> transactions;
    private Integer totalPages;
    private Long totalElements;
}



