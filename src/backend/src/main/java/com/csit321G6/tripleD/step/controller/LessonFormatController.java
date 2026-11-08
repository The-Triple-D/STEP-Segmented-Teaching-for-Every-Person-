package com.csit321G6.tripleD.step.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
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

    @PutMapping("/putFormat")
    public LessonFormatEntity putFormat(@RequestParam String id, @RequestBody LessonFormatEntity newFormatDetails) {
        return fserv.updateFormat(id, newFormatDetails);
    }

    @DeleteMapping("/deleteFormat/{id}")
    public String deleteFormat(@PathVariable String id) {
        return fserv.deleteFormat(id);
    }
}