package com.netflix.clone.dto.request;

import lombok.Data;
import org.hibernate.validator.constraints.NotBlank;

@Data
public class ChangePasswordRequest {

    @NotBlank(message = "Current Password is required")
    private String currentPassword;

    @NotBlank(message = "New Password is required")
    private String newPassword;
}
