package com.csit321G6.tripleD.step.service;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.csit321G6.tripleD.step.entity.CheckInQuestionEntity;
import com.csit321G6.tripleD.step.entity.SegmentEntity;
import com.csit321G6.tripleD.step.repository.CheckInQuestionRepository;
import com.csit321G6.tripleD.step.repository.SegmentRepository;

@Service
public class CheckInQuestionService {

    private final CheckInQuestionRepository checkInRepository;
    private final SegmentRepository segmentRepository;

    public CheckInQuestionService(
            CheckInQuestionRepository checkInRepository,
            SegmentRepository segmentRepository
    ) {
        this.checkInRepository = checkInRepository;
        this.segmentRepository = segmentRepository;
    }

    public CheckInQuestionEntity createCheckIn(String segmentId, CheckInQuestionEntity payload) {
        validatePayload(payload);

        SegmentEntity segment = segmentRepository.findById(segmentId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Segment not found with id: " + segmentId));

        CheckInQuestionEntity question = new CheckInQuestionEntity();
        question.setSegment(segment);
        applyFields(question, payload);
        return checkInRepository.save(question);
    }

    public List<CheckInQuestionEntity> getAllCheckIns() {
        return checkInRepository.findAll();
    }

    public CheckInQuestionEntity getCheckInById(String id) {
        return checkInRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Check-in question not found with id: " + id));
    }

    public List<CheckInQuestionEntity> getCheckInsBySegment(String segmentId) {
        if (!segmentRepository.existsById(segmentId)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Segment not found with id: " + segmentId);
        }
        return checkInRepository.findBySegment_Id(segmentId);
    }

    public CheckInQuestionEntity updateCheckIn(String id, CheckInQuestionEntity payload) {
        validatePayload(payload);

        CheckInQuestionEntity existing = getCheckInById(id);
        applyFields(existing, payload);
        return checkInRepository.save(existing);
    }

    public void deleteCheckIn(String id) {
        CheckInQuestionEntity existing = getCheckInById(id);
        checkInRepository.delete(existing);
    }

    private void applyFields(CheckInQuestionEntity target, CheckInQuestionEntity source) {
        target.setQuestionText(source.getQuestionText().trim());
        target.setOptionA(source.getOptionA().trim());
        target.setOptionB(source.getOptionB().trim());
        target.setOptionC(blankToNull(source.getOptionC()));
        target.setOptionD(blankToNull(source.getOptionD()));
        target.setCorrectAnswer(source.getCorrectAnswer().trim());
        target.setExplanation(blankToNull(source.getExplanation()));
    }

    private void validatePayload(CheckInQuestionEntity payload) {
        if (payload == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Request body is required.");
        }
        if (isBlank(payload.getQuestionText())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "questionText is required.");
        }
        if (isBlank(payload.getOptionA()) || isBlank(payload.getOptionB())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "optionA and optionB are required.");
        }
        if (isBlank(payload.getCorrectAnswer())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "correctAnswer is required.");
        }
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }

    private String blankToNull(String value) {
        if (value == null || value.trim().isEmpty()) {
            return null;
        }
        return value.trim();
    }
}