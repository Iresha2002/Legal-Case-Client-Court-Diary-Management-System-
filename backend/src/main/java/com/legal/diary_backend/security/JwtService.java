package com.legal.diary_backend.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.time.Instant;
import java.util.Date;
import java.util.Optional;
import javax.crypto.SecretKey;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

/** Creates signed tokens (JWT) that the React app sends back as "Authorization: Bearer <token>". */
@Service
public class JwtService {

    // HS256 signing needs a key of at least 256 bits (32 bytes).
    private static final int MIN_SECRET_LENGTH = 32;

    private final SecretKey signingKey;
    private final Duration lifetime;

    public JwtService(@Value("${jwt.secret}") String secret,
                      @Value("${jwt.expiration-minutes}") long expirationMinutes) {
        if (secret == null || secret.length() < MIN_SECRET_LENGTH) {
            // Stop at startup instead of running with a weak or missing secret.
            throw new IllegalStateException(
                    "JWT_SECRET must be set and be at least " + MIN_SECRET_LENGTH + " characters long.");
        }
        this.signingKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.lifetime = Duration.ofMinutes(expirationMinutes);
    }

    public IssuedToken createToken(Long userId, AppRole role) {
        Instant now = Instant.now();
        Instant expiresAt = now.plus(lifetime);
        String token = Jwts.builder()
                .subject(String.valueOf(userId))
                .claim("role", role.authority())
                .issuedAt(Date.from(now))
                .expiration(Date.from(expiresAt))
                .signWith(signingKey)
                .compact();
        return new IssuedToken(token, expiresAt);
    }

    /**
     * Checks the signature and expiry of a token and reads the user from it.
     * Returns empty for any token that is broken, changed, expired or has an unknown role.
     */
    public Optional<AuthenticatedUser> readToken(String token) {
        try {
            Claims claims = Jwts.parser()
                    .verifyWith(signingKey)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
            Long userId = Long.valueOf(claims.getSubject());
            return AppRole.fromAuthority(claims.get("role", String.class))
                    .map(role -> new AuthenticatedUser(userId, role));
        } catch (JwtException | IllegalArgumentException exception) {
            // JwtException covers a bad signature, a broken token and an expired token.
            return Optional.empty();
        }
    }

    public record IssuedToken(String token, Instant expiresAt) {
    }
}
