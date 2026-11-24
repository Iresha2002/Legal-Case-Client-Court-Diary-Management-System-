package com.legal.diary_backend.service;

import com.legal.diary_backend.dto.LoginRequest;
import com.legal.diary_backend.dto.LoginResponse;
import com.legal.diary_backend.entity.User;
import com.legal.diary_backend.exception.InvalidLoginException;
import com.legal.diary_backend.repository.UserRepository;
import com.legal.diary_backend.security.AppRole;
import com.legal.diary_backend.security.JwtService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    // One message for a wrong email, a wrong password and a role that may not log in,
    // so nobody can use the login form to find out which emails exist.
    static final String INVALID_LOGIN_MESSAGE = "Incorrect email or password.";
    static final String ACCOUNT_DISABLED_MESSAGE =
            "This account is switched off. Please contact the Senior Lawyer.";

    private final UserRepository users;
    private final PasswordService passwordService;
    private final JwtService jwtService;

    public AuthService(UserRepository users, PasswordService passwordService, JwtService jwtService) {
        this.users = users;
        this.passwordService = passwordService;
        this.jwtService = jwtService;
    }

    // A transaction keeps the database session open so user.getRole() can be loaded.
    @Transactional(readOnly = true)
    public LoginResponse login(LoginRequest request) {
        User user = users.findByEmailIgnoreCase(request.email().trim())
                .orElseThrow(() -> new InvalidLoginException(INVALID_LOGIN_MESSAGE));

        if (!passwordService.matches(request.password(), user.getPasswordHash())) {
            throw new InvalidLoginException(INVALID_LOGIN_MESSAGE);
        }

        AppRole role = AppRole.fromRoleName(user.getRole().getName())
                .orElseThrow(() -> new InvalidLoginException(INVALID_LOGIN_MESSAGE));

        // Checked after the password, so only the real owner learns the account is switched off.
        if (!user.isActive()) {
            throw new InvalidLoginException(ACCOUNT_DISABLED_MESSAGE);
        }

        JwtService.IssuedToken issued = jwtService.createToken(user.getId(), role);
        return new LoginResponse(issued.token(), issued.expiresAt(), user.getId(), user.getName(), role.authority());
    }
}
