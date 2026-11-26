package com.csit321G6.tripleD.step.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.csit321G6.tripleD.step.entity.CheckInQuestionEntity;

public interface CheckInQuestionRepository extends JpaRepository<CheckInQuestionEntity, String> {
    List<CheckInQuestionEntity> findBySegment_Id(String segmentId);
}