package com.example.demo.config;

import com.example.demo.security.JwtFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.http.HttpMethod;

import java.util.Arrays;
import java.util.List;

// DESIGN PATTERN: Configuration Pattern
// Spring Security yapılandırmasını centralize eder
// CORS, JWT authentication ve authorization kurallarını tanımlar
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtFilter jwtFilter;

    public SecurityConfig(JwtFilter jwtFilter) {
        this.jwtFilter = jwtFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(
                    "/auth/login",
                    "/auth/user/login",
                    "/auth/user/register",
                    "/auth/tireshop/login",
                    "/auth/tireshop/register",
                    "/api/auth/login",
                    "/api/auth/user/login",
                    "/api/auth/user/register",
                    "/api/auth/tireshop/login",
                    "/api/auth/tireshop/register",
                    "/swagger-ui/**",
                    "/v3/api-docs/**"
                ).permitAll()
                .requestMatchers("/api/tireshops/**").hasAnyRole("SHOP", "USER")
                .requestMatchers(HttpMethod.GET, "/api/tire-shop-services/**").hasAnyRole("SHOP", "USER")
                .requestMatchers("/api/tire-shop-services/**").hasRole("SHOP")
                .requestMatchers("/api/tire-stock/**").hasRole("SHOP")
                .requestMatchers("/api/tires/**").hasRole("SHOP")
                .requestMatchers("/api/tire-sizes/**").hasAnyRole("SHOP", "USER")
                .requestMatchers("/api/vehicle-types/**").hasRole("USER")
                .requestMatchers("/api/user-vehicles/**").hasRole("USER")
                .requestMatchers("/api/appointments/**").hasAnyRole("SHOP", "USER")
                .requestMatchers("/api/favorites/**").hasRole("USER")
                .requestMatchers(HttpMethod.POST, "/api/requests").hasRole("USER")
                .requestMatchers("/api/requests/**").hasAnyRole("USER", "SHOP")
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:3000"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "X-Requested-With"));
        configuration.setExposedHeaders(Arrays.asList("Authorization"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new PasswordEncoder() {
            @Override
            public String encode(CharSequence rawPassword) {
                return rawPassword.toString();
            }

            @Override
            public boolean matches(CharSequence rawPassword, String encodedPassword) {
                return rawPassword.toString().equals(encodedPassword);
            }
        };
    }
}