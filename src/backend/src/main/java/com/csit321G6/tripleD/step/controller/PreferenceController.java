package com.csit321G6.tripleD.step.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.csit321G6.tripleD.step.entity.PreferenceEntity;
import com.csit321G6.tripleD.step.service.PreferenceService;

import java.util.List;

@RestController
@CrossOrigin
public class PreferenceController {

    @Autowired
    private PreferenceService preferenceService;

    @GetMapping("/api/preferences")
    public ResponseEntity<List<PreferenceEntity>> getAllPreferences() {
        return ResponseEntity.ok(preferenceService.getAllPreferences());
    }

    @GetMapping("/api/preferences/{id}")
    public ResponseEntity<PreferenceEntity> getPreferenceById(@PathVariable String id) {
        return ResponseEntity.ok(preferenceService.getPreferenceById(id));
    }

    @GetMapping("/api/students/{studentId}/preferences")
    public ResponseEntity<PreferenceEntity> getPreferencesByStudentId(@PathVariable String studentId) {
        return ResponseEntity.ok(preferenceService.getPreferenceByStudentId(studentId));
    }

    @PostMapping("/api/students/{studentId}/preferences")
    public ResponseEntity<PreferenceEntity> createPreference(
            @PathVariable String studentId,
            @RequestBody PreferenceEntity preference) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(preferenceService.createPreference(studentId, preference));
    }

    @PutMapping("/api/preferences/{id}")
    public ResponseEntity<PreferenceEntity> updatePreference(
            @PathVariable String id,
            @RequestBody PreferenceEntity preference) {
        return ResponseEntity.ok(preferenceService.updatePreference(id, preference));
    }

    @DeleteMapping("/api/preferences/{id}")
    public ResponseEntity<Void> deletePreference(@PathVariable String id) {
        preferenceService.deletePreference(id);
        return ResponseEntity.noContent().build();
    }
}