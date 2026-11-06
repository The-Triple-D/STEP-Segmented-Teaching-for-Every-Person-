package com.csit321G6.tripleD.step.entity;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.validation.constraints.NotBlank;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "courses")
public class CourseEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id; 
    private String instructorId; // String muna
    @NotBlank(message = "Title is required")
    private String title;
    private String description;

    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<LessonEntity> lessons;


    public String getId() { 
        return id; 
    }

    public void setId(String id) { 
        this.id = id; 
    }

    public String getInstructorId() { 
        return instructorId; 
    }

    public void setInstructorId(String instructorId) { 
        this.instructorId = instructorId; 
    }

    public String getTitle() { 
        return title; 
    }

    public void setTitle(String title) { 
        this.title = title; 
    }

    public String getDescription() {
        return description; 
    }

    public void setDescription(String description) { 
        this.description = description; 
    }

    public List<LessonEntity> getLessons() { 
        return lessons; 
    }

    public void setLessons(List<LessonEntity> lessons) { 
        this.lessons = lessons; 
    }
}