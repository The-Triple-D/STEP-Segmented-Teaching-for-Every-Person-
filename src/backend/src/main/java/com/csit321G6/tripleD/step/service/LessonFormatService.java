package com.csit321G6.tripleD.step.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.csit321G6.tripleD.step.entity.LessonEntity;
import com.csit321G6.tripleD.step.entity.LessonFormatEntity;
import com.csit321G6.tripleD.step.repository.LessonFormatRepository;
import com.csit321G6.tripleD.step.repository.LessonRepository;

@Service
public class LessonFormatService {

    @Autowired
    private LessonFormatRepository formatRepository;

    @Autowired
    private LessonRepository lessonRepository;

    public LessonFormatEntity createFormat(String lessonId, LessonFormatEntity format) {
        LessonEntity lesson = lessonRepository.findById(lessonId).orElseThrow(() ->
            new ResponseStatusException(HttpStatus.NOT_FOUND, "Lesson " + lessonId + " does not exist"));
        validate(format);
        format.setId(null);
        format.setLesson(lesson);
        return formatRepository.save(format);
    }

    public List<LessonFormatEntity> getAllFormats() {
        return formatRepository.findAll();
    }

    public LessonFormatEntity getFormatById(String id) {
        return formatRepository.findById(id).orElseThrow(() ->
            new ResponseStatusException(HttpStatus.NOT_FOUND, "Lesson format " + id + " does not exist"));
    }

    public List<LessonFormatEntity> getFormatsByLesson(String lessonId) {
        if (!lessonRepository.existsById(lessonId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Lesson " + lessonId + " does not exist");
        }
        return formatRepository.findByLesson_Id(lessonId);
    }

    public LessonFormatEntity updateFormat(String id, LessonFormatEntity details) {
        LessonFormatEntity format = getFormatById(id);
        validate(details);
        format.setFormatKind(details.getFormatKind());
        format.setContent(details.getContent());
        format.setFileUrl(details.getFileUrl());
        return formatRepository.save(format);
    }

    public String deleteFormat(String id) {
        getFormatById(id);
        formatRepository.deleteById(id);
        return "Lesson Format " + id + " is successfully deleted!";
    }

    private void validate(LessonFormatEntity format) {
        if (format.getFormatKind() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                "Format kind is required (TRANSCRIPT, TEXT or VISUAL_SUMMARY)");
        }
    }
}