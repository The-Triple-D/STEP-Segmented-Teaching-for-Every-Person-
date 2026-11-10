package com.csit321G6.tripleD.step.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.csit321G6.tripleD.step.entity.StudentEntity;
import com.csit321G6.tripleD.step.entity.UserEntity;
import com.csit321G6.tripleD.step.repository.StudentRepository;
import com.csit321G6.tripleD.step.repository.UserRepository;

@Service
public class StudentService {

    private static final String SCHOOL_ID_FORMAT = "^\\d{2}-\\d{4}-\\d{3}$";

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private UserRepository userRepository;

    public StudentEntity createStudent(String userId, StudentEntity student) {
        UserEntity user = userRepository.findById(userId).orElseThrow(() ->
            new ResponseStatusException(HttpStatus.NOT_FOUND, "User " + userId + " does not exist"));

        if (!Boolean.TRUE.equals(user.getIsStudent())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "This user is not flagged as a student");
        }
        if (student.getId() == null || !student.getId().trim().matches(SCHOOL_ID_FORMAT)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                "A valid school ID is required as the student id");
        }
        student.setId(student.getId().trim());
        validateStreak(student);

        if (studentRepository.existsById(student.getId())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                "Student " + student.getId() + " already exists");
        }
        if (studentRepository.existsByUser_Id(userId)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                "This user already has a student profile");
        }

        student.setUser(user);
        return studentRepository.save(student);
    }

    public List<StudentEntity> getAllStudents() {
        return studentRepository.findAll();
    }

    public StudentEntity getStudentById(String id) {
        return studentRepository.findById(id).orElseThrow(() ->
            new ResponseStatusException(HttpStatus.NOT_FOUND, "Student " + id + " does not exist"));
    }

    public StudentEntity updateStudent(String id, StudentEntity details) {
        StudentEntity student = getStudentById(id);
        validateStreak(details);
        student.setCurrentStreak(details.getCurrentStreak());
        student.setLastStudyDate(details.getLastStudyDate());
        return studentRepository.save(student);
    }

    public String deleteStudent(String id) {
        getStudentById(id);
        studentRepository.deleteById(id);
        return "Student " + id + " is successfully deleted!";
    }

    private void validateStreak(StudentEntity student) {
        if (student.getCurrentStreak() < 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Streak cannot be negative");
        }
    }
}