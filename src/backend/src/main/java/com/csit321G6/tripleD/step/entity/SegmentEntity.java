package com.csit321G6.tripleD.step.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "segments")
public class SegmentEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne
    @JoinColumn(name = "lesson_id", nullable = false)
    @JsonIgnore
    private LessonEntity lesson;

    private Integer orderIndex;
    
    @Column(columnDefinition = "TEXT")
    private String text;
    
    private Double startTime;
    private Double endTime;
    private Integer wordCount; 
    private Integer estimatedMinutes;

    public String getId() { 
        return id; 
    }
    
    public void setId(String id) { 
        this.id = id; 
    }

    public LessonEntity getLesson() { 
        return lesson; 
    }
    
    public void setLesson(LessonEntity lesson) { 
        this.lesson = lesson; 
    }

    public Integer getOrderIndex() { 
        return orderIndex; 
    }
    
    public void setOrderIndex(Integer orderIndex) { 
        this.orderIndex = orderIndex; 
    }

    public String getText() { 
        return text; 
    }
    
    public void setText(String text) { 
        this.text = text; 
    }

    public Double getStartTime() { 
        return startTime; 
    }
    
    public void setStartTime(Double startTime) { 
        this.startTime = startTime; 
    }

    public Double getEndTime() { 
        return endTime; 
    }
    
    public void setEndTime(Double endTime) { 
        this.endTime = endTime; 
    }

    public Integer getWordCount() { 
        return wordCount; 
    }
    
    public void setWordCount(Integer wordCount) { 
        this.wordCount = wordCount; 
    }

    public Integer getEstimatedMinutes() { 
        return estimatedMinutes; 
    }
    
    public void setEstimatedMinutes(Integer estimatedMinutes) { 
        this.estimatedMinutes = estimatedMinutes; 
    }
}