package com.cantinhonacional.service;

import com.cantinhonacional.dto.DashboardDTO;
import com.cantinhonacional.dto.UserDebtDTO;
import com.cantinhonacional.entities.Book;
import com.cantinhonacional.entities.Rental;
import com.cantinhonacional.entities.User;
import com.cantinhonacional.enums.UserRole;
import com.cantinhonacional.enums.UserStatus;
import com.cantinhonacional.repository.BookRepository;
import com.cantinhonacional.repository.RentalRepository;
import com.cantinhonacional.repository.UserRepository;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminService {
    private final BookRepository bookRepository;
    private final UserRepository userRepository;
    private final RentalRepository rentalRepository;

    public AdminService(BookRepository bookRepository, UserRepository userRepository, RentalRepository rentalRepository) {
        this.bookRepository = bookRepository;
        this.userRepository = userRepository;
        this.rentalRepository = rentalRepository;
    }

    public DashboardDTO getDashboardStats() {
        long total = bookRepository.count();
        long alugados = rentalRepository.findByStatus("RENTED").size();
        return new DashboardDTO(total, alugados, total - alugados, alugados * 15.0);
    }

    public List<UserDebtDTO> getAllUsersWithDebts() {
        LocalDateTime agora = LocalDateTime.now();

        return userRepository.findAll().stream()
                .filter(user -> user.getRole() != UserRole.ADMIN)
                .map(user -> {
                    List<Rental> rentalsAtivos = rentalRepository.findByUserId(user.getId()).stream()
                            .filter(r -> "RENTED".equals(r.getStatus()))
                            .toList();

                    double multaTotal = 0;
                    long totalLivrosAtrasados = 0;
                    String primeiroLivroAtrasado = "Nenhum";

                    for (Rental r : rentalsAtivos) {
                        if (r.getReturnDate().isBefore(agora)) {
                            totalLivrosAtrasados++;
                            if (primeiroLivroAtrasado.equals("Nenhum")) primeiroLivroAtrasado = r.getBookTitle();

                            long diasAtraso = java.time.Duration.between(r.getReturnDate(), agora).toDays();
                            double multaLivro = Math.min(diasAtraso * 5.0, 50.0);
                            multaTotal += multaLivro;
                        }
                    }

                    if ((multaTotal > 20 || totalLivrosAtrasados > 0) && user.getStatus() == UserStatus.ACTIVE) {
                        user.setStatus(UserStatus.BLOCKED);
                        userRepository.save(user);
                    }

                    return new UserDebtDTO(
                            user.getId(), user.getName(), user.getEmail(),
                            multaTotal, totalLivrosAtrasados,
                            user.getStatus().name(), primeiroLivroAtrasado
                    );
                }).collect(Collectors.toList());
    }
    public void deleteBook(String id) {
        bookRepository.deleteById(id);
    }

    public void toggleUserStatus(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        if (user.getStatus() == UserStatus.ACTIVE) {
            user.setStatus(UserStatus.BLOCKED);
        } else {
            user.setStatus(UserStatus.ACTIVE);
        }
        userRepository.save(user);
    }

    public Book saveBook(Book book) { return bookRepository.save(book); }
}