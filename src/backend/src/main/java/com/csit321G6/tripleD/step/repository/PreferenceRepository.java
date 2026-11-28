package com.csit321G6.tripleD.step.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.csit321G6.tripleD.step.entity.PreferenceEntity;
import java.util.Optional;

@Repository
public interface PreferenceRepository extends JpaRepository<PreferenceEntity, String> {
    Optional<PreferenceEntity> findByStudentId(String studentId);
    boolean existsByStudentId(String studentId);
}