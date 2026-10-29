# STEP-Segmented-Teaching-for-Every-Person-
STEP (Segmented Teaching for Every Person) is a web-based learning platform that works alongside an existing LMS. It turns long lecture videos and text-heavy PDFs into short, accessible micro-lessons with quick check-in questions and calm progress tracking, helping college students who struggle with focus start, keep going, and remember what they learned.

# Pain Point
College students who struggle with attention, including those with ADHD, often lose focus and miss important learning materials because traditional LMS platforms rely on static resources such as text-heavy PDFs and long lecture videos. Without a built-in structure, prompts, or feedback, these formats make it harder to start tasks, sustain attention, and remember what was learned, leading to digital fatigue and incomplete coursework. Interactive tools that could help often lack basic accessibility features such as screen reader compatibility and keyboard navigation, or add distracting, time-pressured elements, so students with ADHD and other disabilities cannot participate fully in learning.

# Users

## Primary Users
College students who find it hard to stay focused on long lectures and text-heavy readings, including students with ADHD and others who struggle with attention. The platform is open to every student, with every feature available to everyone by default.

## Secondary Users
- Instructors who upload lecture videos and PDFs, review the suggested segment break points, write check-in questions, and optionally add text versions, flashcards, and visual summaries.

## Also Served
Students who rely on assistive technology or alternative formats, including:
- Screen reader users
- Keyboard-only users
- Students who depend on captions or transcripts

# Proposed Solution

## How a Lesson Works
Instead of opening a 50-minute lecture or a 40-page PDF and facing it all at once, the student sees a short lesson that tells them how long it will take. Behind the scenes, the system suggests natural break points about every 250 words, and the instructor confirms or adjusts them before publishing. The student watches or reads for a few minutes, answers one quick check-in question, and gets an immediate response before moving on. This rhythm gives attention natural resting points and turns passive viewing into small, repeated moments of recall, which makes it easier to start, to keep going, and to remember what was covered.

## Multiple Formats
Students do not all take in information the same way, and some find audio or dense text hard to process. Lessons can be switched at any moment between listening, reading a short text version, and, where the instructor has provided one, reviewing a visual summary. The student never has to explain why they prefer one format, and nothing in the lesson depends on sound or on any single sense. The content adapts to the learner, not the other way around.

## Calm Progress Tracking
Motivation is supported through quiet visibility of progress. Students see how far they have come, keep a streak going, and collect simple badges for consistency. The design deliberately avoids competition, countdowns, and flashy effects, because for many students with attention difficulties these add pressure and distraction instead of encouragement. Progress feels like a steady, calm sense of momentum.

## Accessible by Design
The interface is designed to align with Web Content Accessibility Guidelines (WCAG) 2.1 Level AA. Students who navigate by keyboard, use screen readers, or rely on captions can complete every activity, including the check-in questions and progress features that interactive tools often leave out. Every feature is available to every student, with no sign-up or approval needed. The result is a learning environment that supports focus and follow-through while keeping inclusion as its foundation.

# Summary of the Functional Requirements

MUST-HAVE

= Semi-Automatic Content Chunking
- The system must let instructors upload lecture videos and PDFs and automatically suggest short segments or cards of about 250 words each, using the transcript for videos and the text for PDFs, breaking at sentence ends.
- Instructors must be able to review and adjust the suggested break points, and each segment must show its estimated length.

= Check-in Questions and Resume
- Every video segment must end with a quick check-in question that gives immediate feedback, and students must be able to resume exactly where they left off.

= Captions and Searchable Transcripts
- The system must display captions for all video content by default and provide a searchable transcript for each video.

= WCAG 2.1 Level AA-Aligned Interface
- The interface must be designed to align with WCAG 2.1 Level AA, including full keyboard navigation, screen reader compatibility, sufficient color contrast, and adjustable font size.

= Automatic Progress Tracking
- The system must also track each student's progress automatically and show it on a simple personal dashboard.


SHOULD-HAVE

= Text-to-Speech and Text Version
- The system should offer text-to-speech and a concise instructor-provided text version of every lesson, so students can switch formats with one click and adjust playback speed.

= Calm Gamified Tracking
- It should include calm gamified tracking, such as streaks, effort-based points, and simple badges, without timed competition or flashing effects.

= Low-Stimulation Setting
- A low-stimulation setting should let students turn off animations and sound effects.

= Saved Display and Format Preferences
- Students should be able to save display and format preferences, such as font, spacing, contrast, and preferred lesson format, so they apply across courses.

= PDF Flashcards and Expandable Details
- PDF-based lessons should also include instructor-created flashcards and expandable details beneath each key-point summary.


NICE-TO-HAVE

= Visual Summaries
- The system could let instructors attach a diagram, mind map, or infographic to each lesson as an alternative to text and audio.

= Instructor Drop-Off Dashboard
- It could offer a simple instructor dashboard showing how many students completed each segment, so instructors know which content to shorten.

= In-App Reminders
- Customizable in-app reminders could encourage students to continue unfinished lessons, with control over timing and frequency.

= Spaced Review Questions
- Short review questions from earlier lessons could resurface over time to strengthen retention.

# Stack
- Frontend: React, HTML, CSS, JavaScript
- Backend: Java, Spring Boot
- Database: [to be decided]
- Transcription: [to be decided]
- PDF text extraction: [to be decided]
- Text-to-speech: [to be decided]
- Accessibility testing: [to be decided]

# Team
- Din, Jake Renzo
- Docena, Shakira Marie
- Gemal, Deanne Romar

# Set up Steps

# Task Board Link
[STEP Task Board] - https://app.clickup.com/1300430000010259/v/s/1300430000048692