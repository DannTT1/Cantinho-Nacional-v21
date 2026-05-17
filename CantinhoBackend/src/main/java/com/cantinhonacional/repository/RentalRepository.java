package com.cantinhonacional.repository;

import com.cantinhonacional.entities.Rental;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.Optional;

public interface RentalRepository extends MongoRepository<Rental, String> {
    List<Rental> findByUserId(String userId);
    List<Rental> findByStatus(String status);
    List<Rental> findByBookIdAndUserIdAndStatus(String bookId, String userId, String status);;
}