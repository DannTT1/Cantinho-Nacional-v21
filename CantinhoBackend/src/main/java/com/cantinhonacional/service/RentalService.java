package com.cantinhonacional.service;

import com.cantinhonacional.entities.Rental;
import com.cantinhonacional.repository.RentalRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RentalService {

    private final RentalRepository rentalRepository;

    public RentalService(RentalRepository rentalRepository) {
        this.rentalRepository = rentalRepository;
    }

    public List<Rental> findActiveByUserId(String userId) {
        return rentalRepository.findByUserId(userId).stream()
                .filter(r -> "RENTED".equals(r.getStatus()))
                .collect(Collectors.toList());
    }

}