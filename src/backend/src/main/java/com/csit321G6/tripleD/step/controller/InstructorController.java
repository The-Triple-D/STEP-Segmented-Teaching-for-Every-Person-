package com.csit321G6.tripleD.step.controller;

import java.util.List;

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

import com.csit321G6.tripleD.step.entity.InstructorEntity;
import com.csit321G6.tripleD.step.service.InstructorService;

@RestController
@RequestMapping("/instructor/api")
@CrossOrigin(origins = "*")
public class InstructorController {

    @Autowired
    private InstructorService instructorService;

    @PostMapping("/createInstructor/{userId}")
    public InstructorEntity createInstructor(@PathVariable String userId,
                                             @RequestBody InstructorEntity instructor) {
        return instructorService.createInstructor(userId, instructor);
    }

    @GetMapping("/getAllInstructors")
    public List<InstructorEntity> getAllInstructors() {
        return instructorService.getAllInstructors();
    }

    @GetMapping("/getInstructorById/{id}")
    public InstructorEntity getInstructorById(@PathVariable String id) {
        return instructorService.getInstructorById(id);
    }

    @PutMapping("/putInstructor")
    public InstructorEntity putInstructor(@RequestParam String id, @RequestBody InstructorEntity details) {
        return instructorService.updateInstructor(id, details);
    }

    @DeleteMapping("/deleteInstructor/{id}")
    public String deleteInstructor(@PathVariable String id) {
        return instructorService.deleteInstructor(id);
    }
}