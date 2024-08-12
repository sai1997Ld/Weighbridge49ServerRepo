package com.weighbridge.weightmachine.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.sql.DataSource;




public class DataSourceConfig {
	 @Bean(name = "primaryDataSource")
	    @ConfigurationProperties(prefix = "spring.datasource")
	    public DataSource primaryDataSource() {
	        return DataSourceBuilder.create().build();
	    }

	    // Meter DataSource configuration
	    @Bean(name = "meterDataSource")
	    @ConfigurationProperties(prefix = "meter.datasource")
	    public DataSource meterDataSource() {
	        return DataSourceBuilder.create().build();
	    }
}
