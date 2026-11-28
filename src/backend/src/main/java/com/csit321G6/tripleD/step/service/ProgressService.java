package com.csit321G6.tripleD.step.service;

import java.time.Instant;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.csit321G6.tripleD.step.entity.ProgressEntity;
import com.csit321G6.tripleD.step.entity.StudentEntity;
import com.csit321G6.tripleD.step.entity.SegmentEntity;
import com.csit321G6.tripleD.step.repository.ProgressRepository;
import com.csit321G6.tripleD.step.repository.StudentRepository;
import com.csit321G6.tripleD.step.repository.SegmentRepository;
import com.csit321G6.tripleD.step.repository.LessonRepository;

import jakarta.persistence.EntityManager;
import jakarta.persistence.LockModeType;
import jakarta.persistence.PersistenceContext;

@Service
public class ProgressService {

    @Autowired
    private ProgressRepository progressRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private SegmentRepository segmentRepository;

    @Autowired
    private LessonRepository lessonRepository;

    @PersistenceContext
    private EntityManager entityManager;

    public record ProgressResponse(
            String id,
            String studentId,
            String segmentId,
            Instant completedAt
    ) {}

    public record LessonProgressResponse(
            String studentId,
            String lessonId,
            long completedSegments,
            long totalSegments,
            double percentage,
            boolean completed
    ) {}

    @Transactional
    public ProgressResponse completeSegment(String studentId, String segmentId) {
        StudentEntity student = entityManager.find(
                StudentEntity.class, studentId, LockModeType.PESSIMISTIC_WRITE);

        if (student == null) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Student not found with ID: " + studentId);
        }

        SegmentEntity segment = segmentRepository.findById(segmentId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Segment not found with ID: " + segmentId));

        ProgressEntity progress = progressRepository
                .findByStudent_IdAndSegment_Id(studentId, segmentId)
                .orElseGet(() -> {
                    ProgressEntity newProgress = new ProgressEntity();
                    newProgress.setStudent(student);
                    newProgress.setSegment(segment);
                    newProgress.setCompletedAt(Instant.now());

                    return progressRepository.save(newProgress);
                });

        return toResponse(progress);
    }

    @Transactional(readOnly = true)
    public List<ProgressResponse> getStudentProgress(String studentId) {
        validateStudent(studentId);

        return progressRepository
                .findByStudent_IdOrderByCompletedAtDesc(studentId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public LessonProgressResponse getLessonProgress(String studentId, String lessonId) {
        validateStudent(studentId);

        if (!lessonRepository.existsById(lessonId)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Lesson not found with ID: " + lessonId);
        }

        long totalSegments = segmentRepository
                .findByLesson_IdOrderByOrderIndexAsc(lessonId).size();

        long completedSegments = progressRepository
                .countByStudent_IdAndSegment_Lesson_Id(studentId, lessonId);

        double percentage = totalSegments == 0
                ? 0.0
                : Math.round((completedSegments * 100.0 / totalSegments) * 100.0) / 100.0;

        boolean completed = totalSegments > 0 && completedSegments == totalSegments;

        return new LessonProgressResponse(
                studentId,
                lessonId,
                completedSegments,
                totalSegments,
                percentage,
                completed
        );
    }

    private void validateStudent(String studentId) {
        if (!studentRepository.existsById(studentId)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Student not found with ID: " + studentId);
        }
    }

    private ProgressResponse toResponse(ProgressEntity progress) {
        return new ProgressResponse(
                progress.getId(),
                progress.getStudentId(),
                progress.getSegmentId(),
                progress.getCompletedAt()
        );
    }
}
