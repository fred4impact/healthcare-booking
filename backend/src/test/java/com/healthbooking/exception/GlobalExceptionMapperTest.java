package com.healthbooking.exception;

import jakarta.ws.rs.core.Response;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

class GlobalExceptionMapperTest {

    @Test
    void toResponse_returnsBadRequestWithMessageBody() {
        GlobalExceptionMapper mapper = new GlobalExceptionMapper();

        Response response = mapper.toResponse(new RuntimeException("boom"));

        assertNotNull(response);
        assertEquals(400, response.getStatus());
        assertEquals("boom", response.getEntity());
    }
}

