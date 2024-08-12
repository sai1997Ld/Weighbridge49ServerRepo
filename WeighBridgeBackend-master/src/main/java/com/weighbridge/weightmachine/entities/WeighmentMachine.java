package com.weighbridge.weightmachine.entities;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data
@Table(name = "meter_data")
public class WeighmentMachine {
	@Id
	private Integer id;
	
	private String weight;
	
	private LocalDateTime timestamp;

}
