package com.csit321G6.tripleD.step.service;

import com.csit321G6.tripleD.step.entity.InstructorEntity;
import com.csit321G6.tripleD.step.repository.InstructorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class InstructorService {

    @Autowired
    private InstructorRepository instructorRepository;

    public List<InstructorEntity> getAllInstructors() {
        return instructorRepository.findAll();
    }

    public Optional<InstructorEntity> getInstructorById(Long id) {
        return instructorRepository.findById(id);
    }

    public InstructorEntity saveInstructor(InstructorEntity instructor) {
        return instructorRepository.save(instructor);
    }

    public void deleteInstructor(Long id) {
        instructorRepository.deleteById(id);
    }
}