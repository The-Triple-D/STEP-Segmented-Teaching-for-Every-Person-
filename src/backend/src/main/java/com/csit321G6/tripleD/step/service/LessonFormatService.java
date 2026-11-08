package com.csit321G6.tripleD.step.service;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
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
        Optional<LessonEntity> optionalLesson = lessonRepository.findById(lessonId);
        
        if (optionalLesson.isPresent()) {
            format.setId(null);
            format.setLesson(optionalLesson.get());
            return formatRepository.save(format);
        } else {
            return null;
        }
    }

    public List<LessonFormatEntity> getFormatsByLesson(String lessonId) {
        return formatRepository.findByLessonId(lessonId);
    }

    public LessonFormatEntity updateFormat(String id, LessonFormatEntity details) {
        Optional<LessonFormatEntity> optionalFormat = formatRepository.findById(id);
        
        if (optionalFormat.isPresent()) {
            LessonFormatEntity format = optionalFormat.get();
            format.setFormatKind(details.getFormatKind());
            format.setContent(details.getContent());
            format.setFileUrl(details.getFileUrl());
            return formatRepository.save(format);
        } else {
            return null;
        }
    }

    public String deleteFormat(String id) {
        if (formatRepository.existsById(id)) {
            formatRepository.deleteById(id);
            return "Lesson Format " + id + " is successfully deleted!";
        } else {
            return "Error: Lesson Format " + id + " does not exist!";
        }
    }
}