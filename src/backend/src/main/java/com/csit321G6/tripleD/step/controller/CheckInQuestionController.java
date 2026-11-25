package com.csit321G6.tripleD.step.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.csit321G6.tripleD.step.entity.CheckInQuestionEntity;
import com.csit321G6.tripleD.step.service.CheckInQuestionService;

@RestController
@RequestMapping("/checkin/api")
@CrossOrigin(origins = "*")
public class CheckInQuestionController {

    private final CheckInQuestionService checkInService;

    public CheckInQuestionController(CheckInQuestionService checkInService) {
        this.checkInService = checkInService;
    }

    @PostMapping("/postNewCheckIn/{segmentId}")
    @ResponseStatus(HttpStatus.CREATED)
    public CheckInQuestionEntity createCheckIn(
            @PathVariable String segmentId,
            @RequestBody CheckInQuestionEntity payload
    ) {
        return checkInService.createCheckIn(segmentId, payload);
    }

    @GetMapping("/getAllCheckIns")
    public List<CheckInQuestionEntity> getAllCheckIns() {
        return checkInService.getAllCheckIns();
    }

    @GetMapping("/getCheckIn/{id}")
    public CheckInQuestionEntity getCheckInById(@PathVariable String id) {
        return checkInService.getCheckInById(id);
    }

    @GetMapping("/getCheckInsBySegment/{segmentId}")
    public List<CheckInQuestionEntity> getCheckInsBySegment(@PathVariable String segmentId) {
        return checkInService.getCheckInsBySegment(segmentId);
    }

    @PutMapping("/putCheckIn")
    public CheckInQuestionEntity updateCheckIn(
            @RequestParam String id,
            @RequestBody CheckInQuestionEntity payload
    ) {
        return checkInService.updateCheckIn(id, payload);
    }

    @DeleteMapping("/deleteCheckIn/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteCheckIn(@PathVariable String id) {
        checkInService.deleteCheckIn(id);
    }
}