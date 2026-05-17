package com.cantinhonacional.controller;

import com.cantinhonacional.entities.Book;
import com.cantinhonacional.service.BookService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/books")
public class BookController {

    @Autowired
    private BookService bookService;

    @GetMapping
    public ResponseEntity<List<Book>> getAllBooks() {
        return ResponseEntity.ok(bookService.findAll());
    }

    @PutMapping("/{id}/rent")
    public ResponseEntity<Book> rentBook(@PathVariable String id, @RequestBody String userId) {
        String cleanId = userId.replace("\"", "").trim();
        return ResponseEntity.ok(bookService.rentBook(id, cleanId));
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<Void> cancelRental(@PathVariable String id, @RequestBody String userId) {
        String cleanId = userId.replace("\"", "").trim();
        bookService.cancelRental(id, cleanId);
        return ResponseEntity.ok().build();
    }
}