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

import com.csit321G6.tripleD.step.entity.StudentEntity;
import com.csit321G6.tripleD.step.service.StudentService;

@RestController
@RequestMapping("/student/api")
@CrossOrigin(origins = "*")
public class StudentController {

    @Autowired
    private StudentService studentService;

    @PostMapping("/createStudent/{userId}")
    public StudentEntity createStudent(@PathVariable String userId, @RequestBody StudentEntity student) {
        return studentService.createStudent(userId, student);
    }

    @GetMapping("/getAllStudents")
    public List<StudentEntity> getAllStudents() {
        return studentService.getAllStudents();
    }

    @GetMapping("/getStudentById/{id}")
    public StudentEntity getStudentById(@PathVariable String id) {
        return studentService.getStudentById(id);
    }

    @PutMapping("/putStudent")
    public StudentEntity putStudent(@RequestParam String id, @RequestBody StudentEntity details) {
        return studentService.updateStudent(id, details);
    }

    @DeleteMapping("/deleteStudent/{id}")
    public String deleteStudent(@PathVariable String id) {
        return studentService.deleteStudent(id);
    }
}