package com.legal.diary_backend.exception;

/** The JSON body sent for an error, for example {"status":401,"error":"Unauthorized","message":"..."}. */
public record ErrorResponse(int status, String error, String message) {
}
