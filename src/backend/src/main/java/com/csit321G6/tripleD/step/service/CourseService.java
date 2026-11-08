package com.csit321G6.tripleD.step.service;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.csit321G6.tripleD.step.entity.CourseEntity;
import com.csit321G6.tripleD.step.repository.CourseRepository;

@Service
public class CourseService {

    @Autowired
    private CourseRepository courseRepository;

    public CourseEntity createCourse(CourseEntity course) {
        course.setId(null);
        return courseRepository.save(course);
    }

    public List<CourseEntity> getAllCourses() {
        return courseRepository.findAll();
    }

    public CourseEntity updateCourse(String id, CourseEntity details) {
        Optional<CourseEntity> optionalCourse = courseRepository.findById(id);
        
        if (optionalCourse.isPresent()) {
            CourseEntity course = optionalCourse.get();
            course.setTitle(details.getTitle());
            course.setDescription(details.getDescription());
            course.setInstructorId(details.getInstructorId());
            return courseRepository.save(course);
        } else {
            return null;
        }
    }

    public String deleteCourse(String id) {
        if (courseRepository.existsById(id)) {
            courseRepository.deleteById(id);
            return "Course " + id + " is successfully deleted!";
        } else {
            return "Error: Course " + id + " does not exist!";
        }
    }
}