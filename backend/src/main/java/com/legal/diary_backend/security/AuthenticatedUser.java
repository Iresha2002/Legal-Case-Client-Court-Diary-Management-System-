package com.legal.diary_backend.security;

/** The logged-in user, read from a valid token. Controllers can get it with @AuthenticationPrincipal. */
public record AuthenticatedUser(Long userId, AppRole role) {
}
