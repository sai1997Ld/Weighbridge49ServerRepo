package com.weighbridge.SalesManagement.repositories;

import com.weighbridge.SalesManagement.entities.SalesOrder;
import org.bytedeco.opencv.presets.opencv_core;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

public interface SalesOrderRespository extends JpaRepository<SalesOrder,String> {

    Boolean existsBySaleOrderNo(String saleOrderNo);

    SalesOrder findByPurchaseOrderNo(String purchaseOrderNo);

    Long countByPurchaseOrderNoStartingWith(String formattedDate);

    SalesOrder findBySaleOrderNo(String s);

    List<SalesOrder> findAllByBalanceQuantityBetween(Double startRange,Double endRange);


    Page<SalesOrder> findAllBySiteIdAndCompanyId(String siteId,String companyId, Pageable pageable);

    SalesOrder findBySaleOrderNoAndSiteIdAndCompanyId(String saleOrderNo,String siteId,String companyId);
    List<SalesOrder> findAllByCustomerIdAndProductNameAndStatusAndSaleOrderNoNot(Long customerId,String productName,boolean status,String saleOrderNo);

    SalesOrder findBySaleOrderNoAndSiteIdAndCompanyIdAndStatus(String saleOrderNo, String siteId, String companyId, boolean b);

    Page<SalesOrder> findAllBySiteIdAndCompanyIdAndStatus(String siteId, String companyId, Pageable pageable, boolean b);
}