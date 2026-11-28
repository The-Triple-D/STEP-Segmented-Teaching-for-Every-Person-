package com.csit321G6.tripleD.step.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.csit321G6.tripleD.step.service.ProgressService;
import com.csit321G6.tripleD.step.service.ProgressService.ProgressResponse;
import com.csit321G6.tripleD.step.service.ProgressService.LessonProgressResponse;

@RestController
@CrossOrigin
@RequestMapping("/api/students/{studentId}/progress")
public class ProgressController {

    @Autowired
    private ProgressService progressService;

    @PutMapping("/segments/{segmentId}")
    public ResponseEntity<ProgressResponse> completeSegment(
            @PathVariable String studentId,
            @PathVariable String segmentId) {
        return ResponseEntity.ok(progressService.completeSegment(studentId, segmentId));
    }

    @GetMapping
    public ResponseEntity<List<ProgressResponse>> getStudentProgress(
            @PathVariable String studentId) {
        return ResponseEntity.ok(progressService.getStudentProgress(studentId));
    }

    @GetMapping("/lessons/{lessonId}")
    public ResponseEntity<LessonProgressResponse> getLessonProgress(
            @PathVariable String studentId,
            @PathVariable String lessonId) {
        return ResponseEntity.ok(progressService.getLessonProgress(studentId, lessonId));
    }
}
