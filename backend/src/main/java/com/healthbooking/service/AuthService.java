package com.healthbooking.service;

import com.healthbooking.dto.LoginRequest;
import com.healthbooking.dto.LoginResponse;
import com.healthbooking.entity.User;
import com.healthbooking.repository.UserRepository;

import at.favre.lib.crypto.bcrypt.BCrypt;
import io.smallrye.jwt.build.Jwt;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import java.util.Collections;

@ApplicationScoped
public class AuthService {

    @Inject
    UserRepository userRepository;

    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.email);
        if (user == null) {
            throw new SecurityException("Invalid email or password");
        }
        if (!BCrypt.verifyer().verify(request.password.toCharArray(), user.passwordHash).verified) {
            throw new SecurityException("Invalid email or password");
        }
        String token = Jwt.claims()
                .upn(user.email)
                .groups(Collections.singleton(user.role))
                .claim("patientId", user.patientId)
                .sign();
        return new LoginResponse(token, user.patientId, user.role);
    }
}
