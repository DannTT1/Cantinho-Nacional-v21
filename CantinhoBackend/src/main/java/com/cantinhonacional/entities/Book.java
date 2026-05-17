package com.cantinhonacional.entities;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Document(collection = "books")
@Data
public class Book {
    @Id
    private String id;
    private String title;
    private String author;
    private String description;
    private Integer quantity;
    private String category;
    private String coverUrl;
    private String rentedBy;

    private LocalDateTime rentalDate;
    private LocalDate returnDate;

    private Double price;
    private String status;
}