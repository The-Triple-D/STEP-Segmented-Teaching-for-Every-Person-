package com.csit321G6.tripleD.step.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.csit321G6.tripleD.step.entity.CourseEntity;

@Repository
public interface CourseRepository extends JpaRepository<CourseEntity, String> {
    boolean existsByInstructorId(String instructorId);
}