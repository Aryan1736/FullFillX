package com.aryan.fulfillx.exception;

import com.aryan.fulfillx.dto.response.ErrorResponse;
import com.aryan.fulfillx.dto.response.FieldErrorDetail;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolationException;
import java.util.List;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.OptimisticLockingFailureException;
import org.springframework.data.core.PropertyReferenceException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleResourceNotFound(
            ResourceNotFoundException ex, HttpServletRequest request) {
        logException(ex, request, ex.getStatus());
        return buildErrorResponse(ex.getStatus(), ex.getMessage(), request, List.of());
    }

    @ExceptionHandler(FulfillxException.class)
    public ResponseEntity<ErrorResponse> handleFulfillxException(
            FulfillxException ex, HttpServletRequest request) {
        logException(ex, request, ex.getStatus());
        return buildErrorResponse(ex.getStatus(), ex.getMessage(), request, List.of());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidation(
            MethodArgumentNotValidException ex, HttpServletRequest request) {
        List<FieldErrorDetail> errors = ex.getBindingResult().getFieldErrors().stream()
                .map(error -> new FieldErrorDetail(
                        error.getField(),
                        error.getDefaultMessage(),
                        error.getRejectedValue()))
                .toList();
        logException(ex, request, HttpStatus.BAD_REQUEST, errors.size());
        return buildErrorResponse(HttpStatus.BAD_REQUEST, "Validation failed", request, errors);
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ErrorResponse> handleConstraintViolation(
            ConstraintViolationException ex, HttpServletRequest request) {
        List<FieldErrorDetail> errors = ex.getConstraintViolations().stream()
                .map(violation -> new FieldErrorDetail(
                        violation.getPropertyPath().toString(),
                        violation.getMessage(),
                        violation.getInvalidValue()))
                .toList();
        logException(ex, request, HttpStatus.BAD_REQUEST, errors.size());
        return buildErrorResponse(HttpStatus.BAD_REQUEST, "Validation failed", request, errors);
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ErrorResponse> handleTypeMismatch(
            MethodArgumentTypeMismatchException ex, HttpServletRequest request) {
        String message = String.format("Invalid value for parameter '%s'", ex.getName());
        logException(ex, request, HttpStatus.BAD_REQUEST);
        return buildErrorResponse(HttpStatus.BAD_REQUEST, message, request, List.of());
    }

    @ExceptionHandler(MissingServletRequestParameterException.class)
    public ResponseEntity<ErrorResponse> handleMissingParameter(
            MissingServletRequestParameterException ex, HttpServletRequest request) {
        String message = String.format("Required parameter '%s' is missing", ex.getParameterName());
        logException(ex, request, HttpStatus.BAD_REQUEST);
        return buildErrorResponse(HttpStatus.BAD_REQUEST, message, request, List.of());
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ErrorResponse> handleUnreadableMessage(
            HttpMessageNotReadableException ex, HttpServletRequest request) {
        logException(ex, request, HttpStatus.BAD_REQUEST);
        return buildErrorResponse(HttpStatus.BAD_REQUEST, "Malformed request body", request, List.of());
    }

    @ExceptionHandler(PropertyReferenceException.class)
    public ResponseEntity<ErrorResponse> handleInvalidSortProperty(
            PropertyReferenceException ex, HttpServletRequest request) {
        String message = "Invalid sort field: " + ex.getPropertyName();
        logException(ex, request, HttpStatus.BAD_REQUEST);
        return buildErrorResponse(HttpStatus.BAD_REQUEST, message, request, List.of());
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ErrorResponse> handleDataIntegrityViolation(
            DataIntegrityViolationException ex, HttpServletRequest request) {
        logException(ex, request, HttpStatus.CONFLICT);
        return buildErrorResponse(
                HttpStatus.CONFLICT,
                "Resource conflict or constraint violation",
                request,
                List.of());
    }

    @ExceptionHandler(OptimisticLockingFailureException.class)
    public ResponseEntity<ErrorResponse> handleOptimisticLockingFailure(
            OptimisticLockingFailureException ex, HttpServletRequest request) {
        logException(ex, request, HttpStatus.CONFLICT);
        return buildErrorResponse(
                HttpStatus.CONFLICT,
                "Concurrent inventory update detected. Retry the allocation.",
                request,
                List.of());
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGeneral(Exception ex, HttpServletRequest request) {
        logException(ex, request, HttpStatus.INTERNAL_SERVER_ERROR);
        return buildErrorResponse(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "An unexpected error occurred",
                request,
                List.of());
    }

    private void logException(Exception ex, HttpServletRequest request, HttpStatus status) {
        logException(ex, request, status, null);
    }

    private void logException(Exception ex, HttpServletRequest request, HttpStatus status, Integer errorCount) {
        if (status.is5xxServerError()) {
            log.error(
                    "event=exception_handled exceptionType={} path={} status={} errorCount={} message={}",
                    ex.getClass().getSimpleName(),
                    request.getRequestURI(),
                    status.value(),
                    errorCount,
                    ex.getMessage(),
                    ex);
            return;
        }
        log.warn(
                "event=exception_handled exceptionType={} path={} status={} errorCount={} message={}",
                ex.getClass().getSimpleName(),
                request.getRequestURI(),
                status.value(),
                errorCount,
                ex.getMessage());
    }

    private ResponseEntity<ErrorResponse> buildErrorResponse(
            HttpStatus status, String message, HttpServletRequest request, List<FieldErrorDetail> errors) {
        return ResponseEntity.status(status)
                .body(ErrorResponse.of(status.value(), message, request.getRequestURI(), errors));
    }
}
