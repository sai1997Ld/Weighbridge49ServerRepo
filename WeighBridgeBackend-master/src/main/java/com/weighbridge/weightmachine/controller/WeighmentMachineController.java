package com.weighbridge.weightmachine.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.weighbridge.weightmachine.repository.WeighmentMachineRepository;
import com.weighbridge.weightmachine.service.WeighmentMachineService;

import java.util.List;

@RestController
@RequestMapping("/api/v1/weight")
public class WeighmentMachineController {

	@Autowired
    private WeighmentMachineService weighService;

    @GetMapping("/meter-data")
    public ResponseEntity<String> getAllMeterData() {
    	String responseWeight = weighService.getWeight();
        return new ResponseEntity<>(responseWeight,HttpStatus.OK);
    }

    // Add more methods as needed to interact with the repository
}
