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

import com.csit321G6.tripleD.step.entity.LessonFormatEntity;
import com.csit321G6.tripleD.step.service.LessonFormatService;

@RestController
@RequestMapping("/lessonformat/api")
@CrossOrigin(origins = "*")
public class LessonFormatController {

    @Autowired
    LessonFormatService fserv;

    @PostMapping("/postNewFormat/{lessonId}")
    public LessonFormatEntity postFormat(@PathVariable String lessonId, @RequestBody LessonFormatEntity format) {
        return fserv.createFormat(lessonId, format);
    }

    @GetMapping("/getFormatsByLesson/{lessonId}")
    public List<LessonFormatEntity> getFormatsByLesson(@PathVariable String lessonId) {
        return fserv.getFormatsByLesson(lessonId);
    }

    @GetMapping("/getAllFormats")
    public List<LessonFormatEntity> getAllFormats() {
        return fserv.getAllFormats();
    }

    @GetMapping("/getFormat/{id}")
    public LessonFormatEntity getFormat(@PathVariable String id) {
        return fserv.getFormatById(id);
    }

    @PutMapping("/putFormat")
    public LessonFormatEntity putFormat(@RequestParam String id, @RequestBody LessonFormatEntity newFormatDetails) {
        return fserv.updateFormat(id, newFormatDetails);
    }

    @DeleteMapping("/deleteFormat/{id}")
    public String deleteFormat(@PathVariable String id) {
        return fserv.deleteFormat(id);
    }
}