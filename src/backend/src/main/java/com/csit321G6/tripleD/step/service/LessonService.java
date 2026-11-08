package com.csit321G6.tripleD.step.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.csit321G6.tripleD.step.entity.CourseEntity;
import com.csit321G6.tripleD.step.entity.LessonEntity;
import com.csit321G6.tripleD.step.entity.LessonStatus;
import com.csit321G6.tripleD.step.repository.CourseRepository;
import com.csit321G6.tripleD.step.repository.LessonRepository;

@Service
public class LessonService {

    @Autowired
    private LessonRepository lessonRepository;

    @Autowired
    private CourseRepository courseRepository;

    public LessonEntity createLesson(String courseId, LessonEntity lesson) {
        CourseEntity course = courseRepository.findById(courseId).orElseThrow(() ->
            new ResponseStatusException(HttpStatus.NOT_FOUND, "Course " + courseId + " does not exist"));
        validate(lesson);
        lesson.setId(null);
        if (lesson.getStatus() == null) {
            lesson.setStatus(LessonStatus.DRAFT);
        }
        lesson.setCourse(course);
        return lessonRepository.save(lesson);
    }

    public List<LessonEntity> getAllLessons() {
        return lessonRepository.findAll();
    }

    public LessonEntity getLessonById(String id) {
        return lessonRepository.findById(id).orElseThrow(() ->
            new ResponseStatusException(HttpStatus.NOT_FOUND, "Lesson " + id + " does not exist"));
    }

    public List<LessonEntity> getLessonsByCourse(String courseId) {
        if (!courseRepository.existsById(courseId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Course " + courseId + " does not exist");
        }
        return lessonRepository.findByCourse_Id(courseId);
    }

    public LessonEntity updateLesson(String id, LessonEntity details) {
        LessonEntity lesson = getLessonById(id);
        validate(details);
        lesson.setTitle(details.getTitle());
        if (details.getStatus() != null) {
            lesson.setStatus(details.getStatus());
        }
        lesson.setSourceType(details.getSourceType());
        lesson.setSourceUrl(details.getSourceUrl());
        lesson.setEstimatedDuration(details.getEstimatedDuration());
        return lessonRepository.save(lesson);
    }

    public String deleteLesson(String id) {
        getLessonById(id);
        lessonRepository.deleteById(id);
        return "Lesson " + id + " is successfully deleted!";
    }

    private void validate(LessonEntity lesson) {
        if (lesson.getTitle() == null || lesson.getTitle().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Title is required");
        }
        if (lesson.getSourceType() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Source type is required (VIDEO or PDF)");
        }
        if (lesson.getEstimatedDuration() != null && lesson.getEstimatedDuration() < 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Estimated duration cannot be negative");
        }
    }
}