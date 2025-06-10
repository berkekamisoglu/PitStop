package com.example.demo.exception;

import org.springframework.dao.OptimisticLockingFailureException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler({OptimisticLockingFailureException.class, ObjectOptimisticLockingFailureException.class})
    public ResponseEntity<String> handleOptimisticLockingFailure(Exception ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
            .body("Hata ile Karşılaşıldı. Lütfen sayfayı yenileyip tekrar deneyin.");
    }
    
}