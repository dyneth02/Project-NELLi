package com.nelli.smart_campus_operations_hub.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Thrown when file storage retrieval fails or files are unavailable.
 */
@ResponseStatus(HttpStatus.NOT_FOUND)
public class FileStorageException extends RuntimeException {

    public FileStorageException(String message) {
        super(message);
    }

    public FileStorageException(String message, Throwable cause) {
        super(message, cause);
    }
}
