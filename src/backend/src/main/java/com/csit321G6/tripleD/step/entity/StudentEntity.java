package com.csit321G6.tripleD.step.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import java.time.LocalDate;

@Entity
@Table(name = "students")
public class StudentEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = false)
    private UserEntity user;

    @Column(name = "current_streak", nullable = false)
    private int currentStreak;

    @Column(name = "last_study_date")
    private LocalDate lastStudyDate;

    public StudentEntity() {}

    public Long getId() { 
        return id; 
    }
    public void setId(Long id) { 
        this.id = id; 
    }

    public UserEntity getUser() { 
        return user; 
    }
    public void setUser(UserEntity user) { 
        this.user = user; 
    }

    public int getCurrentStreak() { 
        return currentStreak; 
    }
    public void setCurrentStreak(int currentStreak) { 
        this.currentStreak = currentStreak; 
    }

    public LocalDate getLastStudyDate() { 
        return lastStudyDate; 
    }
    public void setLastStudyDate(LocalDate lastStudyDate) { 
        this.lastStudyDate = lastStudyDate; 
    }
}