package com.csit321G6.tripleD.step.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.csit321G6.tripleD.step.entity.CourseEntity;
import com.csit321G6.tripleD.step.service.CourseService;

@RestController
@RequestMapping("/course/api")
@CrossOrigin(origins = "*") 
public class CourseController {

    @Autowired
    CourseService cserv;

    @GetMapping("/printAuthor")
    public String printAuthor() {
        return "Shakira Marie P. Docena"; 
    }
    
    @PostMapping("/postNewCourse")
    public CourseEntity postCourse(@RequestBody CourseEntity course) {
        return cserv.createCourse(course);
    }

    @GetMapping("/getAllCourses")
    public List<CourseEntity> getAllCourses() {
        return cserv.getAllCourses();
    }

    @PutMapping("/putCourse")
    public CourseEntity putCourse(@RequestParam String id, @RequestBody CourseEntity newCourseDetails) {
        return cserv.updateCourse(id, newCourseDetails);
    }

    @DeleteMapping("/deleteCourse/{id}")
    public String deleteCourse(@PathVariable String id) {
        return cserv.deleteCourse(id);
    }
}