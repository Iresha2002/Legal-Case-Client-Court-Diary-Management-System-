package com.legal.diary_backend.controller;

import com.legal.diary_backend.dto.LoginRequest;
import com.legal.diary_backend.dto.LoginResponse;
import com.legal.diary_backend.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public LoginResponse login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request);
    }

    /*
     * Tokens are stateless: the server does not keep a list of them, so it cannot "delete" one.
     * What logout CAN do: confirm the token is valid (otherwise 401) and tell the React app to
     * throw its copy away. Once the app forgets the token, that browser is logged out.
     * What logout CANNOT do: stop a copy of the token that was saved or stolen elsewhere.
     * That copy keeps working until it expires (JWT_EXPIRATION_MINUTES, default 60).
     * Blocking tokens right away would need a server-side block list, which is not part of LD-010.
     */
    @PostMapping("/logout")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void logout() {
        // Nothing to do on the server; Spring Security has already checked the token.
    }
}
