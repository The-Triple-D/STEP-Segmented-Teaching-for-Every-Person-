package com.csit321G6.tripleD.step.controller;

import com.csit321G6.tripleD.step.entity.InstructorEntity;
import com.csit321G6.tripleD.step.service.InstructorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@RestController
@RequestMapping("/instructor/api")
public class InstructorController {

    @Autowired
    private InstructorService instructorService;

    @GetMapping("/getAllInstructors")
    public List<InstructorEntity> getAllInstructors() {
        return instructorService.getAllInstructors();
    }

    @PostMapping("/createInstructor")
    public ResponseEntity<InstructorEntity> createInstructor(@RequestBody InstructorEntity instructor) {
        InstructorEntity savedInstructor = instructorService.saveInstructor(instructor);
        return ResponseEntity.ok(savedInstructor);
    }

    @DeleteMapping("/deleteInstructor/{id}")
    public ResponseEntity<String> deleteInstructor(@PathVariable Long id) {
        instructorService.deleteInstructor(id);
        return ResponseEntity.ok("Instructor deleted successfully");
    }
}