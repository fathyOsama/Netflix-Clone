package com.netflix.clone.exception;

public class BadCredentialsException extends RuntimeException{
    public BadCredentialsException(String massage) {
        super(massage);
    }
}
