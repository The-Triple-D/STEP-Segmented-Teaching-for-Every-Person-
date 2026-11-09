package com.csit321G6.tripleD.step.entity;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;

@Entity
@Table(name = "students")
public class StudentEntity {

    @Id
    private String id; // the school ID, supplied by the client

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    @JsonIgnore
    private UserEntity user;

    @Column(name = "current_streak", nullable = false)
    private int currentStreak;

    @Column(name = "last_study_date")
    private LocalDate lastStudyDate;

    public StudentEntity() {}

    @JsonProperty(value = "userId", access = JsonProperty.Access.READ_ONLY)
    public String getUserId() { return user == null ? null : user.getId(); }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public UserEntity getUser() { return user; }
    public void setUser(UserEntity user) { this.user = user; }
    public int getCurrentStreak() { return currentStreak; }
    public void setCurrentStreak(int currentStreak) { this.currentStreak = currentStreak; }
    public LocalDate getLastStudyDate() { return lastStudyDate; }
    public void setLastStudyDate(LocalDate lastStudyDate) { this.lastStudyDate = lastStudyDate; }
}