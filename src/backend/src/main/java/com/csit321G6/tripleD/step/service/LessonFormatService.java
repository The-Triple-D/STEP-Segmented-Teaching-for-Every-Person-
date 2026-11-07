package com.csit321G6.tripleD.step.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
        return lessonRepository.findById(lessonId).map(lesson -> {
            format.setLesson(lesson);
            return formatRepository.save(format);
        }).orElseThrow(() -> new RuntimeException("Lesson not found"));
    }

    public List<LessonFormatEntity> getFormatsByLesson(String lessonId) {
        return formatRepository.findByLessonId(lessonId);
    }

    public LessonFormatEntity updateFormat(String id, LessonFormatEntity details) {
        return formatRepository.findById(id).map(format -> {
            format.setFormatKind(details.getFormatKind());
            format.setContent(details.getContent());
            format.setFileUrl(details.getFileUrl());
            return formatRepository.save(format);
        }).orElse(null);
    }

    public void deleteFormat(String id) {
        formatRepository.deleteById(id);
    }
}