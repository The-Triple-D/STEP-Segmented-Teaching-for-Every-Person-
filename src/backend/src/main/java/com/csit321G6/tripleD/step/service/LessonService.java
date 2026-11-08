package com.csit321G6.tripleD.step.service;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.csit321G6.tripleD.step.entity.CourseEntity;
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
        Optional<CourseEntity> optionalCourse = courseRepository.findById(courseId);
        
        if (optionalCourse.isPresent()) {
            lesson.setId(null);
            
            if (lesson.getStatus() == null || lesson.getStatus().isEmpty()) {
                lesson.setStatus("DRAFT");
            }
            
            lesson.setCourse(optionalCourse.get());
            return lessonRepository.save(lesson);
        } else {
            return null;
        }
    }

    public List<LessonEntity> getLessonsByCourse(String courseId) {
        return lessonRepository.findByCourseId(courseId);
    }

    public LessonEntity updateLesson(String id, LessonEntity details) {
        Optional<LessonEntity> optionalLesson = lessonRepository.findById(id);
        
        if (optionalLesson.isPresent()) {
            LessonEntity lesson = optionalLesson.get();
            lesson.setTitle(details.getTitle());
            lesson.setStatus(details.getStatus());
            lesson.setSourceType(details.getSourceType());
            lesson.setSourceUrl(details.getSourceUrl());
            lesson.setEstimatedDuration(details.getEstimatedDuration());
            return lessonRepository.save(lesson);
        } else {
            return null;
        }
    }

    public String deleteLesson(String id) {
        if (lessonRepository.existsById(id)) {
            lessonRepository.deleteById(id);
            return "Lesson " + id + " is successfully deleted!";
        } else {
            return "Error: Lesson " + id + " does not exist!";
        }
    }
}