package com.csit321G6.tripleD.step.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.csit321G6.tripleD.step.entity.CourseEntity;
import com.csit321G6.tripleD.step.repository.CourseRepository;

@Service
public class CourseService {

    @Autowired
    private CourseRepository courseRepository;

    public CourseEntity createCourse(CourseEntity course) {
        validate(course);
        course.setId(null);
        return courseRepository.save(course);
    }

    public List<CourseEntity> getAllCourses() {
        return courseRepository.findAll();
    }

    public CourseEntity getCourseById(String id) {
        return courseRepository.findById(id).orElseThrow(() ->
            new ResponseStatusException(HttpStatus.NOT_FOUND, "Course " + id + " does not exist"));
    }

    public CourseEntity updateCourse(String id, CourseEntity details) {
        CourseEntity course = getCourseById(id);
        validate(details);
        course.setTitle(details.getTitle());
        course.setDescription(details.getDescription());
        if (details.getInstructorId() != null) {
            course.setInstructorId(details.getInstructorId());
        }
        return courseRepository.save(course);
    }

    public String deleteCourse(String id) {
        getCourseById(id);
        courseRepository.deleteById(id);
        return "Course " + id + " is successfully deleted!";
    }

    private void validate(CourseEntity course) {
        if (course.getTitle() == null || course.getTitle().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Title is required");
        }
    }
}