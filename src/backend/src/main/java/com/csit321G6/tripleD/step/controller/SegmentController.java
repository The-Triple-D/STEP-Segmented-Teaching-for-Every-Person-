package com.csit321G6.tripleD.step.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.csit321G6.tripleD.step.entity.SegmentEntity;
import com.csit321G6.tripleD.step.service.SegmentService;

@RestController
@RequestMapping("/segment/api")
@CrossOrigin(origins = "*")
public class SegmentController {

    @Autowired
    SegmentService sserv;

    @PostMapping("/postNewSegment/{lessonId}")
    public SegmentEntity postSegment(@PathVariable String lessonId, @RequestBody SegmentEntity segment) {
        return sserv.createSegment(lessonId, segment);
    }

    @GetMapping("/getSegmentsByLesson/{lessonId}")
    public List<SegmentEntity> getSegmentsByLesson(@PathVariable String lessonId) {
        return sserv.getSegmentsByLesson(lessonId);
    }

    @PutMapping("/putSegment")
    public SegmentEntity putSegment(@RequestParam String id, @RequestBody SegmentEntity newSegmentDetails) {
        return sserv.updateSegment(id, newSegmentDetails);
    }

    @DeleteMapping("/deleteSegment/{id}")
    public String deleteSegment(@PathVariable String id) {
        return sserv.deleteSegment(id);
    }
}