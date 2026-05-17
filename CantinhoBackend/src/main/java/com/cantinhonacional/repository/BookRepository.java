package com.cantinhonacional.repository;

import com.cantinhonacional.entities.Book;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.time.LocalDateTime;
import java.util.List;

public interface BookRepository extends MongoRepository<Book, String> {
    List<Book> findByRentedBy(String rentedBy);

    List<Book> findAllByStatusAndRentalDateBefore(String status, LocalDateTime date);
}