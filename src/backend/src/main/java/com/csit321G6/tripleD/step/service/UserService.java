package com.csit321G6.tripleD.step.service;

import java.security.SecureRandom;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.csit321G6.tripleD.step.entity.StudentEntity;
import com.csit321G6.tripleD.step.entity.UserEntity;
import com.csit321G6.tripleD.step.repository.InstructorRepository;
import com.csit321G6.tripleD.step.repository.StudentRepository;
import com.csit321G6.tripleD.step.repository.UserRepository;

@Service
public class UserService {

    private static final String EMAIL_FORMAT = "^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$";
    private static final SecureRandom RANDOM = new SecureRandom();

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private InstructorRepository instructorRepository;

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username:}")
    private String mailFrom;

    private record OtpEntry(String userId, String code, Instant expiresAt, Instant canResendAt) {}
    private final Map<String, OtpEntry> resetOtps = new ConcurrentHashMap<>();

    public void requestPasswordReset(String email) {
        String normalizedEmail = email == null ? "" : email.trim().toLowerCase();
        if (isBlank(normalizedEmail) || !normalizedEmail.matches(EMAIL_FORMAT)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "A valid email is required");
        }

        OtpEntry existing = resetOtps.get(normalizedEmail);
        if (existing != null && Instant.now().isBefore(existing.canResendAt())) {
            long secondsLeft = Math.max(1, ChronoUnit.SECONDS.between(Instant.now(), existing.canResendAt()));
            throw new ResponseStatusException(HttpStatus.TOO_MANY_REQUESTS,
                "Please wait " + secondsLeft + " seconds before requesting a new code.");
        }

        Optional<UserEntity> userOpt = userRepository.findByEmail(normalizedEmail);
        if (userOpt.isEmpty()) {
            return; // Avoid leaking whether an email exists
        }

        if (isBlank(mailFrom)) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                "Email service is not configured (MAIL_USERNAME is missing)");
        }

        String code = String.format("%06d", RANDOM.nextInt(1_000_000));
        Instant now = Instant.now();
        resetOtps.put(normalizedEmail, new OtpEntry(
            userOpt.get().getId(),
            code,
            now.plus(5, ChronoUnit.MINUTES),
            now.plus(1, ChronoUnit.MINUTES)
        ));

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("STEP Learning <" + mailFrom + ">");
            message.setTo(normalizedEmail);
            message.setSubject("STEP Password Reset Verification Code");
            message.setText(
                "Hi " + userOpt.get().getFirstName() + ",\n\n" +
                "Your STEP password reset verification code is:\n\n" +
                "    " + code + "\n\n" +
                "This code expires in 5 minutes. If you did not request a password reset, you can safely ignore this email."
            );
            mailSender.send(message);
        } catch (Exception ex) {
            resetOtps.remove(normalizedEmail);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                "Failed to send verification email. Check Gmail SMTP credentials.");
        }
    }

    public void verifyOtp(String email, String otp) {
        String normalizedEmail = email == null ? "" : email.trim().toLowerCase();
        String cleanOtp = otp == null ? "" : otp.trim();

        if (isBlank(normalizedEmail) || isBlank(cleanOtp)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                "Email and 6-digit verification code are required");
        }

        OtpEntry entry = resetOtps.get(normalizedEmail);
        if (entry == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                "No active reset code found. Please request a new code.");
        }
        if (Instant.now().isAfter(entry.expiresAt())) {
            resetOtps.remove(normalizedEmail);
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                "This verification code has expired. Please request a new one.");
        }
        if (!entry.code().equals(cleanOtp)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                "Invalid 6-digit verification code.");
        }
    }

    public void resetPassword(String email, String otp, String newPassword) {
        String normalizedEmail = email == null ? "" : email.trim().toLowerCase();
        String cleanOtp = otp == null ? "" : otp.trim();

        if (isBlank(normalizedEmail) || isBlank(cleanOtp) || isBlank(newPassword)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                "Email, 6-digit code, and new password are required");
        }
        if (newPassword.length() < 8) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                "New password must be at least 8 characters");
        }

        OtpEntry entry = resetOtps.get(normalizedEmail);
        if (entry == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                "No active reset code found. Please request a new code.");
        }
        if (Instant.now().isAfter(entry.expiresAt())) {
            resetOtps.remove(normalizedEmail);
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                "This verification code has expired. Please request a new one.");
        }
        if (!entry.code().equals(cleanOtp)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                "Invalid 6-digit verification code.");
        }

        resetOtps.remove(normalizedEmail);
        UserEntity user = getUserById(entry.userId());
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
        if (!isBlank(user.getSchoolId()) && userRepository.existsBySchoolId(user.getSchoolId())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                "School ID " + user.getSchoolId() + " is already registered");
        }
        user.setId(null);

        UserEntity savedUser = userRepository.save(user);

        if (Boolean.TRUE.equals(savedUser.getIsStudent())) {
            StudentEntity student = new StudentEntity();
            student.setId(UUID.randomUUID().toString());
            student.setUser(savedUser);
            student.setCurrentStreak(0);
            student.setLastStudyDate(null);
            studentRepository.save(student);
        }

        return savedUser;
    }

    public UserEntity loginUser(String identifier, String passwordHash) {
        String cleanIdentifier = identifier == null ? "" : identifier.trim();
        if (isBlank(cleanIdentifier) || isBlank(passwordHash)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email/ID and password are required");
        }
        UserEntity user = userRepository
            .findByEmailOrSchoolId(cleanIdentifier.toLowerCase(), cleanIdentifier)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email/ID or password"));
        if (!passwordHash.equals(user.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email/ID or password");
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
        if (!isBlank(details.getSchoolId())) {
            Optional<UserEntity> sameSchoolId = userRepository.findBySchoolId(details.getSchoolId());
            if (sameSchoolId.isPresent() && !sameSchoolId.get().getId().equals(id)) {
                throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "School ID " + details.getSchoolId() + " is already registered");
            }
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
        user.setSchoolId(details.getSchoolId());
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
        if (u.getSchoolId() != null) {
            String trimmedId = u.getSchoolId().trim();
            u.setSchoolId(trimmedId.isEmpty() ? null : trimmedId);
        }
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