package com.cantinhonacional.controller;

import com.cantinhonacional.dto.UserDTO;
import com.cantinhonacional.dto.UserLoginDTO;
import com.cantinhonacional.jwt.JwtService;
import com.cantinhonacional.security.UserSystem;
import com.cantinhonacional.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class UserController {

    private final AuthenticationManager authManager;
    private final JwtService jwtService;
    private final UserService userService;

    public UserController(AuthenticationManager authManager, JwtService jwtService, UserService userService) {
        this.authManager = authManager;
        this.jwtService = jwtService;
        this.userService = userService;
    }

    @PostMapping("/signup")
    public ResponseEntity<UserDTO> signup(@RequestBody @Valid UserDTO dto) {
        UserDTO saved = userService.addNewUser(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }




    @GetMapping("/me/{id}")
    public ResponseEntity<UserResponseStatus> getUserStatus(@PathVariable String id) {
        return userService.findById(id)
                .map(user -> ResponseEntity.ok(new UserResponseStatus(user.getStatus().name())))
                .orElse(ResponseEntity.notFound().build());
    }

    public record UserResponseStatus(String status) {}

    @PostMapping("/login")
    public ResponseEntity<ResponseLogin> login(@RequestBody @Valid UserLoginDTO dto) {
        try {
            Authentication auth = authManager.authenticate(
                    new UsernamePasswordAuthenticationToken(dto.email(), dto.password()));

            UserSystem user = (UserSystem) auth.getPrincipal();
            String token = jwtService.newToken(user);

            String role = user.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .findFirst()
                    .orElse("ROLE_CLIENT");

            return ResponseEntity.ok(new ResponseLogin(user.getName(), token, role, user.getId()));

        } catch (AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    public record ResponseLogin(String name, String token, String role, String id) { }
}