package com.healthbooking.exception;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

class NotFoundExceptionTest {

    @Test
    void messageIsPropagatedToRuntimeException() {
        NotFoundException ex = new NotFoundException("missing");

        assertTrue(ex instanceof RuntimeException);
        assertEquals("missing", ex.getMessage());
    }
}

