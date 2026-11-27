package com.csit321G6.tripleD.step.service;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.csit321G6.tripleD.step.entity.UserEntity;
import com.csit321G6.tripleD.step.repository.InstructorRepository;
import com.csit321G6.tripleD.step.repository.StudentRepository;
import com.csit321G6.tripleD.step.repository.UserRepository;

@Service
public class UserService {

    private static final String EMAIL_FORMAT = "^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$";

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private InstructorRepository instructorRepository;

    private final Map<String, String> resetTokens = new ConcurrentHashMap<>();

    public String requestPasswordReset(String email) {
        String normalizedEmail = email == null ? "" : email.trim().toLowerCase();
        if (isBlank(normalizedEmail)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email is required");
        }
        Optional<UserEntity> userOpt = userRepository.findByEmail(normalizedEmail);
        if (userOpt.isEmpty()) {
            return null;
        }
        String token = UUID.randomUUID().toString();
        resetTokens.put(token, userOpt.get().getId());
        return token;
    }

    public void resetPassword(String token, String newPassword) {
        if (isBlank(token) || isBlank(newPassword)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Token and new password are required");
        }
        String userId = resetTokens.remove(token.trim());
        if (userId == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "This reset link is invalid or already used.");
        }
        UserEntity user = getUserById(userId);
        user.setPasswordHash(newPassword);
        userRepository.save(user);
    }

    public UserEntity createUser(UserEntity user) {
        prepare(user);
        validate(user, true);
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                "Email " + user.getEmail() + " is already registered");
        }
        user.setId(null);
        return userRepository.save(user);
    }

    public UserEntity loginUser(String email, String passwordHash) {
        String normalizedEmail = email == null ? "" : email.trim().toLowerCase();
        if (isBlank(normalizedEmail) || isBlank(passwordHash)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email and password are required");
        }
        UserEntity user = userRepository.findByEmail(normalizedEmail).orElseThrow(() ->
            new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password"));
        if (!passwordHash.equals(user.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password");
        }
        return user;
    }

    public List<UserEntity> getAllUsers() {
        return userRepository.findAll();
    }

    public UserEntity getUserById(String id) {
        return userRepository.findById(id).orElseThrow(() ->
            new ResponseStatusException(HttpStatus.NOT_FOUND, "User " + id + " does not exist"));
    }

    public UserEntity updateUser(String id, UserEntity details) {
        UserEntity user = getUserById(id);
        prepare(details);
        validate(details, false);

        Optional<UserEntity> sameEmail = userRepository.findByEmail(details.getEmail());
        if (sameEmail.isPresent() && !sameEmail.get().getId().equals(id)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                "Email " + details.getEmail() + " is already registered");
        }
        if (!details.getIsStudent() && studentRepository.existsByUser_Id(id)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                "Delete this user's student profile before removing the student role");
        }
        if (!details.getIsInstructor() && instructorRepository.existsByUser_Id(id)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                "Delete this user's instructor profile before removing the instructor role");
        }

        user.setFirstName(details.getFirstName());
        user.setLastName(details.getLastName());
        user.setEmail(details.getEmail());
        user.setIsStudent(details.getIsStudent());
        user.setIsInstructor(details.getIsInstructor());
        user.setIsAdmin(details.getIsAdmin());
        if (!isBlank(details.getPasswordHash())) {
            user.setPasswordHash(details.getPasswordHash());
        }
        return userRepository.save(user);
    }

    public String deleteUser(String id) {
        getUserById(id);
        if (studentRepository.existsByUser_Id(id) || instructorRepository.existsByUser_Id(id)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                "Delete this user's student or instructor profile first");
        }
        userRepository.deleteById(id);
        return "User " + id + " is successfully deleted!";
    }

    private void prepare(UserEntity u) {
        if (u.getFirstName() != null) u.setFirstName(u.getFirstName().trim());
        if (u.getLastName() != null) u.setLastName(u.getLastName().trim());
        if (u.getEmail() != null) u.setEmail(u.getEmail().trim().toLowerCase());
        if (u.getIsStudent() == null) u.setIsStudent(false);
        if (u.getIsInstructor() == null) u.setIsInstructor(false);
        if (u.getIsAdmin() == null) u.setIsAdmin(false);
    }

    private void validate(UserEntity u, boolean requirePassword) {
        if (isBlank(u.getFirstName())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "First name is required");
        }
        if (isBlank(u.getLastName())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Last name is required");
        }
        if (isBlank(u.getEmail()) || !u.getEmail().matches(EMAIL_FORMAT)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "A valid email is required");
        }
        if (requirePassword && isBlank(u.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Password is required");
        }
        if (!u.getIsStudent() && !u.getIsInstructor() && !u.getIsAdmin()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                "At least one role (isStudent, isInstructor or isAdmin) must be true");
        }
    }

    private boolean isBlank(String s) {
        return s == null || s.isBlank();
    }
}