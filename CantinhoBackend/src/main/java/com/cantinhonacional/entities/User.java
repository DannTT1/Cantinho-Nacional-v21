package com.cantinhonacional.entities;

import com.cantinhonacional.enums.UserRole;
import com.cantinhonacional.enums.UserStatus;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Setter
@Getter
@Document(collection = "users")
public class User {
    @Id
    private String id;
    private String name;
    private String email;
    private String password;
    private UserRole role;
    private UserStatus status = UserStatus.ACTIVE;

    public User() {}

}