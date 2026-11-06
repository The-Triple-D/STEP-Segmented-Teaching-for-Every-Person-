package com.csit321G6.tripleD.step.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "lesson_formats")
public class LessonFormatEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne
    @JoinColumn(name = "lesson_id", nullable = false)
    private LessonEntity lesson;

    @Enumerated(EnumType.STRING)
    private FormatKind formatKind;

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

    public FormatKind getFormatKind() { 
        return formatKind; 
    }

    public void setFormatKind(FormatKind formatKind) { 
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