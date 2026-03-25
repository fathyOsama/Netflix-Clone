package com.netflix.clone.dto.request;

import jakarta.validation.constraints.Email;
import lombok.Data;
import org.hibernate.validator.constraints.NotBlank;

@Data
public class LoginRequest {

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Password is required")
    private String password;

}
