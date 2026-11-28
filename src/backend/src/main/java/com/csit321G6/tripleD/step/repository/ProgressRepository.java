package com.csit321G6.tripleD.step.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.csit321G6.tripleD.step.entity.ProgressEntity;

@Repository
public interface ProgressRepository extends JpaRepository<ProgressEntity, String> {

    Optional<ProgressEntity> findByStudent_IdAndSegment_Id(String studentId, String segmentId);

    List<ProgressEntity> findByStudent_IdOrderByCompletedAtDesc(String studentId);

    long countByStudent_IdAndSegment_Lesson_Id(String studentId, String lessonId);
}
