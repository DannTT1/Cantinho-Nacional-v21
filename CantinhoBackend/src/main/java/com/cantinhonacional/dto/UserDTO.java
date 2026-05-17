package com.cantinhonacional.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record UserDTO(
        String id,
        @NotBlank String name,
        @Email @NotBlank String email,
        String password,
        String role,
        String status
) {
        public UserDTO(String name, String email, String password) {
                this(null, name, email, password, null, null);
        }
}