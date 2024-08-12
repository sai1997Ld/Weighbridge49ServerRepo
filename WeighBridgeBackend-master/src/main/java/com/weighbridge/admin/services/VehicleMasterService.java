package com.weighbridge.admin.services;

import com.weighbridge.admin.dtos.VehicleMasterDto;
import com.weighbridge.admin.payloads.VehicleGateEntryResponse;
import com.weighbridge.admin.payloads.VehicleRequest;
import com.weighbridge.admin.payloads.VehicleResponse;
import com.weighbridge.admin.payloads.VehicleResponsePage;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public interface VehicleMasterService {

    String addVehicle(VehicleRequest vehicleRequest, String transporterName,String userId);

    VehicleResponsePage vehicles(Pageable pageable);

    public VehicleResponse vehicleByNo(String vehicleNo);

    String updateVehicleByVehicleNo(String vehicleNo, VehicleRequest vehicleRequest,String userId);

    String deleteVehicleByVehicleNo(String vehicleNo);

    VehicleGateEntryResponse getTransporterDetailByVehicle(String vehicleNo);

    VehicleMasterDto getVehicleById(Long vehicleId);

    String updateVehicleById(Long vehicleId, VehicleMasterDto vehicleDto,String userId);

    boolean deactivateVehicleById(Long vehicleId);

    boolean activateVehicleById(Long vehicleId);

    List<String> findVehicleLists();
}
