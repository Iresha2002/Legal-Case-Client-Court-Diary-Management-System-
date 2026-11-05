package com.legal.diary_backend.exception;

/** Thrown when a new password breaks the password rule. Answered with 400 Bad Request. */
public class InvalidPasswordException extends RuntimeException {

    public InvalidPasswordException(String message) {
        super(message);
    }
}
