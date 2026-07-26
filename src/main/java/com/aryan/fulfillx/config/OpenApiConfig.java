package com.aryan.fulfillx.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.servers.Server;
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
                        .description("Logistics optimization and warehouse fulfillment platform")
                        .version("v1")
                        .contact(new Contact()
                                .name("FulfillX Team")
                                .email("support@fulfillx.local"))
                        .license(new License()
                                .name("Apache 2.0")
                                .url("https://www.apache.org/licenses/LICENSE-2.0")))
                .servers(List.of(
                        new Server().url("/").description(applicationName + " server")));
    }
}
