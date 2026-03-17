package com.healthbooking.config;

import org.eclipse.microprofile.openapi.annotations.OpenAPIDefinition;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

class OpenApiConfigTest {

    @Test
    void openApiDefinitionAnnotation_isPresentAndHasExpectedTitle() {
        OpenAPIDefinition def = OpenApiConfig.class.getAnnotation(OpenAPIDefinition.class);

        assertNotNull(def);
        assertEquals("Health Booking API", def.info().title());
    }
}

