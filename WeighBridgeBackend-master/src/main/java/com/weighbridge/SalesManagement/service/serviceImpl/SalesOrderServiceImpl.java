package com.weighbridge.SalesManagement.service.serviceImpl;

import com.weighbridge.SalesManagement.entities.SalesOrder;
import com.weighbridge.SalesManagement.entities.SalesProcess;
import com.weighbridge.SalesManagement.payloads.*;
import com.weighbridge.SalesManagement.repositories.SalesOrderRespository;
import com.weighbridge.SalesManagement.repositories.SalesProcessRepository;
import com.weighbridge.SalesManagement.service.SalesOrderService;
import com.weighbridge.admin.entities.CustomerMaster;
import com.weighbridge.admin.entities.MaterialMaster;
import com.weighbridge.admin.entities.UserMaster;
import com.weighbridge.admin.exceptions.ResourceNotFoundException;
import com.weighbridge.admin.repsitories.CustomerMasterRepository;
import com.weighbridge.admin.repsitories.MaterialMasterRepository;
import com.weighbridge.admin.repsitories.UserMasterRepository;
import com.weighbridge.gateuser.entities.GateEntryTransaction;
import com.weighbridge.gateuser.repositories.GateEntryTransactionRepository;
import com.weighbridge.weighbridgeoperator.entities.WeighmentTransaction;
import com.weighbridge.weighbridgeoperator.repositories.WeighmentTransactionRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.StringJoiner;

@Service
public class SalesOrderServiceImpl implements SalesOrderService {
    @Autowired
    private SalesOrderRespository salesOrderRespository;

    @Autowired
    private CustomerMasterRepository customerMasterRepository;

    @Autowired
    private MaterialMasterRepository materialMasterRepository;

    @Autowired
    private SalesProcessRepository salesProcessRepository;

    @Autowired
    private UserMasterRepository userMasterRepository;

    @Autowired
    private HttpServletRequest httpServletRequest;

    @Autowired
    private GateEntryTransactionRepository gateEntryTransactionRepository;

    @Autowired
    private WeighmentTransactionRepository weighmentTransactionRepository;

    private static final DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("yyyyMMdd");


    /**
     *
     * @param salesOrderRequest should contain a unique salesOrderNo for each request
     * @return
     */
    @Override
    public String AddSalesDetails(SalesOrderRequest salesOrderRequest){
      /*  Boolean salesOrder1 = salesOrderRespository.existsBySaleOrderNo(salesOrderRequest.getSaleOrderNo());
        if(salesOrder1){
            throw new ResponseStatusException(HttpStatus.CONFLICT,"this salesNumber already exists");
        }*/
        SalesOrder salesOrder=new SalesOrder();
        salesOrder.setPurchaseOrderNo(salesOrderRequest.getPurchaseOrderNo());
        salesOrder.setSaleOrderNo(salesOrderRequest.getSaleOrderNo());
        salesOrder.setPurchaseOrderedDate(salesOrderRequest.getPurchaseOrderedDate());
        salesOrder.setOrderedQuantity(salesOrderRequest.getOrderedQuantity());
        salesOrder.setBrokerName(salesOrderRequest.getBrokerName());

      //Added customer to CustomerMaster if customer doesnot exist
        String address=salesOrderRequest.getCustomerAddress();
        String addressLine1=null;
        String addressLine2=null;
       if (address!=null) {
           String[] parts = address.split(",", 2);
           addressLine1=parts[0].trim();
           addressLine2=parts[1].trim();
       }
        System.out.println("cs"+addressLine1);
        System.out.println("cs1"+addressLine2);
        System.out.println("cs2"+address);
       /*
        Boolean customer = customerMasterRepository.existsByCustomerNameAndCustomerAddressLine1AndCustomerAddressLine2(salesOrderRequest.getCustomerName(), addressLine1, addressLine2);
        if(!customer){
            CustomerMaster customerMaster=new CustomerMaster();
            customerMaster.setCustomerName(salesOrderRequest.getCustomerName());
            customerMaster.setCustomerContactNo(salesOrderRequest.getCustomerContact());
            customerMaster.setCustomerEmail(salesOrderRequest.getCustomerEmail());
            customerMaster.setCustomerAddressLine1(addressLine1);
            customerMaster.setCustomerAddressLine2(addressLine2);
            customerMasterRepository.save(customerMaster);
        }*/
        System.out.println("printCustomer "+salesOrderRequest.getCustomerName()+","+salesOrderRequest.getCustomerAddress());
        Long customerIdByCustomerNameAndAddressLines = customerMasterRepository.findCustomerIdByCustomerNameAndAddressLines(salesOrderRequest.getCustomerName(), addressLine1, addressLine2);
        System.out.println(customerIdByCustomerNameAndAddressLines);
        salesOrder.setCustomerId(customerIdByCustomerNameAndAddressLines);
        System.out.println(salesOrder.getCustomerId());
        salesOrder.setBrokerAddress(salesOrderRequest.getBrokerAddress());
        System.out.println("1");

        //Added material to material master if doesnot exist in MaterialMaster
     /*   boolean material = materialMasterRepository.existsByMaterialName(salesOrderRequest.getProductName());
        if(!material){
            MaterialMaster materialMaster=new MaterialMaster();
            materialMaster.setMaterialName(salesOrderRequest.getProductName());
            materialMasterRepository.save(materialMaster);
        }
*/
        salesOrder.setProductName(salesOrderRequest.getProductName());
        System.out.println("2");
       // salesOrder.setProgressiveQuantity(salesOrderRequest.getProgressiveQuantity());
        salesOrder.setBalanceQuantity(salesOrderRequest.getOrderedQuantity());
        System.out.println("3");
        UserMaster userMaster = userMasterRepository.findById(salesOrderRequest.getUserId()).orElseThrow(() -> new ResourceNotFoundException("userId not found."));
        System.out.println("4");
        salesOrder.setCompanyId(userMaster.getCompany().getCompanyId());
        salesOrder.setSiteId(userMaster.getSite().getSiteId());
        if(salesOrderRequest.getProductName().equalsIgnoreCase("Sponge Iron")) {
            double lumpsQuanntity = salesOrder.getOrderedQuantity() * salesOrderRequest.getLumps() / 100;
            double finesQuantity = salesOrder.getOrderedQuantity() * salesOrderRequest.getFines() / 100;
            salesOrder.setLumps(lumpsQuanntity);
            salesOrder.setFines(finesQuantity);
            salesOrder.setRangeRatio(salesOrderRequest.getLumps() + "-" + salesOrderRequest.getFines());
        }
        salesOrderRespository.save(salesOrder);
        return "Sales details added";
    }

    @Override
    public SalesUserPageResponse getAllSalesDetails(String companyId,String siteId,Pageable pageable) {
        Page<SalesOrder> allSales = salesOrderRespository.findAllBySiteIdAndCompanyIdAndStatus(siteId,companyId,pageable,true);
        List<SalesOrder> allUsers = allSales.getContent();
        List<SalesDashboardResponse> list = new ArrayList<>();
        for(SalesOrder salesOrder : allUsers) {
            double lumps = salesOrder.getLumps();
            double fines = salesOrder.getFines();
            /*double totalOrder= salesOrder.getOrderedQuantity();
            double lumpsQuantity = totalOrder * lumps / 100;
            double finesQuantity = totalOrder * fines / 100;*/
          /*  List<SalesProcess> byPurchaseSaleSaleOrderNo = salesProcessRepository.findByPurchaseSaleSaleOrderNo(salesOrder.getSaleOrderNo());
            double lumpsQty = 0.0;
            double finesQty=0.0;
            for (SalesProcess salesProcess:byPurchaseSaleSaleOrderNo){
                if(salesProcess.getProductType().equalsIgnoreCase("lumps")){
                    GateEntryTransaction byTpNo = gateEntryTransactionRepository.findByTpNo(salesProcess.getSalePassNo());
                    if(byTpNo!=null) {
                        WeighmentTransaction weight = weighmentTransactionRepository.findByGateEntryTransactionTicketNo(byTpNo.getTicketNo());
                       Double netWeight= weight!=null?weight.getNetWeight():0.0;
                        lumpsQty = lumps - netWeight;
                    }
                }
                if(salesProcess.getProductType().equalsIgnoreCase("fines")){
                    GateEntryTransaction byTpNo = gateEntryTransactionRepository.findByTpNo(salesProcess.getSalePassNo());
                    if(byTpNo!=null) {
                        WeighmentTransaction weight = weighmentTransactionRepository.findByGateEntryTransactionTicketNo(byTpNo.getTicketNo());
                        Double netWeight= weight!=null?weight.getNetWeight():0.0;
                        finesQty= fines- netWeight;
                    }
                }
            }*/
            System.out.println(salesOrder.isStatus());
            /*if(salesOrder.isStatus()) {*/
                SalesDashboardResponse salesDashboardResponse = new SalesDashboardResponse();
                salesDashboardResponse.setPurchaseOrderNo(salesOrder.getPurchaseOrderNo());
                salesDashboardResponse.setOrderedQty(salesOrder.getOrderedQuantity());
                CustomerMaster byId = customerMasterRepository.findById(salesOrder.getCustomerId()).get();
                String customerAddressLine1 = byId.getCustomerAddressLine1();
                salesDashboardResponse.setCustomerAddress(customerAddressLine1);
                salesDashboardResponse.setCustomerName(byId.getCustomerName());
                salesDashboardResponse.setSaleOrderNo(salesOrder.getSaleOrderNo());
                salesDashboardResponse.setProductName(salesOrder.getProductName());
                salesDashboardResponse.setBrokerName(salesOrder.getBrokerName());
                salesDashboardResponse.setLumpsBalance(lumps);
                salesDashboardResponse.setFinesBalance(fines);
                salesDashboardResponse.setOrderedQty(
                        BigDecimal.valueOf(salesOrder.getOrderedQuantity()).setScale(3, RoundingMode.HALF_UP).doubleValue()
                );
                salesDashboardResponse.setProgressiveQty(
                        BigDecimal.valueOf(salesOrder.getProgressiveQuantity()).setScale(3, RoundingMode.HALF_UP).doubleValue()
                );
                salesDashboardResponse.setBalanceQty(
                        BigDecimal.valueOf(salesOrder.getBalanceQuantity()).setScale(3, RoundingMode.HALF_UP).doubleValue()
                );
                // Assuming getPurchasePassNo() is a method of SalesProcess, not List<SalesProcess>
                list.add(salesDashboardResponse);
          //  }
        }
        SalesUserPageResponse salesUserPageResponse=new SalesUserPageResponse();
        salesUserPageResponse.setSales(list);
        salesUserPageResponse.setTotalPage((long) allSales.getTotalPages());
        salesUserPageResponse.setTotalElement(allSales.getTotalElements());
        return salesUserPageResponse;
    }



    /**
     * @return
     */
    @Override
    public SalesDetailResponse getSalesDetails(String saleOrderNo) {
        SalesOrder byPurchaseOrderNo = salesOrderRespository.findBySaleOrderNo(saleOrderNo);
        SalesDetailResponse salesDetailResponse=new SalesDetailResponse();
        salesDetailResponse.setProductName(byPurchaseOrderNo.getProductName());
        salesDetailResponse.setSaleOrderNo(byPurchaseOrderNo.getSaleOrderNo());
        salesDetailResponse.setBalanceWeight(byPurchaseOrderNo.getBalanceQuantity());
        return salesDetailResponse;
    }

    public SalesUserPageResponse getVehiclesAndTransporterDetails(Pageable pageable,String userId){
       /* HttpSession session = httpServletRequest.getSession();
        String userId;
        String userCompany;
        String userSite;
        if (session != null && session.getAttribute("userId") != null) {
            userId = session.getAttribute("userId").toString();
            userSite = session.getAttribute("userSite").toString();
            userCompany = session.getAttribute("userCompany").toString();
        } else {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Session Expired, Login again !");
        }*/
    	 DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd-MM-yyyy");
        UserMaster userMaster = userMasterRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("user not found with site and company."));
        Page<SalesProcess> allVehiclesDetails= salesProcessRepository.findAllByStatusAndPurchaseSaleSiteIdAndPurchaseSaleCompanyId(true,userMaster.getSite().getSiteId(),userMaster.getCompany().getCompanyId(),pageable);
        List<SalesProcess> allUsers = allVehiclesDetails.getContent();
        List<VehicleAndTransporterDetail> listOfVehicle=new ArrayList<>();
        for (SalesProcess salesProcess:allUsers) {
            VehicleAndTransporterDetail vehicleAndTransporterDetail = new VehicleAndTransporterDetail();
            vehicleAndTransporterDetail.setSalePassNo(salesProcess.getSalePassNo());
            vehicleAndTransporterDetail.setTransporterName(salesProcess.getTransporterName());
            vehicleAndTransporterDetail.setVehicleNo(salesProcess.getVehicleNo());
            vehicleAndTransporterDetail.setProductName(salesProcess.getProductName());
            vehicleAndTransporterDetail.setProductType(salesProcess.getProductType());
            vehicleAndTransporterDetail.setConsignmentWeight(salesProcess.getConsignmentWeight());
            Object[] customerNameAndAddressBycustomerId = customerMasterRepository.findCustomerNameAndAddressBycustomerId(salesProcess.getPurchaseSale().getCustomerId());
            Object[] customerData = (Object[]) customerNameAndAddressBycustomerId[0];
            if (customerData != null && customerData.length >= 2) {
                String customerName = (String) customerData[0];
                String customerAddress1 = (String) customerData[1];
                vehicleAndTransporterDetail.setCustomerName(customerName);
                vehicleAndTransporterDetail.setCustomerAddress(customerAddress1);
            }
            //System.out.println(customerNameAndAddressBycustomerId[1]);
           // vehicleAndTransporterDetail.setCustomerAddress();
            vehicleAndTransporterDetail.setSaleOrderNo(salesProcess.getPurchaseSale().getSaleOrderNo());
            vehicleAndTransporterDetail.setPurchaseOrderNo(salesProcess.getPurchaseSale().getPurchaseOrderNo());
            String saleOrderDate = salesProcess.getPurchaseProcessDate() != null ? salesProcess.getPurchaseProcessDate().format(dateFormatter) : "";
            vehicleAndTransporterDetail.setSaleOrderDate(saleOrderDate);
            listOfVehicle.add(vehicleAndTransporterDetail);
        }
        SalesUserPageResponse salesUserPageResponse=new SalesUserPageResponse();
        salesUserPageResponse.setSales(listOfVehicle);
        salesUserPageResponse.setTotalElement(allVehiclesDetails.getTotalElements());
        salesUserPageResponse.setTotalPage((long) allVehiclesDetails.getTotalPages());
        return salesUserPageResponse;
    }


    public VehicleAndTransporterDetail getBySalePassNo(String salePassNo){
        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd-MM-yyyy");
        SalesProcess bySalePassNo = salesProcessRepository.findBySalePassNoAndStatus(salePassNo,true);
        VehicleAndTransporterDetail vehicleAndTransporterDetail = new VehicleAndTransporterDetail();
        vehicleAndTransporterDetail.setSalePassNo(bySalePassNo.getSalePassNo());
        vehicleAndTransporterDetail.setTransporterName(bySalePassNo.getTransporterName());
        vehicleAndTransporterDetail.setVehicleNo(bySalePassNo.getVehicleNo());
        vehicleAndTransporterDetail.setProductName(bySalePassNo.getProductName());
        vehicleAndTransporterDetail.setProductType(bySalePassNo.getProductType());
        vehicleAndTransporterDetail.setConsignmentWeight(bySalePassNo.getConsignmentWeight());
        Object[] customerNameAndAddressBycustomerId = customerMasterRepository.findCustomerNameAndAddress1andAddress2ByCustomerId(bySalePassNo.getPurchaseSale().getCustomerId());
        Object[] customerData = (Object[]) customerNameAndAddressBycustomerId[0];
        if (customerData != null && customerData.length >= 2) {
            String customerName = (String) customerData[0];
            String customerAddress1 = (String) customerData[1];
            String customerAddress2 = (String) customerData[2];
            String customerAddress = customerAddress1 + "," + customerAddress2;
            vehicleAndTransporterDetail.setCustomerName(customerName);
            vehicleAndTransporterDetail.setCustomerAddress(customerAddress);
            vehicleAndTransporterDetail.setCustomerName(customerName);
            vehicleAndTransporterDetail.setCustomerAddress(customerAddress);
        }
        //System.out.println(customerNameAndAddressBycustomerId[1]);
        // vehicleAndTransporterDetail.setCustomerAddress();
        vehicleAndTransporterDetail.setSaleOrderNo(bySalePassNo.getPurchaseSale().getSaleOrderNo());
        vehicleAndTransporterDetail.setPurchaseOrderNo(bySalePassNo.getPurchaseSale().getPurchaseOrderNo());
        vehicleAndTransporterDetail.setSaleOrderDate(bySalePassNo.getPurchaseSale().getPurchaseOrderedDate().format(dateFormatter));
        System.out.println(bySalePassNo.getPurchaseSale().getPurchaseOrderedDate());
        return vehicleAndTransporterDetail;
    }


    @Override
    public SalesDashboardResponse searchBySaleOrderNo(String saleOrderNo,String siteId,String companyId){
        SalesOrder bySaleOrderNo = salesOrderRespository.findBySaleOrderNoAndSiteIdAndCompanyIdAndStatus(saleOrderNo,siteId,companyId,true);
        if(bySaleOrderNo!=null){
            SalesDashboardResponse salesDashboardResponse = new SalesDashboardResponse();
            salesDashboardResponse.setPurchaseOrderNo(bySaleOrderNo.getPurchaseOrderNo());
            salesDashboardResponse.setOrderedQty(bySaleOrderNo.getOrderedQuantity());
            CustomerMaster byId = customerMasterRepository.findById(bySaleOrderNo.getCustomerId()).get();
            salesDashboardResponse.setCustomerName(byId.getCustomerName());
            salesDashboardResponse.setSaleOrderNo(bySaleOrderNo.getSaleOrderNo());
            salesDashboardResponse.setProductName(bySaleOrderNo.getProductName());
            salesDashboardResponse.setBrokerName(bySaleOrderNo.getBrokerName());
            salesDashboardResponse.setProgressiveQty(bySaleOrderNo.getProgressiveQuantity());
            salesDashboardResponse.setBalanceQty(bySaleOrderNo.getBalanceQuantity());
            return salesDashboardResponse;
        }
        else {
            throw new ResourceNotFoundException("no match found.");
        }
    }

    @Override
    public List<SalesOrder> searchBycustomerNameAndProductAndNotSaleOrderNo(String customerName, String customerAddress, String productName, String saleOrder,String productType) {
        String address=customerAddress;
        String addressLine1=null;
        String addressLine2=null;
        if (address!=null) {
            String[] parts = address.split(",", 2);
            addressLine1=parts[0].trim();
            System.out.println("addresss----"+addressLine1);
//            addressLine2=parts[1].trim();
        }
        Long customerId = customerMasterRepository.findCustomerIdByCustomerNameAndAddressLines(customerName, addressLine1, addressLine2);
        System.out.println("-------"+customerId);
        List<SalesOrder> orderList = salesOrderRespository.findAllByCustomerIdAndProductNameAndStatusAndSaleOrderNoNot(customerId, productName, true,saleOrder);
        List<SalesOrder> list=new ArrayList<>();
        if(productType.equalsIgnoreCase("lumps")) {
            for (SalesOrder salesOrder : orderList) {
                    if(salesOrder.getLumps()>0){
                        list.add(salesOrder);
                    }
            }
            return list;
        } else if (productType.equalsIgnoreCase("fines")) {
            for (SalesOrder salesOrder : orderList) {
                if(salesOrder.getLumps()>0){
                    list.add(salesOrder);
                }
            }
            return list;
        }
        else{
            return orderList;
        }

    }

    @Override
    public String closeSaleOrder(String saleOrderNo,String message) {
        SalesOrder bySaleOrderNo = salesOrderRespository.findBySaleOrderNo(saleOrderNo);
        if(bySaleOrderNo.getBalanceQuantity()>0&&bySaleOrderNo.getBalanceQuantity()<8){
            bySaleOrderNo.setComment(message);
            bySaleOrderNo.setStatus(false);
            salesOrderRespository.save(bySaleOrderNo);
        }
        return "SaleOrder "+saleOrderNo+" closed successfully";
    }


 /*   @Override
    public String generateNewSaleOrder(String saleOrderNo) {

        return null;
    }

    @Override
    public String deductFromExisting(String saleOrderNo) {
        return null;
    }*/
}