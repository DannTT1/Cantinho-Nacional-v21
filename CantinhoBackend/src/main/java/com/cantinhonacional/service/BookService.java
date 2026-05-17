package com.cantinhonacional.service;

import com.cantinhonacional.entities.Book;
import com.cantinhonacional.entities.Rental;
import com.cantinhonacional.entities.User; // Importante
import com.cantinhonacional.repository.BookRepository;
import com.cantinhonacional.repository.RentalRepository;
import com.cantinhonacional.repository.UserRepository; // Importante
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class BookService {
    private final BookRepository bookRepository;
    private final RentalRepository rentalRepository;
    private final UserRepository userRepository;

    public BookService(BookRepository bookRepository,
                       RentalRepository rentalRepository,
                       UserRepository userRepository) {
        this.bookRepository = bookRepository;
        this.rentalRepository = rentalRepository;
        this.userRepository = userRepository;
    }

    public List<Book> findAll() {
        return bookRepository.findAll();
    }

    public Book rentBook(String bookId, String userId) {
        String cleanUserId = userId.replace("\"", "").trim();
        String cleanBookId = bookId.replace("\"", "").trim();

        User user = userRepository.findById(cleanUserId)
                .orElseThrow(() -> new RuntimeException("Usuário não identificado."));

        if ("BLOCKED".equals(user.getStatus().name())) {
            throw new RuntimeException("Sua conta está suspensa por pendências. Entre em contato com a Central de Ajuda.");
        }

        List<Rental> ativos = rentalRepository.findByUserId(cleanUserId).stream()
                .filter(r -> "RENTED".equals(r.getStatus()))
                .toList();

        if (ativos.size() >= 3) {
            throw new RuntimeException("Limite atingido! Você só pode ter 3 livros alugados.");
        }

        Book book = bookRepository.findById(cleanBookId)
                .orElseThrow(() -> new RuntimeException("Livro não encontrado."));

        if (book.getQuantity() <= 0) {
            throw new RuntimeException("Este livro está sem estoque no momento.");
        }

        Rental rental = new Rental();
        rental.setBookId(cleanBookId);
        rental.setUserId(cleanUserId);
        rental.setUserName(user.getName());
        rental.setBookTitle(book.getTitle());
        rental.setRentalDate(LocalDateTime.now());
        rental.setReturnDate(LocalDateTime.now().plusDays(15));
        rental.setStatus("RENTED");

        rentalRepository.save(rental);

        book.setQuantity(book.getQuantity() - 1);
        return bookRepository.save(book);
    }

    public void cancelRental(String bookId, String userId) {
        List<Rental> rentals = rentalRepository.findByBookIdAndUserIdAndStatus(bookId, userId, "RENTED");
        if (rentals.isEmpty()) {
            throw new RuntimeException("Aluguel não encontrado ou já devolvido.");
        }

        Rental rental = rentals.getFirst();

        rentalRepository.delete(rental);

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new RuntimeException("Livro não encontrado no acervo."));
        book.setQuantity(book.getQuantity() + 1);
        bookRepository.save(book);
        System.out.println("Aluguel cancelado e estoque atualizado para: " + book.getTitle());
    }

    public Book findById(String id) {
        return bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Livro não encontrado com o ID: " + id));
    }
}