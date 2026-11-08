package com.csit321G6.tripleD.step.service;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
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
        Optional<LessonEntity> optionalLesson = lessonRepository.findById(lessonId);
        
        if (optionalLesson.isPresent()) {
            segment.setId(null);
            segment.setLesson(optionalLesson.get());
            return segmentRepository.save(segment);
        } else {
            return null;
        }
    }

    public List<SegmentEntity> getSegmentsByLesson(String lessonId) {
        return segmentRepository.findByLessonIdOrderByOrderIndexAsc(lessonId);
    }

    public SegmentEntity updateSegment(String id, SegmentEntity details) {
        Optional<SegmentEntity> optionalSegment = segmentRepository.findById(id);
        
        if (optionalSegment.isPresent()) {
            SegmentEntity segment = optionalSegment.get();
            segment.setOrderIndex(details.getOrderIndex());
            segment.setText(details.getText());
            segment.setStartTime(details.getStartTime());
            segment.setEndTime(details.getEndTime());
            segment.setWordCount(details.getWordCount());
            segment.setEstimatedMinutes(details.getEstimatedMinutes());
            return segmentRepository.save(segment);
        } else {
            return null;
        }
    }

    public String deleteSegment(String id) {
        if (segmentRepository.existsById(id)) {
            segmentRepository.deleteById(id);
            return "Segment " + id + " is successfully deleted!";
        } else {
            return "Error: Segment " + id + " does not exist!";
        }
    }
}