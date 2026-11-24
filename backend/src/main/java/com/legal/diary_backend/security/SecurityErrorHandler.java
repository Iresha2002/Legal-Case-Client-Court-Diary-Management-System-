package com.legal.diary_backend.security;

import com.legal.diary_backend.exception.ErrorResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;
import tools.jackson.databind.json.JsonMapper;

/**
 * Sends 401 and 403 errors from Spring Security in the same JSON format as ApiExceptionHandler.
 * These errors happen in the security filters, before any controller runs, so they need their own handler.
 */
@Component
public class SecurityErrorHandler implements AuthenticationEntryPoint, AccessDeniedHandler {

    static final String NOT_LOGGED_IN_MESSAGE = "Please log in. Your token is missing, not valid or has expired.";
    static final String NO_PERMISSION_MESSAGE = "You do not have permission to do this.";

    private final JsonMapper jsonMapper;

    public SecurityErrorHandler(JsonMapper jsonMapper) {
        this.jsonMapper = jsonMapper;
    }

    // 401: no token, or the token is not valid.
    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response,
                         AuthenticationException exception) throws IOException {
        write(response, HttpStatus.UNAUTHORIZED, NOT_LOGGED_IN_MESSAGE);
    }

    // 403: logged in, but the role is not allowed to do this.
    @Override
    public void handle(HttpServletRequest request, HttpServletResponse response,
                       AccessDeniedException exception) throws IOException {
        write(response, HttpStatus.FORBIDDEN, NO_PERMISSION_MESSAGE);
    }

    private void write(HttpServletResponse response, HttpStatus status, String message) throws IOException {
        response.setStatus(status.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        jsonMapper.writeValue(response.getOutputStream(), ErrorResponse.of(status, message));
    }
}
