package com.cantinhonacional.repository;

import com.cantinhonacional.entities.Book;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface BookRepository extends MongoRepository<Book, String> {

}