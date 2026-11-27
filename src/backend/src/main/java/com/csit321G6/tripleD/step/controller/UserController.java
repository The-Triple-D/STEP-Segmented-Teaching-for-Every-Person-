package com.csit321G6.tripleD.step.controller;

import java.util.Collections;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.csit321G6.tripleD.step.entity.UserEntity;
import com.csit321G6.tripleD.step.service.UserService;

@RestController
@RequestMapping("/user/api")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/createUser")
    public UserEntity createUser(@RequestBody UserEntity user) {
        return userService.createUser(user);
    }

    @PostMapping("/login")
    public UserEntity login(@RequestBody UserEntity loginRequest) {
        return userService.loginUser(loginRequest.getEmail(), loginRequest.getPasswordHash());
    }

    @PostMapping("/forgotPassword")
    public Map<String, String> forgotPassword(@RequestBody Map<String, String> request) {
        String token = userService.requestPasswordReset(request.get("email"));
        return Collections.singletonMap("token", token);
    }

    @PostMapping("/resetPassword")
    public Map<String, String> resetPassword(@RequestBody Map<String, String> request) {
        userService.resetPassword(request.get("token"), request.get("newPassword"));
        return Collections.singletonMap("message", "Password updated successfully.");
    }

    @GetMapping("/getAllUsers")
    public List<UserEntity> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/getUserById/{id}")
    public UserEntity getUserById(@PathVariable String id) {
        return userService.getUserById(id);
    }

    @PutMapping("/putUser")
    public UserEntity putUser(@RequestParam String id, @RequestBody UserEntity details) {
        return userService.updateUser(id, details);
    }

    @DeleteMapping("/deleteUser/{id}")
    public String deleteUser(@PathVariable String id) {
        return userService.deleteUser(id);
    }
}