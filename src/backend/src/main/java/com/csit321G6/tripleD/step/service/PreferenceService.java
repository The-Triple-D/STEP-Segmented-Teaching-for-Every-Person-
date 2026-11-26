package com.csit321G6.tripleD.step.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.csit321G6.tripleD.step.entity.PreferenceEntity;
import com.csit321G6.tripleD.step.entity.StudentEntity;
import com.csit321G6.tripleD.step.repository.PreferenceRepository;
import com.csit321G6.tripleD.step.repository.StudentRepository;

import java.util.List;
import java.util.Set;

@Service
public class PreferenceService {

    @Autowired
    private PreferenceRepository preferenceRepository;

    @Autowired
    private StudentRepository studentRepository;

    public List<PreferenceEntity> getAllPreferences() {
        return preferenceRepository.findAll();
    }

    public PreferenceEntity getPreferenceById(String id) {
        return preferenceRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Preference not found with ID: " + id));
    }

    public PreferenceEntity getPreferenceByStudentId(String studentId) {
        if (!studentRepository.existsById(studentId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Student not found with ID: " + studentId);
        }
        return preferenceRepository.findByStudentId(studentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Preferences not configured for student ID: " + studentId));
    }

    public PreferenceEntity createPreference(String studentId, PreferenceEntity preference) {
        StudentEntity student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Student not found with ID: " + studentId));

        if (preferenceRepository.existsByStudentId(studentId)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Preferences already exist for student ID: " + studentId);
        }

        if (preference.getFontSize() == null) preference.setFontSize(1.0);
        if (preference.getLineSpacing() == null) preference.setLineSpacing(1.5);
        if (preference.getHighContrast() == null) preference.setHighContrast(false);
        if (preference.getLowStimulation() == null) preference.setLowStimulation(false);
        if (preference.getPreferredFormat() == null) preference.setPreferredFormat("TEXT");

        validatePreference(preference);
        preference.setStudent(student);
        return preferenceRepository.save(preference);
    }

    @Transactional
    public PreferenceEntity updatePreference(String id, PreferenceEntity details) {
        PreferenceEntity existing = getPreferenceById(id);

        if (details.getFontSize() != null) existing.setFontSize(details.getFontSize());
        if (details.getLineSpacing() != null) existing.setLineSpacing(details.getLineSpacing());
        if (details.getHighContrast() != null) existing.setHighContrast(details.getHighContrast());
        if (details.getLowStimulation() != null) existing.setLowStimulation(details.getLowStimulation());
        if (details.getPreferredFormat() != null) existing.setPreferredFormat(details.getPreferredFormat());

        validatePreference(existing);
        return preferenceRepository.save(existing);
    }

    public void deletePreference(String id) {
        if (!preferenceRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Preference not found with ID: " + id);
        }
        preferenceRepository.deleteById(id);
    }

    private void validatePreference(PreferenceEntity preference) {
        if (preference.getFontSize() == null ||
                !Double.isFinite(preference.getFontSize()) ||
                preference.getFontSize() < 0.85 ||
                preference.getFontSize() > 1.6) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Font size must be between 85% and 160%");
        }

        if (preference.getLineSpacing() == null ||
                !Double.isFinite(preference.getLineSpacing()) ||
                preference.getLineSpacing() <= 0) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Line spacing must be greater than zero");
        }

        if (preference.getPreferredFormat() == null ||
                !Set.of("TEXT", "AUDIO", "TRANSCRIPT", "VISUAL_SUMMARY")
                        .contains(preference.getPreferredFormat())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Invalid preferred format");
        }

        if (preference.getHighContrast() == null ||
                preference.getLowStimulation() == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Accessibility settings cannot be null");
        }
    }
}