package com.csit321G6.tripleD.step.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.csit321G6.tripleD.step.entity.InstructorEntity;

@Repository
public interface InstructorRepository extends JpaRepository<InstructorEntity, String> {
    Optional<InstructorEntity> findByUser_Id(String userId);
    boolean existsByUser_Id(String userId);
}