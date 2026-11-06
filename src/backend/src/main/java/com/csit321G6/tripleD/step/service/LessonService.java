package com.csit321G6.tripleD.step.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.csit321G6.tripleD.step.entity.LessonEntity;
import com.csit321G6.tripleD.step.repository.CourseRepository;
import com.csit321G6.tripleD.step.repository.LessonRepository;

@Service
public class LessonService {

    @Autowired
    private LessonRepository lessonRepository;

    @Autowired
    private CourseRepository courseRepository;

    public LessonEntity createLesson(String courseId, LessonEntity lesson) {
        return courseRepository.findById(courseId).map(course -> {
            lesson.setCourse(course);
            return lessonRepository.save(lesson);
        }).orElseThrow(() -> new RuntimeException("Course not found"));
    }

    public List<LessonEntity> getLessonsByCourse(String courseId) {
        return lessonRepository.findByCourseId(courseId);
    }

    public LessonEntity updateLesson(String id, LessonEntity details) {
        return lessonRepository.findById(id).map(existingLesson -> {
            existingLesson.setTitle(details.getTitle());
            existingLesson.setStatus(details.getStatus());
            existingLesson.setSourceType(details.getSourceType());
            existingLesson.setSourceUrl(details.getSourceUrl());
            existingLesson.setEstimatedDuration(details.getEstimatedDuration());
            return lessonRepository.save(existingLesson);
        }).orElse(null);
    }

    public void deleteLesson(String id) {
        lessonRepository.deleteById(id);
    }
}