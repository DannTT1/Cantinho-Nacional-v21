package com.cantinhonacional.controller;

import com.cantinhonacional.entities.Rental;
import com.cantinhonacional.service.RentalService; // Importando o Service
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/rentals")
@CrossOrigin(origins = "*")
public class RentalController {

    private final RentalService rentalService;

    public RentalController(RentalService rentalService) {
        this.rentalService = rentalService;
    }

    @GetMapping("/user/{userId}/active")
    public ResponseEntity<List<Rental>> getActiveRentals(@PathVariable String userId) {
        List<Rental> activeRentals = rentalService.findActiveByUserId(userId);
        return ResponseEntity.ok(activeRentals);
    }
}