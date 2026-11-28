package com.csit321G6.tripleD.step.entity;

import java.time.Instant;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import jakarta.persistence.*;

@Entity
@Table(
    name = "progress",
    uniqueConstraints = @UniqueConstraint(
        name = "uk_progress_student_segment",
        columnNames = {"student_id", "segment_id"}
    )
)
public class ProgressEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "student_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonIgnore
    private StudentEntity student;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "segment_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonIgnore
    private SegmentEntity segment;

    @Column(name = "completed_at", nullable = false, updatable = false)
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private Instant completedAt;

    public ProgressEntity() {}

    @JsonProperty(value = "studentId", access = JsonProperty.Access.READ_ONLY)
    public String getStudentId() {
        return student == null ? null : student.getId();
    }

    @JsonProperty(value = "segmentId", access = JsonProperty.Access.READ_ONLY)
    public String getSegmentId() {
        return segment == null ? null : segment.getId();
    }

    public String getId() { return id; }

    public StudentEntity getStudent() { return student; }
    public void setStudent(StudentEntity student) { this.student = student; }

    public SegmentEntity getSegment() { return segment; }
    public void setSegment(SegmentEntity segment) { this.segment = segment; }

    public Instant getCompletedAt() { return completedAt; }
    public void setCompletedAt(Instant completedAt) { this.completedAt = completedAt; }
}
