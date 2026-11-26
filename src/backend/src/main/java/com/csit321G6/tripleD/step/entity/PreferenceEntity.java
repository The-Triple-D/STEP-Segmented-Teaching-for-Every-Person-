package com.csit321G6.tripleD.step.entity;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "preferences")
public class PreferenceEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private String id;

    @Column(nullable = false)
    private Double fontSize;

    @Column(nullable = false)
    private Double lineSpacing;

    @Column(nullable = false)
    private Boolean highContrast;

    @Column(nullable = false)
    private Boolean lowStimulation;

    @Column(nullable = false)
    private String preferredFormat;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", referencedColumnName = "id", nullable = false, unique = true)
    @JsonIgnore
    private StudentEntity student;

    public PreferenceEntity() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public Double getFontSize() { return fontSize; }
    public void setFontSize(Double fontSize) { this.fontSize = fontSize; }

    public Double getLineSpacing() { return lineSpacing; }
    public void setLineSpacing(Double lineSpacing) { this.lineSpacing = lineSpacing; }

    public Boolean getHighContrast() { return highContrast; }
    public void setHighContrast(Boolean highContrast) { this.highContrast = highContrast; }

    public Boolean getLowStimulation() { return lowStimulation; }
    public void setLowStimulation(Boolean lowStimulation) { this.lowStimulation = lowStimulation; }

    public String getPreferredFormat() { return preferredFormat; }
    public void setPreferredFormat(String preferredFormat) { this.preferredFormat = preferredFormat; }

    public StudentEntity getStudent() { return student; }
    public void setStudent(StudentEntity student) { this.student = student; }
}