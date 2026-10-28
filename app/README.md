# STEP (Segmented Teaching for Every Person)

A local, single-student learning app with a React front end, Node.js API, and SQLite storage. Uploaded files and the database stay on this device.

## Run

1. Install Node.js 24 or later.
2. From this folder, run `npm install` once.
3. Run `npm start`. This builds the JSX app and starts the local server.
4. Open `http://127.0.0.1:4173`.

The database is stored at `data/step.sqlite`; uploaded source files are stored under `data/uploads/`. On first startup after this change, an existing `data/little-steps.sqlite` and its SQLite journal files are renamed automatically, preserving lessons and student progress.

## Front-end structure

The front end is built with React and JSX; it has no legacy HTML-template or page-script mode. `src/main.jsx` mounts the app, `src/App.jsx` owns shared navigation, lesson data, progress, preferences, and upload state, and each screen is a component under `src/components/views/`. Shared navigation and the app shell are separate components under `src/components/`, with styling in `src/styles.css`.

To recreate this structure, make one JSX component per screen, pass shared state and event handlers down as props, and keep each screen's markup in that component. Use React state for controls and call the existing JSON API for saved lessons and progress. Keep video lifecycle events on the video element, then test navigation, check-ins, playback resume, study cards, preferences, and content upload after each change.

## Sprint 1: video segment check-ins

When a video reaches its configured segment end time (or the video ends), playback pauses and opens that segment's check-in. Choose an answer and select **Check answer** to see feedback based on that segment immediately; the answer and completion are saved locally.

To try it, open a video lesson, edit its segment end time under **Upload content**, save the changes, and play through to that time. The built-in sample player can also be tested by moving its progress slider to the end.

## Sprint 2: resume video playback

Video position is saved when playback pauses, after seeking, when leaving the lesson, and when the page is hidden or closed. When reopening the lesson, the player restores the saved timestamp after video metadata loads. Progress writes are queued to prevent an older periodic save from overwriting a newer position.

To test it, play an uploaded video, pause at a known timestamp, leave the lesson, reopen it, and verify that playback returns to the saved timestamp. Seeking to a different timestamp should also update the resume point.

## Content processing

PDFs and PPTX files are text-extracted locally, kept in page/slide order, and split into short reading segments. The review editor shows each card's source text so its suggested title and question can be checked against the material. Upload success names the course location and jumps to review. Videos are stored and playable in the lesson player. For video segment suggestions and captions, upload a WebVTT/SRT caption file or paste a transcript before upload. If the video is already uploaded, edit its segments, add transcript text, and choose **Generate segment suggestions**. The app does not perform speech recognition; automatic transcription of arbitrary video needs a configured speech-to-text engine or service.
