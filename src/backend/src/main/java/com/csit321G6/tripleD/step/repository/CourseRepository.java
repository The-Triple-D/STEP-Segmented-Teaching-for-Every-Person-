package com.csit321G6.tripleD.step.repository;
import org.springframework.data.jpa.repository.JpaRepository;

import com.csit321G6.tripleD.step.entity.CourseEntity;

public interface CourseRepository extends JpaRepository<CourseEntity, String> { }