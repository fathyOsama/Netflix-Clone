package com.netflix.clone.exception;

public class EmailSendingException extends RuntimeException{
    public EmailSendingException(String massage, Throwable cause) {
        super(massage, cause);
    }
}
