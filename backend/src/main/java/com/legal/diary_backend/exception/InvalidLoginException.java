package com.legal.diary_backend.exception;

/** Thrown when a login fails. The message is shown to the user, so it must not say which part was wrong. */
public class InvalidLoginException extends RuntimeException {

    public InvalidLoginException(String message) {
        super(message);
    }
}
