package com.cantinhonacional.service;

import com.cantinhonacional.dto.UserDTO;
import com.cantinhonacional.entities.User;
import com.cantinhonacional.enums.UserRole; // Certifique-se de importar seu Enum
import com.cantinhonacional.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final PasswordEncoder passwordEncoder;
    private final UserRepository repository;

    public UserService(PasswordEncoder passwordEncoder, UserRepository repository) {
        this.passwordEncoder = passwordEncoder;
        this.repository = repository;
    }

    public java.util.Optional<User> findById(String id) {
        return repository.findById(id);
    }
    public UserDTO addNewUser(UserDTO dto) {
        User user = new User();
        user.setName(dto.name());
        user.setEmail(dto.email());

        user.setPassword(passwordEncoder.encode(dto.password()));

        user.setRole(UserRole.CLIENT);

        User saved = repository.save(user);

        return new UserDTO(saved.getName(), saved.getEmail(), "");
    }
}