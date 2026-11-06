package com.csit321G6.tripleD.step.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.csit321G6.tripleD.step.entity.CourseEntity;
import com.csit321G6.tripleD.step.repository.CourseRepository;

@Service
public class CourseService {

    @Autowired
    private CourseRepository courseRepository;

    public CourseEntity createCourse(CourseEntity course) {
        return courseRepository.save(course);
    }

    public List<CourseEntity> getAllCourses() {
        return courseRepository.findAll();
    }

    public CourseEntity updateCourse(String id, CourseEntity details) {
        return courseRepository.findById(id).map(course -> {
            course.setTitle(details.getTitle());
            course.setDescription(details.getDescription());
            course.setInstructorId(details.getInstructorId());
            return courseRepository.save(course);
        }).orElse(null);
    }

    public void deleteCourse(String id) {
        courseRepository.deleteById(id);
    }
}