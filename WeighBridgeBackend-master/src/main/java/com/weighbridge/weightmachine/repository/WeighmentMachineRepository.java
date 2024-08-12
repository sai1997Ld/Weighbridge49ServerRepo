package com.weighbridge.weightmachine.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.weighbridge.weightmachine.entities.WeighmentMachine;

public interface WeighmentMachineRepository extends JpaRepository<WeighmentMachine, Integer>{
	
	
	@Query(value = "SELECT weight FROM meter_data WHERE id = (SELECT MAX(id) FROM meter_data)", nativeQuery = true)
    String findLatestWeight();
}
