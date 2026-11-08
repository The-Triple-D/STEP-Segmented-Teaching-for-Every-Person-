package com.csit321G6.tripleD.step.entity;

import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

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
    private String status;
    private String sourceType;
    private String sourceUrl;
    private Integer estimatedDuration;

    @OneToMany(mappedBy = "lesson", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<SegmentEntity> segments;

    @OneToMany(mappedBy = "lesson", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<LessonFormatEntity> formats;


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

    public String getStatus() { 
        return status; 
    }
    
    public void setStatus(String status) { 
        this.status = status; 
    }

    public String getSourceType() { 
        return sourceType; 
    }
    
    public void setSourceType(String sourceType) { 
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