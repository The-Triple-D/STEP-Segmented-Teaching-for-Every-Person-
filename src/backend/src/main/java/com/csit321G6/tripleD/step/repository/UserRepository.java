package com.csit321G6.tripleD.step.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.csit321G6.tripleD.step.entity.UserEntity;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, String> {
    boolean existsByEmail(String email);
    boolean existsBySchoolId(String schoolId);
    Optional<UserEntity> findByEmail(String email);
    Optional<UserEntity> findBySchoolId(String schoolId);
    Optional<UserEntity> findByEmailOrSchoolId(String email, String schoolId);
}