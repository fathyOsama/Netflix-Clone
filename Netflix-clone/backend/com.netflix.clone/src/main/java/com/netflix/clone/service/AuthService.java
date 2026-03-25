package com.netflix.clone.service;

import com.netflix.clone.dto.request.UserRequest;
import com.netflix.clone.dto.response.EmailValidationResponse;
import com.netflix.clone.dto.response.LoginResponse;
import com.netflix.clone.dto.response.MessageResponse;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import org.hibernate.validator.constraints.NotBlank;

public interface AuthService {
    MessageResponse signup(@Valid UserRequest userRequest);

    LoginResponse login(String email, String password);

    EmailValidationResponse validateEmail(String email);

    MessageResponse verifyEmail(String token);

    MessageResponse resendVerification (String email);

    MessageResponse forgetPassword (String email);

    MessageResponse resetPassword (String token , String newPassword);

    MessageResponse changePassword(String email, String currentPassword, String newPassword);

    LoginResponse currentUser(String email);
}
