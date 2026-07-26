package com.aryan.fulfillx.config;

import com.aryan.fulfillx.dto.response.ErrorResponse;
import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.media.Content;
import io.swagger.v3.oas.models.media.MediaType;
import io.swagger.v3.oas.models.responses.ApiResponse;
import io.swagger.v3.oas.models.servers.Server;
import io.swagger.v3.oas.models.tags.Tag;
import java.util.List;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Value("${spring.application.name:fulfillx}")
    private String applicationName;

    @Bean
    public OpenAPI fulfillxOpenApi() {
        return new OpenAPI()
                .info(new Info()
                        .title("FulfillX API")
                        .description("""
                                Logistics optimization and warehouse fulfillment platform.

                                All successful responses use the standard `ApiResponse` envelope with `success`, \
                                optional `message`, `data`, and `timestamp` fields.
                                Error responses use the `ErrorResponse` envelope with validation details when applicable.
                                """)
                        .version("v1")
                        .contact(new Contact()
                                .name("FulfillX Team")
                                .email("support@fulfillx.local"))
                        .license(new License()
                                .name("Apache 2.0")
                                .url("https://www.apache.org/licenses/LICENSE-2.0")))
                .servers(List.of(
                        new Server().url("/").description(applicationName + " server"),
                        new Server().url("http://localhost:8080").description("Local development")))
                .tags(List.of(
                        new Tag().name("Customers").description("Customer master data and delivery locations"),
                        new Tag().name("Products").description("Product catalog management"),
                        new Tag().name("Warehouses").description("Warehouse network and capacity management"),
                        new Tag().name("Inventory").description("Stock levels per warehouse and product"),
                        new Tag().name("Customer Orders").description("Customer order lifecycle management"),
                        new Tag().name("Allocations").description("Fulfillment allocation records and history"),
                        new Tag().name("Orders").description("Order-centric allocation lookups"),
                        new Tag().name("Optimization").description("Multi-factor warehouse selection engine"),
                        new Tag().name("Analytics").description("Operational metrics and reporting")))
                .components(new Components()
                        .addResponses("BadRequest", badRequestResponse())
                        .addResponses("NotFound", notFoundResponse()));
    }

    private ApiResponse badRequestResponse() {
        return new ApiResponse()
                .description("Validation or malformed request")
                .content(new Content().addMediaType(
                        org.springframework.http.MediaType.APPLICATION_JSON_VALUE,
                        new MediaType()
                                .schema(new io.swagger.v3.oas.models.media.Schema<>()
                                        .$ref("#/components/schemas/ErrorResponse"))
                                .example(OpenApiExamples.VALIDATION_ERROR_RESPONSE)));
    }

    private ApiResponse notFoundResponse() {
        return new ApiResponse()
                .description("Requested resource not found")
                .content(new Content().addMediaType(
                        org.springframework.http.MediaType.APPLICATION_JSON_VALUE,
                        new MediaType()
                                .schema(new io.swagger.v3.oas.models.media.Schema<>()
                                        .$ref("#/components/schemas/ErrorResponse"))
                                .example(OpenApiExamples.NOT_FOUND_ERROR_RESPONSE)));
    }
}
