package com.cantinhonacional.security;

import com.cantinhonacional.entities.User;
import com.cantinhonacional.enums.UserRole;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

public class UserSystem implements UserDetails {

    @Getter
    private final String id;
    private final String email;
    private final String password;
    @Getter
    private final String name;
    private final UserRole role;

    public UserSystem(User user) {
        this.id = user.getId();
        this.email = user.getEmail();
        this.password = user.getPassword();
        this.name = user.getName();
        this.role = user.getRole();
    }


    public UserSystem(String id, String name, String email, String role) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = null;
        String cleanRole = role.replace("ROLE_", "");
        this.role = UserRole.valueOf(cleanRole);
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        String roleName = (role != null) ? role.name() : "CLIENT";
        return List.of(new SimpleGrantedAuthority("ROLE_" + roleName));
    }

    @Override public String getPassword() { return password; }
    @Override public String getUsername() { return email; }

}