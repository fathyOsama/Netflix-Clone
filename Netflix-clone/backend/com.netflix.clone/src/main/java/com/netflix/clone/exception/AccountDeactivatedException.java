package com.netflix.clone.exception;

public class AccountDeactivatedException extends RuntimeException{
    public AccountDeactivatedException(String massage) {
        super(massage);
    }
}
