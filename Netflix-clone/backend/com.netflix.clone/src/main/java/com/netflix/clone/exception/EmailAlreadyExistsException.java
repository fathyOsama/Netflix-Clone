package com.netflix.clone.exception;

public class EmailAlreadyExistsException extends RuntimeException{
    public EmailAlreadyExistsException(String massage) {
        super(massage);
    }
}
