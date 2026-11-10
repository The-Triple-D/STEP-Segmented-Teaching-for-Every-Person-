package com.csit321G6.tripleD.step.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.csit321G6.tripleD.step.entity.InstructorEntity;
import com.csit321G6.tripleD.step.entity.UserEntity;
import com.csit321G6.tripleD.step.repository.CourseRepository;
import com.csit321G6.tripleD.step.repository.InstructorRepository;
import com.csit321G6.tripleD.step.repository.UserRepository;

@Service
public class InstructorService {

    @Autowired
    private InstructorRepository instructorRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CourseRepository courseRepository;

    public InstructorEntity createInstructor(String userId, InstructorEntity instructor) {
        UserEntity user = userRepository.findById(userId).orElseThrow(() ->
            new ResponseStatusException(HttpStatus.NOT_FOUND, "User " + userId + " does not exist"));

        if (!Boolean.TRUE.equals(user.getIsInstructor())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "This user is not flagged as an instructor");
        }
        if (instructorRepository.existsByUser_Id(userId)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                "This user already has an instructor profile");
        }

        instructor.setId(null);
        instructor.setUser(user);
        return instructorRepository.save(instructor);
    }

    public List<InstructorEntity> getAllInstructors() {
        return instructorRepository.findAll();
    }

    public InstructorEntity getInstructorById(String id) {
        return instructorRepository.findById(id).orElseThrow(() ->
            new ResponseStatusException(HttpStatus.NOT_FOUND, "Instructor " + id + " does not exist"));
    }

    public InstructorEntity updateInstructor(String id, InstructorEntity details) {
        InstructorEntity instructor = getInstructorById(id);
        instructor.setBio(details.getBio());
        instructor.setExpertise(details.getExpertise());
        return instructorRepository.save(instructor);
    }

    public String deleteInstructor(String id) {
        getInstructorById(id);
        if (courseRepository.existsByInstructorId(id)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                "This instructor still has courses. Delete or reassign them first");
        }
        instructorRepository.deleteById(id);
        return "Instructor " + id + " is successfully deleted!";
    }
}