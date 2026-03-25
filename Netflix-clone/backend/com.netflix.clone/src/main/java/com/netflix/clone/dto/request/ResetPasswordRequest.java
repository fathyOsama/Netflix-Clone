package com.netflix.clone.dto.request;

import jakarta.validation.constraints.Size;
import lombok.Data;
import org.hibernate.validator.constraints.NotBlank;

@Data
public class ResetPasswordRequest {

    @NotBlank
    private String token;
    @NotBlank
    @Size(min = 6, message = "New password must be at lease 6 characters long")
    private String newPassword;
}
