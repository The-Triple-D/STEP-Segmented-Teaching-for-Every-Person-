package com.csit321G6.tripleD.step.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "lesson_formats")
public class LessonFormatEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne
    @JoinColumn(name = "lesson_id", nullable = false)
    @JsonIgnore
    private LessonEntity lesson;

    private String formatKind;

    @Column(columnDefinition = "TEXT")
    private String content;
    private String fileUrl;


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

    public String getFormatKind() { 
        return formatKind; 
    }
    
    public void setFormatKind(String formatKind) { 
        this.formatKind = formatKind; 
    }

    public String getContent() { 
        return content; 
    }
    
    public void setContent(String content) { 
        this.content = content; 
    }

    public String getFileUrl() { 
        return fileUrl; 
    }
    
    public void setFileUrl(String fileUrl) { 
        this.fileUrl = fileUrl; 
    }
}