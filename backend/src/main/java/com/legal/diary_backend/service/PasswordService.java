package com.legal.diary_backend.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

/**
 * The one place where passwords are hashed and checked.
 * Plain passwords are never stored; only the BCrypt hash goes into users.password_hash.
 */
@Service
public class PasswordService {

    private final PasswordEncoder passwordEncoder;

    public PasswordService(PasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }

    public String hash(String plainPassword) {
        return passwordEncoder.encode(plainPassword);
    }

    public boolean matches(String plainPassword, String storedHash) {
        return passwordEncoder.matches(plainPassword, storedHash);
    }
}
