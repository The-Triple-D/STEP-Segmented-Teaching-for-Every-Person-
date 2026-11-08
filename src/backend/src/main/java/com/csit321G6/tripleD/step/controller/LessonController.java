package com.csit321G6.tripleD.step.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.csit321G6.tripleD.step.entity.LessonEntity;
import com.csit321G6.tripleD.step.service.LessonService;

@RestController
@RequestMapping("/lesson/api")
@CrossOrigin(origins = "*")
public class LessonController {

    @Autowired
    LessonService lserv;

    @PostMapping("/postNewLesson/{courseId}")
    public LessonEntity postLesson(@PathVariable String courseId, @RequestBody LessonEntity lesson) {
        return lserv.createLesson(courseId, lesson);
    }

    @GetMapping("/getLessonsByCourse/{courseId}")
    public List<LessonEntity> getLessonsByCourse(@PathVariable String courseId) {
        return lserv.getLessonsByCourse(courseId);
    }

    @PutMapping("/putLesson")
    public LessonEntity putLesson(@RequestParam String id, @RequestBody LessonEntity newLessonDetails) {
        return lserv.updateLesson(id, newLessonDetails);
    }

    @DeleteMapping("/deleteLesson/{id}")
    public String deleteLesson(@PathVariable String id) {
        return lserv.deleteLesson(id);
    }
}