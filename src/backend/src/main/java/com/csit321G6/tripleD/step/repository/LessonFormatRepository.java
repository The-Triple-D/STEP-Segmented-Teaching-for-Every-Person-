package com.csit321G6.tripleD.step.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.csit321G6.tripleD.step.entity.LessonFormatEntity;

@Repository
public interface LessonFormatRepository extends JpaRepository<LessonFormatEntity, String> {
    List<LessonFormatEntity> findByLessonId(String lessonId);
}