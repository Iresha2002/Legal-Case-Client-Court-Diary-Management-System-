package com.legal.diary_backend.exception;

import java.util.stream.Collectors;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * Turns exceptions from controllers into a clear JSON error for the React app.
 * Only our own messages are sent; exception details and stack traces stay in the server log.
 */
@RestControllerAdvice
public class ApiExceptionHandler {

    // 400: a field broke a rule, for example a password that is too short.
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleInvalidFields(MethodArgumentNotValidException exception) {
        String message = exception.getBindingResult().getFieldErrors().stream()
                .map(FieldError::getDefaultMessage)
                .sorted() // Same order every time, so the message is predictable.
                .collect(Collectors.joining(" "));
        return error(HttpStatus.BAD_REQUEST, message);
    }

    // 400: the body is missing or is not valid JSON.
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ErrorResponse> handleUnreadableBody(HttpMessageNotReadableException exception) {
        return error(HttpStatus.BAD_REQUEST, "The request body is missing or is not valid JSON.");
    }

    // 400: a new password breaks the password rule.
    @ExceptionHandler(InvalidPasswordException.class)
    public ResponseEntity<ErrorResponse> handleInvalidPassword(InvalidPasswordException exception) {
        return error(HttpStatus.BAD_REQUEST, exception.getMessage());
    }

    // 401: wrong email or password, or a switched-off account.
    @ExceptionHandler(InvalidLoginException.class)
    public ResponseEntity<ErrorResponse> handleInvalidLogin(InvalidLoginException exception) {
        return error(HttpStatus.UNAUTHORIZED, exception.getMessage());
    }

    private ResponseEntity<ErrorResponse> error(HttpStatus status, String message) {
        return ResponseEntity.status(status).body(ErrorResponse.of(status, message));
    }
}
