package com.csit321G6.tripleD.step.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "instructors")
public class InstructorEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = false)
    private UserEntity user;

    @Column(name = "bio", columnDefinition = "TEXT")
    private String bio;

    @Column(name = "expertise")
    private String expertise;

    public InstructorEntity() {}

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

    public String getBio() { 
        return bio; 
    }
    public void setBio(String bio) { 
        this.bio = bio; 
    }

    public String getExpertise() { 
        return expertise; 
    }
    public void setExpertise(String expertise) { 
        this.expertise = expertise; 
    }
}