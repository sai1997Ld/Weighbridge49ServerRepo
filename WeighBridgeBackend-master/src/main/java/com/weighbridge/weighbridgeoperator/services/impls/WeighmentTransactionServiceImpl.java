package com.weighbridge.weighbridgeoperator.services.impls;

import com.weighbridge.SalesManagement.entities.SalesOrder;
import com.weighbridge.SalesManagement.entities.SalesProcess;
import com.weighbridge.SalesManagement.repositories.SalesOrderRespository;
import com.weighbridge.SalesManagement.repositories.SalesProcessRepository;
import com.weighbridge.admin.entities.RoleMaster;
import com.weighbridge.admin.entities.UserMaster;
import com.weighbridge.admin.entities.VehicleMaster;
import com.weighbridge.admin.exceptions.ResourceNotFoundException;
import com.weighbridge.admin.repsitories.*;
import com.weighbridge.camera.entites.CameraView;
import com.weighbridge.camera.repositories.CameraRepository;
import com.weighbridge.camera.services.CameraViewService;
import com.weighbridge.gateuser.entities.GateEntryTransaction;
import com.weighbridge.gateuser.entities.TransactionLog;
import com.weighbridge.weighbridgeoperator.entities.VehicleTransactionStatus;
import com.weighbridge.gateuser.repositories.GateEntryTransactionRepository;
import com.weighbridge.gateuser.repositories.TransactionLogRepository;
import com.weighbridge.weighbridgeoperator.entities.WeighmentTransaction;


import com.weighbridge.weighbridgeoperator.payloads.TicketResponse;
import com.weighbridge.weighbridgeoperator.payloads.WeighbridgePageResponse;
import com.weighbridge.weighbridgeoperator.payloads.WeighmentRequest;
import com.weighbridge.weighbridgeoperator.payloads.WeighmentTransactionResponse;
import com.weighbridge.weighbridgeoperator.repositories.VehicleTransactionStatusRepository;
import com.weighbridge.weighbridgeoperator.repositories.WeighmentTransactionRepository;
import com.weighbridge.weighbridgeoperator.services.WeighmentTransactionService;
import jakarta.servlet.http.HttpServletRequest;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPut;
import org.apache.http.entity.InputStreamEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class WeighmentTransactionServiceImpl implements WeighmentTransactionService {
    @Autowired
    private WeighmentTransactionRepository weighmentTransactionRepository;

    @Autowired
    private GateEntryTransactionRepository gateEntryTransactionRepository;

    @Autowired
    private HttpServletRequest httpServletRequest;

    @Autowired
    private VehicleTransactionStatusRepository vehicleTransactionStatusRepository;

    @Autowired
    private TransactionLogRepository transactionLogRepository;

    @Autowired
    private MaterialMasterRepository materialMasterRepository;

    @Autowired
    private SupplierMasterRepository supplierMasterRepository;

    @Autowired
    private TransporterMasterRepository transporterMasterRepository;

    @Autowired
    private VehicleMasterRepository vehicleMasterRepository;

    @Autowired
    private SalesProcessRepository salesProcessRepository;

    @Autowired
    private CustomerMasterRepository customerMasterRepository;

    @Autowired
    private SalesOrderRespository salesOrderRespository;

    @Autowired
    private ProductMasterRepository productMasterRepository;

    @Autowired
    private UserMasterRepository userMasterRepository;

    @Autowired
    private UserAuthenticationRepository userAuthenticationRepository;

    @Autowired
    private RoleMasterRepository roleMasterRepository;

    @Autowired
    private CameraRepository cameraRepository;

    @Autowired
    private CameraViewService cameraViewService;
    @Value("${nextcloud.base-url}")
    private String baseUrl;

    @Value("${nextcloud.username}")
    private String username;

    @Value("${nextcloud.password}")
    private String password;

    @Override
    public String saveWeight(WeighmentRequest weighmentRequest,String userId, MultipartFile frontImg1, MultipartFile backImg2, MultipartFile topImg3,
                             MultipartFile bottomImg4, MultipartFile leftImg5,
                             MultipartFile rightImg6, String role) {
        GateEntryTransaction gateEntryId = gateEntryTransactionRepository.findById(weighmentRequest.getTicketNo()).get();
        WeighmentTransaction weighmentTicketNo = weighmentTransactionRepository.findByGateEntryTransactionTicketNo(weighmentRequest.getTicketNo());
        VehicleTransactionStatus byTicketNo = vehicleTransactionStatusRepository.findByTicketNo(weighmentRequest.getTicketNo());
        if (weighmentTicketNo == null) {
            WeighmentTransaction weighmentTransaction = new WeighmentTransaction();
            weighmentTransaction.setGateEntryTransaction(gateEntryId);
            weighmentTransaction.setMachineId(weighmentRequest.getMachineId());
            weighmentTransaction.setTemporaryWeight(weighmentRequest.getWeight()/1000);
            weighmentTransactionRepository.save(weighmentTransaction);
            try {
                System.out.println("--------------");
                // please do uncomment 1st code below if want to use nextcloud 
              //  cameraViewService.uploadImages(weighmentRequest.getTicketNo(), frontImg1, backImg2, topImg3, bottomImg4, leftImg5, rightImg6, role,"ENTRY");
                cameraViewService.uploadImagesUserId(weighmentRequest.getTicketNo(), frontImg1, backImg2, topImg3, bottomImg4, leftImg5, rightImg6, role,"ENTRY",userId);

            }
            catch (IOException ie){
                ie.printStackTrace();
            }
            //History save with vehicle intime and vehicle out time
            TransactionLog transactionLog = new TransactionLog();
            transactionLog.setUserId(userId);
            transactionLog.setTicketNo(weighmentRequest.getTicketNo());
            transactionLog.setTimestamp(LocalDateTime.now());

            if (gateEntryId.getTransactionType().equalsIgnoreCase("Inbound")) {
                byTicketNo.setStatusCode("GWT");
                transactionLog.setStatusCode("GWT");
            } else {
                byTicketNo.setStatusCode("TWT");
                transactionLog.setStatusCode("TWT");
            }
            vehicleTransactionStatusRepository.save(byTicketNo);
            transactionLogRepository.save(transactionLog);
            return "First Weight saved.";
        } else {
            //History save with vehicle intime and vehicle out time
            if (gateEntryId.getTransactionType().equalsIgnoreCase("Inbound") && byTicketNo.getStatusCode().equalsIgnoreCase("TWT")) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Tare Weight already saved.");
            }

            if (gateEntryId.getTransactionType().equalsIgnoreCase("Outbound") && byTicketNo.getStatusCode().equalsIgnoreCase("GWT")) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Gross Weight already saved.");
            }

            double temporaryWeight = weighmentTicketNo.getTemporaryWeight();
            double secondWeight=weighmentRequest.getWeight()/1000;
            if (temporaryWeight > secondWeight) {
                weighmentTicketNo.setGrossWeight(temporaryWeight);
                weighmentTicketNo.setTareWeight(secondWeight);
            } else {
                weighmentTicketNo.setTareWeight(temporaryWeight);
                weighmentTicketNo.setGrossWeight(secondWeight);
            }
            double netWeight = Math.abs(temporaryWeight - secondWeight);
            weighmentTicketNo.setNetWeight(netWeight);

            weighmentTransactionRepository.save(weighmentTicketNo);
            try {
                System.out.println("--------------");
                // please do uncomment 1st code below if want to use nextcloud 
             //   cameraViewService.uploadImages(weighmentRequest.getTicketNo(), frontImg1, backImg2, topImg3, bottomImg4, leftImg5, rightImg6, role,"EXIT");
               cameraViewService.uploadImagesUserId(weighmentRequest.getTicketNo(), frontImg1, backImg2, topImg3, bottomImg4, leftImg5, rightImg6, role,"EXIT",userId);

            }
            catch (IOException ie){
                ie.printStackTrace();
            }
            TransactionLog transactionLog = new TransactionLog();
            transactionLog.setUserId(userId);
            transactionLog.setTicketNo(weighmentRequest.getTicketNo());
            transactionLog.setTimestamp(LocalDateTime.now());


            //Vehiclestatus details
            if (gateEntryId.getTransactionType().equalsIgnoreCase("Outbound")) {
                byTicketNo.setStatusCode("GWT");
                transactionLog.setStatusCode("GWT");
            } else {
                byTicketNo.setStatusCode("TWT");
                transactionLog.setStatusCode("TWT");
            }
            vehicleTransactionStatusRepository.save(byTicketNo);
            transactionLogRepository.save(transactionLog);
            SalesProcess salesProcess=salesProcessRepository.findBySalePassNo(gateEntryId.getTpNo());
            String extraSalePass = salesProcess != null ? salesProcess.getExtraSalePassNo() : null;
            String selectedSaleOrder = salesProcess != null ? salesProcess.getSelectedSaleOrder() : null;
            System.out.println(extraSalePass);
            System.out.println(selectedSaleOrder);
            //to handle if newSalepass generated incase of low balancequantity for any salesorder
            if(gateEntryId.getTransactionType().equalsIgnoreCase("Outbound")&&extraSalePass!=null){
                newSaleOrder(gateEntryId.getTicketNo(), netWeight);
            }

            //to handle if newSalepass generated incase of low balancequantity for any salesorder
            else if(gateEntryId.getTransactionType().equalsIgnoreCase("Outbound")&&selectedSaleOrder!=null){
                existingSaleOrder(selectedSaleOrder,netWeight, gateEntryId.getTicketNo());
            }

            else {
                if (gateEntryId.getTransactionType().equalsIgnoreCase("Outbound")){
                SalesProcess bySalePassNo = salesProcessRepository.findBySalePassNo(gateEntryId.getTpNo());
                SalesOrder bySaleOrderNo = salesOrderRespository.findBySaleOrderNo(bySalePassNo.getPurchaseSale().getSaleOrderNo());
                if(gateEntryId.getMaterialType()!=null&&gateEntryId.getMaterialType().equalsIgnoreCase("lumps")){
                    double lumpsQty = bySaleOrderNo.getLumps() - netWeight;
                    bySaleOrderNo.setLumps(lumpsQty);
                }
                if(gateEntryId.getMaterialType()!=null&&gateEntryId.getMaterialType().equalsIgnoreCase("fines")){
                    double finesQty = bySaleOrderNo.getFines() - netWeight;
                    bySaleOrderNo.setFines(finesQty);
                }
                    double progressiveQty = bySaleOrderNo.getProgressiveQuantity() + netWeight;
                    double balanceQty = bySaleOrderNo.getOrderedQuantity() - progressiveQty;
                    bySaleOrderNo.setProgressiveQuantity(progressiveQty);
                    bySaleOrderNo.setBalanceQuantity(balanceQty);
                    if(bySaleOrderNo.getBalanceQuantity()<=0){
                        bySaleOrderNo.setStatus(false);
                    }
                    salesOrderRespository.save(bySaleOrderNo);
                    }
            }
            return "Second weight saved";
        }
    }


    @Override
    public WeighbridgePageResponse getAllGateDetails(Pageable pageable,String userId) {
        DateTimeFormatter formatter1 = DateTimeFormatter.ofPattern("dd-MM-yyyy");
        UserMaster byId = userMasterRepository.findById(userId).orElseThrow(()->new ResourceNotFoundException("userId not found"));
        Page<Object[]> pageResult = weighmentTransactionRepository.getAllGateEntries(byId.getSite().getSiteId(),byId.getCompany().getCompanyId(),pageable);
        List<Object[]> allUsers = pageResult.getContent();
        System.out.println(allUsers);
        List<WeighmentTransactionResponse> responses = new ArrayList<>();
        if (allUsers == null) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "No gateEntries yet.");
        } else {
            try {
                for (Object[] row : allUsers) {
                    WeighmentTransactionResponse response = new WeighmentTransactionResponse();
                    response.setTicketNo(String.valueOf(row[0]));
                    TransactionLog byTicketNo = transactionLogRepository.findByTicketNoAndStatusCode((Integer) row[0], "GWT");
                    TransactionLog byTicketNo2 = transactionLogRepository.findByTicketNoAndStatusCode((Integer) row[0], "TWT");
                    LocalDateTime timestamp = null, timestamp1 = null;
                    String restTimeStamp=null,restTimeStamp1=null;
                    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm:ss");
                    if (byTicketNo != null) {
                        timestamp = byTicketNo.getTimestamp();
                        restTimeStamp = timestamp != null ? timestamp.format(formatter) : "";
                    }
                    if (byTicketNo2 != null) {
                        timestamp1 = byTicketNo2.getTimestamp();
                        restTimeStamp1 = timestamp1 != null ? timestamp1.format(formatter) : "";
                    }
                    String weighmentNo = row[1]!=null ? String.valueOf(row[1]):" ";
                    response.setWeighmentNo(weighmentNo);
                    response.setTransactionType((String) row[2]);
                    response.setTransactionDate((LocalDate)row[3]);
                    LocalDateTime vehicleInDateTime = (LocalDateTime) row[4];
                    response.setVehicleIn(vehicleInDateTime.format(formatter));
                    if (((String) row[2]).equalsIgnoreCase("Inbound")) {
                        if(row[8]!=null&&row[6]!=null) {
                            response.setGrossWeight(multiplyWeight(row[8]));
                            response.setTareWeight(multiplyWeight(row[6]));
                        }
                        else{
                            response.setGrossWeight("");
                            response.setTareWeight("");
                        }
                    } else {
                        if(row[8]!=null&&row[5]!=null) {
                            response.setTareWeight(multiplyWeight(row[8]));
                            response.setGrossWeight(multiplyWeight(row[5]));
                        }
                        else{
                            response.setGrossWeight("");
                            response.setTareWeight("");
                        }
                    }
                    BigDecimal netWeight = row[7] != null? BigDecimal.valueOf((Double) row[7]).multiply(BigDecimal.valueOf(1000)).setScale(3, RoundingMode.HALF_UP) : null;
                    response.setNetWeight(netWeight != null ? netWeight.toString() : "");
                 //   response.setNetWeight(row[7] != null ? multiplyWeight(row[7]) : "");
                    response.setVehicleNo((String) row[9]);
                    LocalDate localDate= (LocalDate) row[10];
                    response.setVehicleFitnessUpTo(localDate!=null?localDate.format(formatter1):"");
                    if (((String) row[2]).equalsIgnoreCase("Inbound")) {
                        response.setSupplierName((String) row[11]);
                        response.setCustomerName("");
                        response.setMaterialName((String) row[13]);
                        response.setMaterialType((String) row[14]); // Set materialType for inbound

                    } else {
                        response.setCustomerName((String) row[11]);
                        response.setSupplierName("");
                        response.setMaterialName((String) row[13]);
                        response.setMaterialType((String) row[14]); // Set materialType for inbound

                    }

                    response.setTransporterName((String) row[12]);
                    // Set other fields similarly
                    responses.add(response);
                }
            } catch (Exception e) {
                throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
            }
            WeighbridgePageResponse weighbridgePageResponse=new WeighbridgePageResponse();
            weighbridgePageResponse.setWeighmentTransactionResponses(responses);
            weighbridgePageResponse.setTotalPages((long) pageResult.getTotalPages());
            weighbridgePageResponse.setTotalElements(pageResult.getTotalElements());
            return weighbridgePageResponse;
        }
    }

    private String multiplyWeight(Object weightObj) {
        if (weightObj != null) {
            try {
                double weight = Double.parseDouble(String.valueOf(weightObj));
                weight *= 1000; // Multiply by 1000
                return String.valueOf(weight);
            } catch (NumberFormatException e) {
                return "";
            }
        }
        return "";
    }

    @Override
    public TicketResponse getResponseByTicket(Integer ticketNo) {
        GateEntryTransaction gateEntryTransaction = gateEntryTransactionRepository.findById(ticketNo).get();
        if (gateEntryTransaction == null) {
            throw new ResourceNotFoundException("ticket", "ticketNo", ticketNo.toString());
        }
        else {
            System.out.println("site id" + gateEntryTransaction.getSupplierId());
            TicketResponse ticketResponse = new TicketResponse();
            ticketResponse.setPoNo(gateEntryTransaction.getPoNo());
            ticketResponse.setTpNo(gateEntryTransaction.getTpNo());
            ticketResponse.setChallanNo(gateEntryTransaction.getChallanNo());
            ticketResponse.setTransporter(transporterMasterRepository.findTransporterNameByTransporterId(gateEntryTransaction.getTransporterId()));
            ticketResponse.setDriverName(gateEntryTransaction.getDriverName());
            VehicleMaster vehicleMaster = vehicleMasterRepository.findById(gateEntryTransaction.getVehicleId()).orElseThrow(() -> new ResourceNotFoundException("Vehicle is not found"));

            ticketResponse.setVehicleNo(vehicleMaster.getVehicleNo());

            Optional<TransactionLog> byTicketNoGWT = Optional.ofNullable(transactionLogRepository.findByTicketNoAndStatusCode(ticketNo, "GWT"));
            Optional<TransactionLog> byTicketNoTWT = Optional.ofNullable(transactionLogRepository.findByTicketNoAndStatusCode(ticketNo, "TWT"));

            LocalDateTime grossWeightTime = byTicketNoGWT.map(TransactionLog::getTimestamp).map(t -> t.withSecond(0).withNano(0)).orElse(null);
            LocalDateTime tareWeightTime = byTicketNoTWT.map(TransactionLog::getTimestamp).map(t -> t.withSecond(0).withNano(0)).orElse(null);

            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
            if (grossWeightTime != null) {
                ticketResponse.setGrossWeightTime(grossWeightTime.format(formatter));
            }

            if (tareWeightTime != null) {
                ticketResponse.setTareWeightTime(tareWeightTime.format(formatter));
            }

            String transactionType = gateEntryTransaction.getTransactionType();
            WeighmentTransaction byGateEntryTransactionTicketNo = weighmentTransactionRepository.findByGateEntryTransactionTicketNo(ticketNo);

            if (transactionType.equalsIgnoreCase("Inbound")) {
                if (byGateEntryTransactionTicketNo != null) {
                    ticketResponse.setGrossWeight(byGateEntryTransactionTicketNo.getTemporaryWeight()*1000);
                    ticketResponse.setTareWeight(byGateEntryTransactionTicketNo.getTareWeight()*1000);
                }
                Object[] supplierInfo = supplierMasterRepository.findSupplierNameAndAddressBySupplierId(gateEntryTransaction.getSupplierId());
                Object[] supplierData = (Object[]) supplierInfo[0];
                if (supplierData != null && supplierData.length >= 2) {
                    String supplierName = (String) supplierData[0];
                    String supplierAddress = (String) supplierData[1];
                    System.out.println(supplierName + " " + supplierAddress);
                    ticketResponse.setSupplierName(supplierName);
                    ticketResponse.setSupplierAddress(supplierAddress);
                    ticketResponse.setMaterial(materialMasterRepository.findMaterialNameByMaterialId(gateEntryTransaction.getMaterialId()));
                    ticketResponse.setMaterialType(gateEntryTransaction.getMaterialType());
                }
            }
            if (transactionType.equalsIgnoreCase("Outbound")) {
                if (byGateEntryTransactionTicketNo != null) {
                    ticketResponse.setTareWeight(byGateEntryTransactionTicketNo.getTemporaryWeight()*1000);
                    ticketResponse.setGrossWeight(byGateEntryTransactionTicketNo.getGrossWeight()*1000);
                    ticketResponse.setMaterial(productMasterRepository.findProductNameByProductId(gateEntryTransaction.getMaterialId()));
                    ticketResponse.setMaterialType(gateEntryTransaction.getMaterialType());
                    SalesProcess bySalePassNo = salesProcessRepository.findBySalePassNo(gateEntryTransaction.getTpNo());
                    SalesOrder bySaleOrderNo = salesOrderRespository.findBySaleOrderNo(bySalePassNo.getPurchaseSale().getSaleOrderNo());
                    ticketResponse.setBalanceWeight(bySaleOrderNo.getBalanceQuantity());
                }
                Object[] customerInfo = customerMasterRepository.findCustomerNameAndAddressBycustomerId(gateEntryTransaction.getCustomerId());
                Object[] customerData = (Object[]) customerInfo[0];
                if (customerData != null && customerData.length >= 2) {
                    String customerName = (String) customerData[0];
                    String customerAddress = (String) customerData[1];
                    System.out.println(customerName + " " + customerAddress);
                    ticketResponse.setCustomerName(customerName);
                    ticketResponse.setCustomerAdress(customerAddress);
                }
            }
            if (byGateEntryTransactionTicketNo != null) {
                ticketResponse.setNetWeight(byGateEntryTransactionTicketNo.getGrossWeight() - byGateEntryTransactionTicketNo.getTareWeight());
            }
            ticketResponse.setDriverDlNo(gateEntryTransaction.getDlNo());
            Double supplyConsignmentWeight = gateEntryTransaction.getSupplyConsignmentWeight();
            if(supplyConsignmentWeight!=null) {
                ticketResponse.setConsignmentWeight(supplyConsignmentWeight*1000);
            }
            else{
                ticketResponse.setConsignmentWeight(0.0);
            }
            return ticketResponse;
        }
    }

    @Override
    public TicketImageResponse viewResponseByTicket(Integer ticketNo,String userId) {
        GateEntryTransaction gateEntryTransaction = gateEntryTransactionRepository.findById(ticketNo).get();
        if (gateEntryTransaction == null) {
            throw new ResourceNotFoundException("ticket", "ticketNo", ticketNo.toString());
        }
        else {
            System.out.println("site id" + gateEntryTransaction.getSupplierId());
            TicketResponse ticketResponse = new TicketResponse();
            ticketResponse.setPoNo(gateEntryTransaction.getPoNo());
            ticketResponse.setTpNo(gateEntryTransaction.getTpNo());
            ticketResponse.setChallanNo(gateEntryTransaction.getChallanNo());
            ticketResponse.setMaterial(materialMasterRepository.findMaterialNameByMaterialId(gateEntryTransaction.getMaterialId()));
            ticketResponse.setTransporter(transporterMasterRepository.findTransporterNameByTransporterId(gateEntryTransaction.getTransporterId()));
            ticketResponse.setDriverName(gateEntryTransaction.getDriverName());
            VehicleMaster vehicleMaster = vehicleMasterRepository.findById(gateEntryTransaction.getVehicleId()).orElseThrow(() -> new ResourceNotFoundException("Vehicle is not found"));

            ticketResponse.setVehicleNo(vehicleMaster.getVehicleNo());

            Optional<TransactionLog> byTicketNoGWT = Optional.ofNullable(transactionLogRepository.findByTicketNoAndStatusCode(ticketNo, "GWT"));
            Optional<TransactionLog> byTicketNoTWT = Optional.ofNullable(transactionLogRepository.findByTicketNoAndStatusCode(ticketNo, "TWT"));

            LocalDateTime grossWeightTime = byTicketNoGWT.map(TransactionLog::getTimestamp).map(t -> t.withSecond(0).withNano(0)).orElse(null);
            LocalDateTime tareWeightTime = byTicketNoTWT.map(TransactionLog::getTimestamp).map(t -> t.withSecond(0).withNano(0)).orElse(null);

            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
            if (grossWeightTime != null) {
                ticketResponse.setGrossWeightTime(grossWeightTime.format(formatter));
            }

            if (tareWeightTime != null) {
                ticketResponse.setTareWeightTime(tareWeightTime.format(formatter));
            }

            String transactionType = gateEntryTransaction.getTransactionType();
            WeighmentTransaction byGateEntryTransactionTicketNo = weighmentTransactionRepository.findByGateEntryTransactionTicketNo(ticketNo);

            if (transactionType.equalsIgnoreCase("Inbound")) {
                if (byGateEntryTransactionTicketNo != null) {
                    ticketResponse.setGrossWeight(byGateEntryTransactionTicketNo.getTemporaryWeight()*1000);
                    ticketResponse.setTareWeight(byGateEntryTransactionTicketNo.getTareWeight()*1000);
                }
                Object[] supplierInfo = supplierMasterRepository.findSupplierNameAndAddressBySupplierId(gateEntryTransaction.getSupplierId());
                Object[] supplierData = (Object[]) supplierInfo[0];
                if (supplierData != null && supplierData.length >= 2) {
                    String supplierName = (String) supplierData[0];
                    String supplierAddress = (String) supplierData[1];
                    System.out.println(supplierName + " " + supplierAddress);
                    ticketResponse.setSupplierName(supplierName);
                    ticketResponse.setSupplierAddress(supplierAddress);
                }
            }
            if (transactionType.equalsIgnoreCase("Outbound")) {
                if (byGateEntryTransactionTicketNo != null) {
                    ticketResponse.setTareWeight(byGateEntryTransactionTicketNo.getTemporaryWeight()*1000);
                    ticketResponse.setGrossWeight(byGateEntryTransactionTicketNo.getGrossWeight()*1000);
                }
                Object[] customerInfo = customerMasterRepository.findCustomerNameAndAddressBycustomerId(gateEntryTransaction.getCustomerId());
                Object[] customerData = (Object[]) customerInfo[0];
                if (customerData != null && customerData.length >= 2) {
                    String customerName = (String) customerData[0];
                    String customerAddress = (String) customerData[1];
                    System.out.println(customerName + " " + customerAddress);
                    ticketResponse.setCustomerName(customerName);
                    ticketResponse.setCustomerAdress(customerAddress);
                }
            }
            if (byGateEntryTransactionTicketNo != null) {
                ticketResponse.setNetWeight(byGateEntryTransactionTicketNo.getGrossWeight() - byGateEntryTransactionTicketNo.getTareWeight());
            }
            ticketResponse.setDriverDlNo(gateEntryTransaction.getDlNo());
            Double supplyConsignmentWeight = gateEntryTransaction.getSupplyConsignmentWeight();
            if(supplyConsignmentWeight!=null) {
                ticketResponse.setConsignmentWeight(supplyConsignmentWeight*1000);
            }
            else{
                ticketResponse.setConsignmentWeight(0.0);
            }
            Set<RoleMaster> rolesByUserId = userAuthenticationRepository.findRolesByUserId(userId);
            String role = rolesByUserId.stream()
                    .findFirst()
                    .map(RoleMaster::getRoleName)
                    .orElseThrow(() -> new IllegalStateException("No roles found for userId: " + userId));


            Map<String, byte[]> inMap = cameraViewService.downloadImages(ticketNo, role, gateEntryTransaction.getCompanyId(), gateEntryTransaction.getSiteId(),"ENTRY");
            Map<String, byte[]> outMap = cameraViewService.downloadImages(ticketNo, role, gateEntryTransaction.getCompanyId(), gateEntryTransaction.getSiteId(),"EXIT");

            TicketImageResponse ticketImageResponse = new TicketImageResponse();
            ticketImageResponse.setTicketResponse(ticketResponse);
            ticketImageResponse.setInImagesMap(inMap);
            ticketImageResponse.setOutImagesMap(outMap);
            return ticketImageResponse;
        }
    }

    @Override
    public String newSaleOrder(Integer ticketNo, Double netWeight) {
        GateEntryTransaction gateEntryTransaction = gateEntryTransactionRepository.findById(ticketNo).orElseThrow(() -> new ResourceNotFoundException("ticket not found"));
        SalesProcess bySalePassNo = salesProcessRepository.findBySalePassNo(gateEntryTransaction.getTpNo());
        SalesOrder bySaleOrderNo = salesOrderRespository.findBySaleOrderNo(bySalePassNo.getPurchaseSale().getSaleOrderNo());
        if(gateEntryTransaction.getMaterialType()!=null&&gateEntryTransaction.getMaterialType().equalsIgnoreCase("lumps")){
            bySalePassNo.setExtraSalePassNo(bySalePassNo.getExtraSalePassNo()+"_"+Math.abs(bySaleOrderNo.getLumps()-netWeight));
            bySaleOrderNo.setLumps(bySaleOrderNo.getLumps()-netWeight);
            bySaleOrderNo.setBalanceQuantity(bySaleOrderNo.getLumps()+bySaleOrderNo.getFines());
            bySaleOrderNo.setProgressiveQuantity(bySaleOrderNo.getOrderedQuantity()-bySaleOrderNo.getBalanceQuantity());
            if(bySaleOrderNo.getBalanceQuantity()<=0){
                bySaleOrderNo.setStatus(false);
            }
        }
        else if(gateEntryTransaction.getMaterialType()!=null&&gateEntryTransaction.getMaterialType().equalsIgnoreCase("fines")){
            bySalePassNo.setExtraSalePassNo(bySalePassNo.getExtraSalePassNo()+"_"+Math.abs(bySaleOrderNo.getFines()-netWeight));
            bySaleOrderNo.setFines(bySaleOrderNo.getFines()-netWeight);
            bySaleOrderNo.setBalanceQuantity(bySaleOrderNo.getLumps()+bySaleOrderNo.getFines());
            bySaleOrderNo.setProgressiveQuantity(bySaleOrderNo.getOrderedQuantity()-bySaleOrderNo.getBalanceQuantity());
            if(bySaleOrderNo.getBalanceQuantity()<=0){
                bySaleOrderNo.setStatus(false);
            }
        }
        else{
          bySalePassNo.setExtraSalePassNo(bySalePassNo.getExtraSalePassNo()+"_"+Math.abs(bySaleOrderNo.getBalanceQuantity()-netWeight));
          bySaleOrderNo.setProgressiveQuantity(bySaleOrderNo.getOrderedQuantity()+bySaleOrderNo.getBalanceQuantity());
          bySaleOrderNo.setBalanceQuantity(bySaleOrderNo.getBalanceQuantity()-netWeight);
            if(bySaleOrderNo.getBalanceQuantity()<=0){
                bySaleOrderNo.setStatus(false);
            }
        }
      /*  bySaleOrderNo.setBalanceQuantity(bySaleOrderNo.getLumps()+bySaleOrderNo.getFines());
        bySaleOrderNo.setProgressiveQuantity(bySaleOrderNo.getOrderedQuantity()-bySaleOrderNo.getBalanceQuantity());
        if(bySaleOrderNo.getBalanceQuantity()<=0){
            bySaleOrderNo.setStatus(false);
        }*/

        SalesOrder salesOrder = salesOrderRespository.save(bySaleOrderNo);
       // bySalePassNo.setExtraSalePassNo(bySalePassNo.getExtraSalePassNo()+"_"+Math.abs(salesOrder.getBalanceQuantity()));
        salesProcessRepository.save(bySalePassNo);
        return "Exceeded quantity recorded by extraSalepass";
    }

    @Override
    public String existingSaleOrder(String saleOrderNo, Double netWeight,Integer ticketNo) {
        SalesOrder existingSaleOrderNo = salesOrderRespository.findBySaleOrderNo(saleOrderNo);
        GateEntryTransaction gateEntryTransaction = gateEntryTransactionRepository.findById(ticketNo).orElseThrow(() -> new ResourceNotFoundException("ticket not found"));
        SalesProcess previousSalePass = salesProcessRepository.findBySalePassNo(gateEntryTransaction.getTpNo());
        SalesOrder referencedSaleOrderNo = salesOrderRespository.findBySaleOrderNo(previousSalePass.getPurchaseSale().getSaleOrderNo());
        //to get quantity to be deducted
        Double quantity=netWeight-referencedSaleOrderNo.getBalanceQuantity();
        String salePassOfDeductedQuantity = existingSaleOrderNo.getSalePassOfDeductedQuantity();
        String salePassDetail = "";
        if(gateEntryTransaction.getMaterialType()!=null&&gateEntryTransaction.getMaterialType().equalsIgnoreCase("lumps")){
            double balanceLumps = netWeight - referencedSaleOrderNo.getLumps();
            existingSaleOrderNo.setLumps(existingSaleOrderNo.getLumps()-balanceLumps);
            referencedSaleOrderNo.setLumps(0.0);
            existingSaleOrderNo.setBalanceQuantity(existingSaleOrderNo.getBalanceQuantity()-balanceLumps);
            existingSaleOrderNo.setProgressiveQuantity(existingSaleOrderNo.getProgressiveQuantity()+balanceLumps);
            if (salePassOfDeductedQuantity != null) {
                salePassDetail = salePassOfDeductedQuantity;
                existingSaleOrderNo.setSalePassOfDeductedQuantity(salePassDetail + "," + previousSalePass.getSalePassNo() + "_" +balanceLumps);
            } else {
                existingSaleOrderNo.setSalePassOfDeductedQuantity(previousSalePass.getSalePassNo() + "_" +balanceLumps);
            }
            referencedSaleOrderNo.setProgressiveQuantity(referencedSaleOrderNo.getProgressiveQuantity()+referencedSaleOrderNo.getLumps());
            referencedSaleOrderNo.setBalanceQuantity(referencedSaleOrderNo.getOrderedQuantity()-referencedSaleOrderNo.getProgressiveQuantity());
            if(referencedSaleOrderNo.getBalanceQuantity()<=0){
                referencedSaleOrderNo.setStatus(false);
            }
        }
       else if(gateEntryTransaction.getMaterialType()!=null&&gateEntryTransaction.getMaterialType().equalsIgnoreCase("fines")){
            double balanceFines = netWeight - referencedSaleOrderNo.getFines();
            existingSaleOrderNo.setFines(existingSaleOrderNo.getFines()-balanceFines);
            referencedSaleOrderNo.setFines(0.0);
            existingSaleOrderNo.setBalanceQuantity(existingSaleOrderNo.getBalanceQuantity()-balanceFines);
            existingSaleOrderNo.setProgressiveQuantity(existingSaleOrderNo.getProgressiveQuantity()+balanceFines);
            if (salePassOfDeductedQuantity != null) {
                salePassDetail = salePassOfDeductedQuantity;
                existingSaleOrderNo.setSalePassOfDeductedQuantity(salePassDetail + "," + previousSalePass.getSalePassNo() + "_" + balanceFines);
            } else {
                existingSaleOrderNo.setSalePassOfDeductedQuantity(previousSalePass.getSalePassNo() + "_" + balanceFines);
            }
            referencedSaleOrderNo.setProgressiveQuantity(referencedSaleOrderNo.getProgressiveQuantity()+referencedSaleOrderNo.getFines());
            referencedSaleOrderNo.setBalanceQuantity(referencedSaleOrderNo.getOrderedQuantity()-referencedSaleOrderNo.getProgressiveQuantity());
            if(referencedSaleOrderNo.getBalanceQuantity()<=0){
                referencedSaleOrderNo.setStatus(false);
            }
        }
       else {
            existingSaleOrderNo.setBalanceQuantity(existingSaleOrderNo.getBalanceQuantity() - quantity);
            existingSaleOrderNo.setProgressiveQuantity(existingSaleOrderNo.getOrderedQuantity() - existingSaleOrderNo.getBalanceQuantity());
            //  double deductedQty=quantity - existingSaleOrderNo.getBalanceQuantity();
            if (salePassOfDeductedQuantity != null) {
                salePassDetail = salePassOfDeductedQuantity;
                existingSaleOrderNo.setSalePassOfDeductedQuantity(salePassDetail + "," + previousSalePass.getSalePassNo() + "_" + quantity);
            } else {
                existingSaleOrderNo.setSalePassOfDeductedQuantity(previousSalePass.getSalePassNo() + "_" + quantity);
            }
            referencedSaleOrderNo.setProgressiveQuantity(referencedSaleOrderNo.getProgressiveQuantity()+referencedSaleOrderNo.getBalanceQuantity());
            referencedSaleOrderNo.setBalanceQuantity(referencedSaleOrderNo.getOrderedQuantity()-referencedSaleOrderNo.getProgressiveQuantity());
            if(referencedSaleOrderNo.getBalanceQuantity()<=0){
                referencedSaleOrderNo.setStatus(false);
            }
        }
     /*   referencedSaleOrderNo.setProgressiveQuantity(referencedSaleOrderNo.getProgressiveQuantity()+referencedSaleOrderNo.getBalanceQuantity());
        referencedSaleOrderNo.setBalanceQuantity(referencedSaleOrderNo.getLumps()+referencedSaleOrderNo.getFines());
        if(referencedSaleOrderNo.getBalanceQuantity()<=0){
            referencedSaleOrderNo.setStatus(false);
        }*/
        salesOrderRespository.save(referencedSaleOrderNo);
        salesOrderRespository.save(existingSaleOrderNo);
        return "extra quantity deducted from selected SaleOrderNo "+saleOrderNo;
    }

/*    @Override
    public String generateNewOrder(Integer ticketNo) {
        //WeighmentTransaction byGateEntryTransactionTicketNo = weighmentTransactionRepository.findByGateEntryTransactionTicketNo(ticketNo);
        GateEntryTransaction byTicketId = gateEntryTransactionRepository.findById(ticketNo).orElseThrow(()->new ResourceNotFoundException("ticket not found"));
        SalesProcess bySalePassNo = salesProcessRepository.findBySalePassNo(byTicketId.getTpNo());
        SalesOrder bySaleOrderNo = salesOrderRespository.findBySaleOrderNo(bySalePassNo.getPurchaseSale().getSaleOrderNo());
        double progressiveQty = bySaleOrderNo.getProgressiveQuantity() + ;
        double balanceQty = bySaleOrderNo.getOrderedQuantity() - progressiveQty ;
        bySaleOrderNo.setProgressiveQuantity(progressiveQty);
        bySaleOrderNo.setBalanceQuantity(balanceQty);
        salesOrderRespository.save(bySaleOrderNo);
    }*/

    @Override
    public WeighbridgePageResponse getAllCompletedTickets(Pageable pageable,String userId) {
        UserMaster byId = userMasterRepository.findById(userId).orElseThrow(()->new ResourceNotFoundException("user not found with"+userId));
        Page<WeighmentTransaction> all = weighmentTransactionRepository.findAllByUserSiteAndUserCompany(byId.getSite().getSiteId(),byId.getCompany().getCompanyId(),pageable);
        List<WeighmentTransaction> allUsers = all.getContent();
        if(allUsers==null){
            throw new ResourceNotFoundException("No response found.");
        }
        List<WeighmentTransactionResponse> weighmentTransactionResponses=new ArrayList<>();
        for(WeighmentTransaction weighmentTransaction:allUsers){
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm:ss");       
            DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd-MM-yyyy");
            WeighmentTransactionResponse weighmentTransactionResponse = new WeighmentTransactionResponse();
            weighmentTransactionResponse.setTransactionDate(weighmentTransaction.getGateEntryTransaction().getTransactionDate());
            weighmentTransactionResponse.setTransactionType(weighmentTransaction.getGateEntryTransaction().getTransactionType());
            weighmentTransactionResponse.setWeighmentNo(String.valueOf(weighmentTransaction.getWeighmentNo()));
            weighmentTransactionResponse.setTicketNo(String.valueOf(weighmentTransaction.getGateEntryTransaction().getTicketNo()));
            weighmentTransactionResponse.setVehicleIn(weighmentTransaction.getGateEntryTransaction().getVehicleIn().format(formatter));
            LocalDateTime vehicleOut = weighmentTransaction.getGateEntryTransaction().getVehicleOut();
            if(vehicleOut!=null){
                weighmentTransactionResponse.setVehicleOut(vehicleOut.format(formatter));

            }
            else{
                weighmentTransactionResponse.setVehicleOut("");

            }


            weighmentTransactionResponse.setNetWeight(
            	    String.valueOf(BigDecimal.valueOf(weighmentTransaction.getNetWeight() * 1000)
            	        .setScale(3, RoundingMode.HALF_UP))
            	);
            	weighmentTransactionResponse.setGrossWeight(
            	    String.valueOf(BigDecimal.valueOf(weighmentTransaction.getGrossWeight() * 1000)
            	        .setScale(3, RoundingMode.HALF_UP))
            	);
            	weighmentTransactionResponse.setTareWeight(
            	    String.valueOf(BigDecimal.valueOf(weighmentTransaction.getTareWeight() * 1000)
            	        .setScale(3, RoundingMode.HALF_UP))
            	);
            DateTimeFormatter formatter1 = DateTimeFormatter.ofPattern("dd-MM-yyyy");
            LocalDate date=vehicleMasterRepository.findVehicleFitnessById(weighmentTransaction.getGateEntryTransaction().getVehicleId());
            weighmentTransactionResponse.setVehicleNo(vehicleMasterRepository.findVehicleNoById(weighmentTransaction.getGateEntryTransaction().getVehicleId()));
            weighmentTransactionResponse.setVehicleFitnessUpTo(date!=null?date.format(formatter1):"");
            if (weighmentTransaction.getGateEntryTransaction().getTransactionType().equalsIgnoreCase("Inbound")) {
                weighmentTransactionResponse.setMaterialName(materialMasterRepository.findMaterialNameByMaterialId(weighmentTransaction.getGateEntryTransaction().getMaterialId()));
                weighmentTransactionResponse.setMaterialType(weighmentTransaction.getGateEntryTransaction().getMaterialType());
                weighmentTransactionResponse.setSupplierName(supplierMasterRepository.findSupplierNameBySupplierId(weighmentTransaction.getGateEntryTransaction().getSupplierId()));
            } else {
                weighmentTransactionResponse.setMaterialName(productMasterRepository.findProductNameByProductId(weighmentTransaction.getGateEntryTransaction().getMaterialId()));
                weighmentTransactionResponse.setMaterialType(weighmentTransaction.getGateEntryTransaction().getMaterialType());
                weighmentTransactionResponse.setCustomerName(customerMasterRepository.findCustomerNameByCustomerId(weighmentTransaction.getGateEntryTransaction().getCustomerId()));
            }

            weighmentTransactionResponse.setTransporterName(transporterMasterRepository.findTransporterNameByTransporterId(weighmentTransaction.getGateEntryTransaction().getTransporterId()));
            weighmentTransactionResponses.add(weighmentTransactionResponse);
        }
        long count = weighmentTransactionRepository.countCompletedTransactions();
        WeighbridgePageResponse weighbridgePageResponse=new WeighbridgePageResponse();
        weighbridgePageResponse.setWeighmentTransactionResponses(weighmentTransactionResponses);
        weighbridgePageResponse.setTotalPages(count/ all.getSize());
        weighbridgePageResponse.setTotalElements(count);
        return weighbridgePageResponse;
    }
}