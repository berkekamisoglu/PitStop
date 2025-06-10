package com.example.demo.security;

import com.example.demo.entity.User;
import com.example.demo.entity.TireShop;
import com.example.demo.repository.UserRepository;
import com.example.demo.repository.TireShopRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;
import java.util.List;

// DESIGN PATTERN: Filter Pattern (Chain of Responsibility)
// HTTP isteklerini intercept eder ve JWT token doğrulaması yapar
// Spring Security filter chain'ine entegre olur
@Component
public class JwtFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;
    private final TireShopRepository tireShopRepository;

    public JwtFilter(JwtUtil jwtUtil, UserRepository userRepository, TireShopRepository tireShopRepository) {
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
        this.tireShopRepository = tireShopRepository;
    }

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {
        try {
        String authHeader = request.getHeader("Authorization");

            // If no auth header or not Bearer token, continue with chain
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                filterChain.doFilter(request, response);
                return;
            }

            String token = authHeader.substring(7);
            Claims claims;

            try {
                claims = jwtUtil.extractClaims(token);
            } catch (JwtException e) {
                // Invalid token, continue with chain
                filterChain.doFilter(request, response);
                return;
            }

            // If we already have authentication, continue with chain
            if (SecurityContextHolder.getContext().getAuthentication() != null) {
                filterChain.doFilter(request, response);
                return;
            }

                String email = claims.getSubject();
            Integer userId = claims.get("userId", Integer.class);
                String role = claims.get("role", String.class);

            System.out.println("JWT Filter Debug - Email: " + email + ", UserId: " + userId + ", Role: " + role);

            if (email != null && userId != null && role != null) {
                Object principal = null;
                boolean isValidUser = false;

                if ("USER".equalsIgnoreCase(role)) {
                    System.out.println("Looking for USER with ID: " + userId);
                    User user = userRepository.findById(userId).orElse(null);
                    if (user != null) {
                        System.out.println("Found user: " + user.getEmail() + ", Expected: " + email);
                        if (user.getEmail().equals(email)) {
                            principal = user;
                            isValidUser = true;
                            System.out.println("Valid USER found: " + user.getEmail());
                        } else {
                            System.out.println("Email mismatch - DB: " + user.getEmail() + ", Token: " + email);
                        }
                    } else {
                        System.out.println("USER not found with ID: " + userId);
                    }
                } else if ("SHOP".equalsIgnoreCase(role)) {
                    System.out.println("Looking for SHOP with ID: " + userId);
                    TireShop tireShop = tireShopRepository.findById(userId).orElse(null);
                    if (tireShop != null) {
                        System.out.println("Found shop: " + tireShop.getEmail() + ", Expected: " + email);
                        if (tireShop.getEmail().equals(email)) {
                            principal = tireShop;
                            isValidUser = true;
                            System.out.println("Valid SHOP found: " + tireShop.getEmail());
                        } else {
                            System.out.println("Email mismatch - DB: " + tireShop.getEmail() + ", Token: " + email);
                        }
                    } else {
                        System.out.println("SHOP not found with ID: " + userId);
                    }
                }

                if (isValidUser && principal != null) {
                    List<SimpleGrantedAuthority> authorities = Collections.singletonList(
                        new SimpleGrantedAuthority("ROLE_" + role.toUpperCase())
                    );

                    System.out.println("Setting authentication with authorities: " + authorities);

                    UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                        principal,
                        null,
                        authorities
                    );

                    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authentication);
                    System.out.println("Authentication set successfully");
                } else {
                    System.out.println("Authentication failed - invalid user or null principal");
                }
            } else {
                System.out.println("Missing required JWT claims");
        }

        filterChain.doFilter(request, response);
        } catch (Exception e) {
            // Log the error but don't expose it to the client
            logger.error("JWT Filter Error", e);
            filterChain.doFilter(request, response);
        }
    }
}
