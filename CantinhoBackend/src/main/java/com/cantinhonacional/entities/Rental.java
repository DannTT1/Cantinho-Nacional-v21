package com.cantinhonacional.entities;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document(collection = "rentals")
@Data
public class Rental {
    @Id
    private String id;
    private String userId;
    private String userName;
    private String bookId;
    private String bookTitle;
    private LocalDateTime rentalDate;
    private LocalDateTime returnDate;
    private String status;
}