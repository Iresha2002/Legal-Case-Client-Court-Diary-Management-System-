package com.legal.diary_backend.exception;

import org.springframework.http.HttpStatus;

/** The JSON body sent for an error, for example {"status":401,"error":"Unauthorized","message":"..."}. */
public record ErrorResponse(int status, String error, String message) {

    public static ErrorResponse of(HttpStatus status, String message) {
        return new ErrorResponse(status.value(), status.getReasonPhrase(), message);
    }
}
