package com.csit321G6.tripleD.step.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.csit321G6.tripleD.step.entity.SegmentEntity;

@Repository
public interface SegmentRepository extends JpaRepository<SegmentEntity, String> {
    // Change from findByLessonLessonId... to findByLessonId...
    List<SegmentEntity> findByLessonIdOrderByOrderIndexAsc(String lessonId);
}