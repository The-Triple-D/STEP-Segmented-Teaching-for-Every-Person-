package com.csit321G6.tripleD.step.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
        return lessonRepository.findById(lessonId).map(lesson -> {
            segment.setLesson(lesson);
            return segmentRepository.save(segment);
        }).orElseThrow(() -> new RuntimeException("Lesson not found"));
    }

    public List<SegmentEntity> getSegmentsByLesson(String lessonId) {
        return segmentRepository.findByLessonIdOrderByOrderIndexAsc(lessonId);
    }

    public SegmentEntity updateSegment(String id, SegmentEntity details) {
        return segmentRepository.findById(id).map(segment -> {
            segment.setOrderIndex(details.getOrderIndex());
            segment.setText(details.getText());
            segment.setStartTime(details.getStartTime());
            segment.setEndTime(details.getEndTime());
            segment.setWordCount(details.getWordCount());
            segment.setEstimatedMinutes(details.getEstimatedMinutes());
            return segmentRepository.save(segment);
        }).orElse(null);
    }

    public void deleteSegment(String id) {
        segmentRepository.deleteById(id);
    }
}