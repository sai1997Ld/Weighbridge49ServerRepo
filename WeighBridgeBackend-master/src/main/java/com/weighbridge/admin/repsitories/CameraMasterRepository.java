package com.weighbridge.admin.repsitories;

import com.weighbridge.admin.entities.CameraMaster;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CameraMasterRepository extends JpaRepository<CameraMaster,Long> {

    CameraMaster findByCompanyIdAndSiteIdAndRoleId(String companyId,String siteId,Integer roleId);
}
