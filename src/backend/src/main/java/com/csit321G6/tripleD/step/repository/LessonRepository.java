package com.csit321G6.tripleD.step.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.csit321G6.tripleD.step.entity.LessonEntity;

@Repository
public interface LessonRepository extends JpaRepository<LessonEntity, String> {
    // Notice how it's CourseId (the CourseEntity object's Id)
    List<LessonEntity> findByCourseId(String courseId);
}