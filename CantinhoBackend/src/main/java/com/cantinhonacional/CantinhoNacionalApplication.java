package com.cantinhonacional;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class CantinhoNacionalApplication {
	public static void main(String[] args) {
		SpringApplication.run(CantinhoNacionalApplication.class, args);
	}
}