package com.weighbridge.SalesManagement.service;

import com.weighbridge.SalesManagement.entities.SalesOrder;
import com.weighbridge.SalesManagement.payloads.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface SalesOrderService{

    public String AddSalesDetails(SalesOrderRequest salesOrderRequest);

    public SalesUserPageResponse getAllSalesDetails(String companyId, String siteId,Pageable pageable);

    public SalesDetailResponse getSalesDetails(String purchaseOrderNo);

    public SalesUserPageResponse getVehiclesAndTransporterDetails(Pageable pageable,String userId);

    public VehicleAndTransporterDetail getBySalePassNo(String salePassNo);

    public SalesDashboardResponse searchBySaleOrderNo(String saleOrderNo,String siteId,String companyId);

    List<SalesOrder> searchBycustomerNameAndProductAndNotSaleOrderNo(String customerName,String customerAddress, String ProductName,String saleOrder,String productType);

    String closeSaleOrder(String saleOrderNo,String message);

  //  String generateNewSaleOrder(String saleOrderNo);
  //  String deductFromExisting(String saleOrderNo);

}