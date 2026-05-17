package com.cantinhonacional.controller;

import com.cantinhonacional.dto.DashboardDTO;
import com.cantinhonacional.dto.UserDebtDTO;
import com.cantinhonacional.entities.Book;
import com.cantinhonacional.service.AdminService;
import com.cantinhonacional.service.BookService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @Autowired // ESSENCIAL: Injeção correta do serviço
    private BookService bookService;

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardDTO> getDashboard() {
        return ResponseEntity.ok(adminService.getDashboardStats());
    }

    @PostMapping("/books")
    public ResponseEntity<Book> saveBook(@RequestBody Book book) {
        return ResponseEntity.ok(adminService.saveBook(book));
    }

    // Endpoint de busca para carregar os dados na tela de edição
    @GetMapping("/books/{id}")
    public ResponseEntity<Book> getBookById(@PathVariable String id) {
        return ResponseEntity.ok(bookService.findById(id));
    }

    // Endpoint para atualizar livro existente
    @PutMapping("/books/{id}")
    public ResponseEntity<Book> updateBook(@PathVariable String id, @RequestBody Book book) {
        book.setId(id);
        return ResponseEntity.ok(adminService.saveBook(book));
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserDebtDTO>> listUsers() {
        return ResponseEntity.ok(adminService.getAllUsersWithDebts());
    }

    @DeleteMapping("/books/{id}")
    public ResponseEntity<Void> deleteBook(@PathVariable String id) {
        adminService.deleteBook(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/users/{id}/unlock")
    public ResponseEntity<Void> toggleUserStatus(@PathVariable String id) {
        adminService.toggleUserStatus(id);
        return ResponseEntity.ok().build();
    }
}