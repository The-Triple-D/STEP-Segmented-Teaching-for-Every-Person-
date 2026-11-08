package com.csit321G6.tripleD.step.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.csit321G6.tripleD.step.entity.LessonEntity;

@Repository
public interface LessonRepository extends JpaRepository<LessonEntity, String> {
    List<LessonEntity> findByCourse_Id(String courseId);
}