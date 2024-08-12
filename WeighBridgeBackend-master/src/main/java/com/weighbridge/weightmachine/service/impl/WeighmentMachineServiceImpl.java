package com.weighbridge.weightmachine.service.impl;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import com.weighbridge.weightmachine.repository.WeighmentMachineRepository;
import com.weighbridge.weightmachine.service.WeighmentMachineService;

@Service
public class WeighmentMachineServiceImpl implements WeighmentMachineService {
	

	@Autowired
	private WeighmentMachineRepository weighmentMachineRepository;

	@Override
	public String getWeight() {
		String latestWeight = weighmentMachineRepository.findLatestWeight();
		if (latestWeight != null) {
			return latestWeight;
		}
		// TODO Auto-generated method stub
		return "";
	}

}
