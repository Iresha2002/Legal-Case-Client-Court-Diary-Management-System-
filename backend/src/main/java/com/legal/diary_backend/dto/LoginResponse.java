package com.legal.diary_backend.dto;

import java.time.Instant;

/** What a successful login returns. It never contains the password or its hash. */
public record LoginResponse(
        String token,
        Instant expiresAt,
        Long userId,
        String name,
        String role) {
}
