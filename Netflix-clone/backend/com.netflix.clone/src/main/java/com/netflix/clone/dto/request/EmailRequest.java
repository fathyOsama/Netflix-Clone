package com.netflix.clone.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class EmailRequest {

    @NotBlank(message = "Email is request")
    @Email(message = "Invalid email format")
    private String email;
}
