package com.csit321G6.tripleD.step.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.csit321G6.tripleD.step.entity.LessonEntity;
import com.csit321G6.tripleD.step.entity.SegmentEntity;
import com.csit321G6.tripleD.step.repository.LessonRepository;
import com.csit321G6.tripleD.step.repository.SegmentRepository;

@Service
public class SegmentService {

    @Autowired
    private SegmentRepository segmentRepository;

    @Autowired
    private LessonRepository lessonRepository;

    public SegmentEntity createSegment(String lessonId, SegmentEntity segment) {
        LessonEntity lesson = lessonRepository.findById(lessonId).orElseThrow(() ->
            new ResponseStatusException(HttpStatus.NOT_FOUND, "Lesson " + lessonId + " does not exist"));
        validate(segment);
        segment.setId(null);
        segment.setLesson(lesson);
        fillLength(segment);
        return segmentRepository.save(segment);
    }

    public List<SegmentEntity> getAllSegments() {
        return segmentRepository.findAll();
    }

    public SegmentEntity getSegmentById(String id) {
        return segmentRepository.findById(id).orElseThrow(() ->
            new ResponseStatusException(HttpStatus.NOT_FOUND, "Segment " + id + " does not exist"));
    }

    public List<SegmentEntity> getSegmentsByLesson(String lessonId) {
        if (!lessonRepository.existsById(lessonId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Lesson " + lessonId + " does not exist");
        }
        return segmentRepository.findByLessonIdOrderByOrderIndexAsc(lessonId);
    }

    public SegmentEntity updateSegment(String id, SegmentEntity details) {
        SegmentEntity segment = getSegmentById(id);
        validate(details);
        segment.setOrderIndex(details.getOrderIndex());
        segment.setText(details.getText());
        segment.setStartTime(details.getStartTime());
        segment.setEndTime(details.getEndTime());
        segment.setWordCount(details.getWordCount());
        segment.setEstimatedMinutes(details.getEstimatedMinutes());
        fillLength(segment);
        return segmentRepository.save(segment);
    }

    public String deleteSegment(String id) {
        getSegmentById(id);
        segmentRepository.deleteById(id);
        return "Segment " + id + " is successfully deleted!";
    }

    private void validate(SegmentEntity segment) {
        if (segment.getOrderIndex() == null || segment.getOrderIndex() < 1) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                "Order index is required and must be 1 or higher");
        }
        if (segment.getText() == null || segment.getText().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Text is required");
        }
        if (segment.getStartTime() != null && segment.getEndTime() != null
                && segment.getEndTime() < segment.getStartTime()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "End time cannot be before start time");
        }
    }

    private void fillLength(SegmentEntity segment) {
        int words = segment.getText().trim().split("\\s+").length;
        if (segment.getWordCount() == null) {
            segment.setWordCount(words);
        }
        if (segment.getEstimatedMinutes() == null) {
            segment.setEstimatedMinutes(Math.max(1, (int) Math.ceil(words / 200.0)));
        }
    }
}