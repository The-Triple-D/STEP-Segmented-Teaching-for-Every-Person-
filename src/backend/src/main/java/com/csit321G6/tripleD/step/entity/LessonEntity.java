package com.csit321G6.tripleD.step.entity;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "lessons")
public class LessonEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne
    @JoinColumn(name = "course_id", nullable = false)
    @JsonIgnore
    private CourseEntity course;

    private String title;

    @Enumerated(EnumType.STRING)
    private LessonStatus status;

    @Enumerated(EnumType.STRING)
    private SourceType sourceType;

    private String sourceUrl;
    private Integer estimatedDuration;

    @OneToMany(mappedBy = "lesson", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<SegmentEntity> segments;

    @OneToMany(mappedBy = "lesson", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<LessonFormatEntity> formats;

    @JsonProperty(value = "courseId", access = JsonProperty.Access.READ_ONLY)
    public String getCourseId() {
        return course == null ? null : course.getId();
    }

    public String getId() { 
        return id; 
    }
    
    public void setId(String id) { 
        this.id = id; 
    }

    public CourseEntity getCourse() { 
        return course; 
    }
    
    public void setCourse(CourseEntity course) { 
        this.course = course; 
    }

    public String getTitle() { 
        return title; 
    }
    
    public void setTitle(String title) { 
        this.title = title; 
    }

    public LessonStatus getStatus() { 
        return status; 
    }
    
    public void setStatus(LessonStatus status) { 
        this.status = status; 
    }

    public SourceType getSourceType() { 
        return sourceType; 
    }
    
    public void setSourceType(SourceType sourceType) { 
        this.sourceType = sourceType; 
    }

    public String getSourceUrl() { 
        return sourceUrl; 
    }
    
    public void setSourceUrl(String sourceUrl) { 
        this.sourceUrl = sourceUrl; 
    }

    public Integer getEstimatedDuration() { 
        return estimatedDuration; 
    }
    
    public void setEstimatedDuration(Integer estimatedDuration) { 
        this.estimatedDuration = estimatedDuration; 
    }

    public List<SegmentEntity> getSegments() { 
        return segments; 
    }
    
    public void setSegments(List<SegmentEntity> segments) { 
        this.segments = segments; 
    }

    public List<LessonFormatEntity> getFormats() { 
        return formats; 
    }
    
    public void setFormats(List<LessonFormatEntity> formats) { 
        this.formats = formats; 
    }
}