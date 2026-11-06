package com.legal.diary_backend.service;

import com.legal.diary_backend.exception.InvalidPasswordException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

/**
 * The one place where passwords are hashed and checked.
 * Plain passwords are never stored; only the BCrypt hash goes into users.password_hash.
 */
@Service
public class PasswordService {

    // The password rule, kept here so login and hashing use the same values.
    public static final int MIN_LENGTH = 8;
    public static final String TOO_SHORT_MESSAGE = "Password must be at least 8 characters.";

    private final PasswordEncoder passwordEncoder;

    public PasswordService(PasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }

    public String hash(String plainPassword) {
        if (plainPassword == null || plainPassword.length() < MIN_LENGTH) {
            throw new InvalidPasswordException(TOO_SHORT_MESSAGE);
        }
        return passwordEncoder.encode(plainPassword);
    }

    public boolean matches(String plainPassword, String storedHash) {
        return passwordEncoder.matches(plainPassword, storedHash);
    }
}
