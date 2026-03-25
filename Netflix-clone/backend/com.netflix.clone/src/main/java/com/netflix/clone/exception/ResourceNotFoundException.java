package com.netflix.clone.exception;

public class ResourceNotFoundException extends RuntimeException{
    public ResourceNotFoundException(String massage) {
        super(massage);
    }
}
