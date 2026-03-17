package com.healthbooking.config;

import org.eclipse.microprofile.openapi.annotations.OpenAPIDefinition;
import org.eclipse.microprofile.openapi.annotations.info.Info;

@OpenAPIDefinition(
        info = @Info(
                title = "Health Booking API",
                version = "1.0.0"
        )
)
public class OpenApiConfig {
}