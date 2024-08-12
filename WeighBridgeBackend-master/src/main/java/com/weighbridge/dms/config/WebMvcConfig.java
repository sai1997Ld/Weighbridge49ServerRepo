package com.weighbridge.dms.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/*
 * @Configuration public class WebMvcConfig implements WebMvcConfigurer {
 * 
 * @Override public void addCorsMappings(CorsRegistry registry) {
 * registry.addMapping("/**") .allowedOrigins(
 * "\"http://172.16.20.26:5173\",\"http://49.249.180.125:5175\"")
 * .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
 * .allowedHeaders("*") .allowCredentials(true); } }
 */