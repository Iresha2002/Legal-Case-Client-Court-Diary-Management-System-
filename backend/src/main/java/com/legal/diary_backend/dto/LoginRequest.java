package com.legal.diary_backend.dto;

import com.legal.diary_backend.service.PasswordService;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record LoginRequest(
        @NotBlank(message = "Email is required.") String email,
        // @NotNull instead of @NotBlank, so an empty password shows only the length message.
        @NotNull(message = "Password is required.")
        @Size(min = PasswordService.MIN_LENGTH, message = PasswordService.TOO_SHORT_MESSAGE) String password) {
}
