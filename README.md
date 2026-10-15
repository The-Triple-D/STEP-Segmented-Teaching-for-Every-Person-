# STEP: Segmented Teaching for Every Person

STEP is a web-based learning platform, designed to work alongside an existing LMS, that transforms traditional course delivery into a bite-sized, accessible learning experience designed to boost student focus and memory retention. Lengthy lectures and dense PDFs are broken into short modules at natural break points, which the system suggests and the instructor confirms. Instead of passive viewing, students get regular moments of active recall through check-in questions with immediate feedback. Students can switch between audio, text, and visual formats at any moment to suit their learning preferences, without needing a formal accommodation request. Motivation is supported through quiet progress tracking, streaks, and badges, with no countdown timers or public competition. Built with universal design at its core, the platform is designed to align with WCAG 2.1 Level AA and to work with assistive technologies such as screen readers and keyboard navigation from the start.

**Task board:** https://trello.com/invite/b/6ac7175c0cc818dbfae29378/ATTIca4fa497d5d30591d5e171c85465052904AAD33A/step-segmented-teaching-for-every-person

## Problem

Traditional LMS courses rely on static, text-heavy PDFs and long lecture videos. This causes lost focus, digital fatigue, and poor retention. Interactive tools that could help often lack screen reader and keyboard support, or add time pressure and distraction, so students with disabilities and learning differences cannot take part fully.

## Users

- **Students** (primary): college students who struggle to stay focused, including students with ADHD. Every feature is available to every student, with no diagnosis or accommodation request.
- **Instructors:** turn existing videos and PDFs into short lessons, write check-in questions, and see where students drop off.

## Features

**Must-have (MVP)**
- Semi-automatic content chunking: suggests segments of about 250 words at sentence breaks, which instructors adjust and confirm
- Check-in questions with immediate feedback, and resuming from the exact place
- Captions by default and searchable transcripts
- WCAG 2.1 AA-aligned interface with keyboard navigation and screen reader support
- Automatic progress tracking and a personal dashboard

**Should-have**
- Text-to-speech, instructor-written text versions, and adjustable playback speed
- Calm gamification: streaks, effort points, and simple badges
- Low-stimulation mode
- Saved display and format preferences across all courses
- PDF flashcards and expandable "read more" sections

**Nice-to-have**
- Visual summaries (diagrams, mind maps, infographics)
- Instructor drop-off dashboard
- In-app reminders under the student's control
- Spaced review questions

Full details, user stories, and acceptance criteria are in [`docs/requirements.md`](docs/requirements.md).

## Tech Stack

| Area | Choice |
|---|---|
| Service layer | Java 17 or newer |
| Data | In-memory repositories now, relational database later |
| Web interface | To be confirmed |
| Accessibility checks | Lighthouse, axe, keyboard-only walkthrough |
| Collaboration | GitHub and Trello or ClickUp |

See [`docs/architecture.md`](docs/architecture.md) for the data model, service classes, and design decisions.

## Team

Team of three. Roles, module ownership, and the review rotation are in [`docs/team-roles.md`](docs/team-roles.md).

| Member | GitHub |
|---|---|
| [Full name] | [@username] |
| [Full name] | [@username] |
| [Full name] | [@username] |
