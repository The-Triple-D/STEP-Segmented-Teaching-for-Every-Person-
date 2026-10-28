import { createServer } from "node:http";
import { DatabaseSync } from "node:sqlite";
import { randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile, stat, unlink, readdir, rename } from "node:fs/promises";
import { createReadStream } from "node:fs";
import { unzipSync, strFromU8 } from "fflate";
import { XMLParser } from "fast-xml-parser";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(root, "dist");
const dataDir = path.join(root, "data");
const uploadDir = path.join(dataDir, "uploads");
await mkdir(uploadDir, { recursive: true });
const databasePath = path.join(dataDir, "step.sqlite");
const legacyDatabasePath = path.join(dataDir, "little-steps.sqlite");
const dataFiles = new Set(await readdir(dataDir));
if (!dataFiles.has("step.sqlite") && dataFiles.has("little-steps.sqlite")) {
  for (const suffix of ["-wal", "-shm"]) {
    const legacySidecar = `little-steps.sqlite${suffix}`;
    if (dataFiles.has(legacySidecar)) {
      await rename(path.join(dataDir, legacySidecar), `${databasePath}${suffix}`);
    }
  }
  await rename(legacyDatabasePath, databasePath);
}
const database = new DatabaseSync(databasePath);
database.exec(`
  PRAGMA journal_mode = WAL;
  CREATE TABLE IF NOT EXISTS lessons (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    course TEXT NOT NULL,
    kind TEXT NOT NULL,
    asset_url TEXT,
    asset_name TEXT NOT NULL,
    transcript TEXT NOT NULL DEFAULT '',
    segments TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS progress (
    lesson_id TEXT NOT NULL,
    segment_index INTEGER NOT NULL,
    position_seconds REAL NOT NULL DEFAULT 0,
    completed INTEGER NOT NULL DEFAULT 0,
    answer TEXT NOT NULL DEFAULT '',
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (lesson_id, segment_index),
    FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE
  );
`);

const demoSegments = [
  { title: "Encoding", minutes: 5, summary: "How information first enters your memory.", transcript: "Encoding is the process of turning information from your senses into a form your brain can store. Paying attention helps your brain decide what to encode. Connecting new information to something familiar can make it easier to remember.", question: "Which stage of memory involves pulling information back out?", options: ["Encoding", "Storage", "Retrieval", "Forgetting"], answer: "Retrieval", explanation: "Retrieval is how we bring a stored memory back into awareness, like recalling a name during a conversation." },
  { title: "Storage", minutes: 4, summary: "How memories are kept over time.", transcript: "Storage is the process of maintaining information over time. Some memories remain briefly, while others become long-term memories. Revisiting information and connecting it to what you know can help strengthen it.", question: "Which stage keeps information available over time?", options: ["Encoding", "Storage", "Retrieval", "Attention"], answer: "Storage", explanation: "Storage keeps information available after it has been encoded." },
  { title: "Retrieval", minutes: 6, summary: "Finding information when you need it.", transcript: "Retrieval brings stored information back into awareness. Remembering a friend's name or recalling a course concept during an exam are examples of retrieval. Practice recalling an idea can help strengthen your memory of it.", question: "What does retrieval help you do?", options: ["Notice new information", "Keep information over time", "Bring a memory back", "Ignore distractions"], answer: "Bring a memory back", explanation: "Retrieval is the process of bringing stored information back into awareness." }
];
const demo = database.prepare("SELECT id FROM lessons WHERE id = ?").get("demo-memory");
if (!demo) {
  database.prepare("INSERT INTO lessons (id,title,course,kind,asset_name,transcript,segments) VALUES (?,?,?,?,?,?,?)")
    .run("demo-memory", "How Memory Works", "Introduction to Psychology", "demo", "Sample lesson", demoSegments.map(segment => segment.transcript).join("\n\n"), JSON.stringify(demoSegments));
  database.prepare("INSERT INTO progress (lesson_id,segment_index,position_seconds,completed) VALUES (?,?,?,?)")
    .run("demo-memory", 0, 72, 0);
}

function json(response, status, value) {
  response.writeHead(status, { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" });
  response.end(JSON.stringify(value));
}
function safeJson(value, fallback) {
  try { return JSON.parse(value); } catch { return fallback; }
}
function getLessons() {
  return database.prepare("SELECT * FROM lessons ORDER BY created_at DESC, title").all().map(row => ({
    id: row.id,
    title: row.title,
    course: row.course,
    kind: row.kind,
    assetUrl: row.asset_url,
    assetName: row.asset_name,
    transcript: row.transcript,
    needsTranscript: row.kind === "video" && !row.transcript.trim(),
    segments: safeJson(row.segments, [])
  }));
}
function getProgress() {
  return database.prepare("SELECT lesson_id AS lessonId, segment_index AS segmentIndex, position_seconds AS position, completed, answer, updated_at AS updatedAt FROM progress ORDER BY updated_at DESC").all();
}
function normalizeParagraph(text) {
  return text.replace(/\u00a0/g, " ").replace(/[\t ]+/g, " ").replace(/\s+([,.;!?])/g, "$1").trim();
}
function splitWords(text, wordsPerSegment = 180, sourceLabel = "Transcript") {
  if (!text.trim()) return [];
  return splitContentBlocks([{ sourceLabel, text }], wordsPerSegment);
}
function splitContentBlocks(blocks, wordsPerSegment = 180) {
  const segments = [];
  const appendSegment = (paragraphs, heading, sourceLabel) => {
    const sourceText = paragraphs.join("\n").trim();
    if (!sourceText) return;
    const body = paragraphs.filter(paragraph => paragraph !== heading).join(" ").trim() || sourceText;
    const wordCount = sourceText.split(/\s+/).filter(Boolean).length;
    const summary = wordCount < 18 ? sourceText.slice(0, 420) : body.split(/(?<=[.!?])\s+/).slice(0, 2).join(" ").slice(0, 360);
    segments.push({ title: heading || `Key idea ${segments.length + 1}`, sourceLabel, sourceText, minutes: Math.max(2, Math.ceil(wordCount / 35)), summary, transcript: sourceText, question: "What is one idea you want to remember from this section?", options: ["I can explain one key idea", "I want to review one part", "I have a question to explore"], answer: "I can explain one key idea", explanation: "A useful next step is to say the key idea in your own words. You can revisit this section at any time." });
  };
  for (const block of blocks) {
    const paragraphs = block.text.split(/\n+/).map(normalizeParagraph).filter(Boolean);
    let current = [];
    let heading = "";
    let wordCount = 0;
    const flush = () => {
      appendSegment(current, heading, block.sourceLabel);
      current = [];
      heading = "";
      wordCount = 0;
    };
    for (let paragraphIndex = 0; paragraphIndex < paragraphs.length; paragraphIndex++) {
      const paragraph = paragraphs[paragraphIndex];
      const words = paragraph.split(/\s+/).filter(Boolean);
      const nextParagraph = paragraphs[paragraphIndex + 1] || "";
      const nextWordCount = nextParagraph.split(/\s+/).filter(Boolean).length;
      const looksUppercase = paragraph === paragraph.toLocaleUpperCase() && /[A-Z]/.test(paragraph);
      const looksTitleCase = words.length <= 8 && nextWordCount >= 10 && words.every(word => /^[A-Z][A-Za-z0-9’'-]*$/.test(word));
      const isHeading = words.length <= 8 && paragraph.length <= 80 && !/[.!?;:]$/.test(paragraph) && (looksUppercase || looksTitleCase);
      if (isHeading && current.length) flush();
      if (wordCount && wordCount + words.length > wordsPerSegment) flush();
      if (isHeading && !heading) heading = paragraph;
      current.push(paragraph);
      wordCount += words.length;
      if (wordCount >= wordsPerSegment) flush();
    }
    flush();
  }
  return segments;
}
function parseVtt(text) {
  const cues = [];
  for (const block of text.replace(/\r/g, "").split(/\n\s*\n/)) {
    const timing = block.match(/(?:(\d{2}):)?(\d{2}):(\d{2})[.,]\d{3}\s+-->\s+(?:(\d{2}):)?(\d{2}):(\d{2})/);
    if (!timing) continue;
    const start = (Number(timing[1] || 0) * 3600) + (Number(timing[2]) * 60) + Number(timing[3]);
    const end = (Number(timing[4] || 0) * 3600) + (Number(timing[5]) * 60) + Number(timing[6]);
    const timingText = block.match(/(?:(?:\d{2}:)?\d{2}:\d{2}[.,]\d{3})\s+-->\s+(?:(?:\d{2}:)?\d{2}:\d{2}[.,]\d{3})/)?.[0].replace(/,/g, ".");
    const content = timingText ? block.slice(timing.index + timingText.length).replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim() : "";
    if (content && timingText) cues.push({ start, end, content, timingText });
  }
  return cues;
}
function groupVideoTranscript(text) {
  if (!text.trim()) return [];
  const cues = parseVtt(text);
  if (cues.length === 0) return splitWords(text);
  const groups = new Map();
  for (const cue of cues) {
    const group = Math.floor(cue.start / 300);
    if (!groups.has(group)) groups.set(group, []);
    groups.get(group).push(cue);
  }
  return [...groups.entries()].map(([group, lines], index) => {
    const transcript = lines.map(cue => cue.content).join(" ");
    const endSeconds = Math.max(...lines.map(cue => cue.end));
    const captionsVtt = `WEBVTT\n\n${lines.map(cue => `${cue.timingText}\n${cue.content}`).join("\n\n")}`;
    return { title: `Video segment ${index + 1}`, minutes: Math.max(1, Math.ceil((endSeconds - group * 300) / 60)), startSeconds: group * 300, endSeconds, captionsVtt, summary: transcript.split(/(?<=[.!?])\s+/).slice(0, 2).join(" ").slice(0, 260), transcript, question: "What is one idea you want to remember from this section?", options: ["I can explain one key idea", "I want to review one part", "I have a question to explore"], answer: "I can explain one key idea", explanation: "A useful next step is to say the key idea in your own words. You can revisit this section at any time." };
  });
}
async function extractPdfText(bytes) {
  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
  const standardFontDataUrl = new URL("./node_modules/pdfjs-dist/standard_fonts/", import.meta.url).href;
  const pdf = await pdfjs.getDocument({ data: new Uint8Array(bytes), standardFontDataUrl, useWorkerFetch: false, isEvalSupported: false }).promise;
  const pages = [];
  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
    const page = await pdf.getPage(pageNumber);
    const content = await page.getTextContent();
    const lines = [];
    for (const item of content.items) {
      const text = normalizeParagraph(item.str || "");
      if (!text) continue;
      const x = Number(item.transform?.[4] || 0);
      const y = Number(item.transform?.[5] || 0);
      let line = lines.find(entry => Math.abs(entry.y - y) < 2.5);
      if (!line) { line = { y, items: [] }; lines.push(line); }
      line.items.push({ x, width: Number(item.width || 0), height: Number(item.height || 0), text });
    }
    lines.sort((a, b) => b.y - a.y);
    let priorY = null;
    const formattedLines = lines.map(line => {
      line.items.sort((a, b) => a.x - b.x);
      let result = "";
      let right = null;
      for (const item of line.items) {
        if (right !== null && item.x - right > Math.max(1.5, item.height * 0.18) && !result.endsWith(" ")) result += " ";
        result += item.text;
        right = item.x + item.width;
      }
      const gap = priorY === null ? 0 : priorY - line.y;
      priorY = line.y;
      return { text: normalizeParagraph(result), paragraphBreak: gap > 18 };
    });
    let pageText = "";
    formattedLines.forEach((line, index) => {
      if (index && pageText) pageText += line.paragraphBreak ? "\n\n" : "\n";
      pageText += line.text;
    });
    pages.push({ sourceLabel: `PDF page ${pageNumber}`, text: pageText });
  }
  return pages;
}
function extractPptxText(bytes) {
  const archive = unzipSync(new Uint8Array(bytes));
  const slideNames = Object.keys(archive).filter(name => /^ppt\/slides\/slide\d+\.xml$/.test(name)).sort((a, b) => Number(a.match(/slide(\d+)/)[1]) - Number(b.match(/slide(\d+)/)[1]));
  if (!slideNames.length) throw new Error("No readable slides were found in this PowerPoint file.");
  const parser = new XMLParser({ preserveOrder: true, ignoreAttributes: true });
  const collectText = node => {
    if (Array.isArray(node)) return node.map(collectText).join("");
    if (!node || typeof node !== "object") return "";
    return Object.entries(node).map(([key, value]) => key === "#text" ? String(value) : collectText(value)).join("");
  };
  const collectParagraphs = (node, output) => {
    if (Array.isArray(node)) { node.forEach(child => collectParagraphs(child, output)); return; }
    if (!node || typeof node !== "object") return;
    for (const [key, value] of Object.entries(node)) {
      if (key.endsWith(":p") && Array.isArray(value)) {
        const paragraph = normalizeParagraph(collectText(value));
        if (paragraph) output.push(paragraph);
      } else {
        collectParagraphs(value, output);
      }
    }
  };
  return slideNames.map((name, index) => {
    const paragraphs = [];
    collectParagraphs(parser.parse(strFromU8(archive[name])), paragraphs);
    return { sourceLabel: `Slide ${index + 1}`, text: paragraphs.join("\n") };
  }).filter(slide => slide.text);
}
async function readRequestJson(request) {
  const chunks = [];
  for await (const chunk of request) chunks.push(chunk);
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}
async function handleApi(request, response, url) {
  if (request.method === "GET" && url.pathname === "/api/health") return json(response, 200, { ok: true, storage: "sqlite" });
  if (request.method === "GET" && url.pathname === "/api/state") return json(response, 200, { lessons: getLessons(), progress: getProgress() });
  if (request.method === "GET" && url.pathname.startsWith("/api/lessons/")) {
    const id = decodeURIComponent(url.pathname.slice("/api/lessons/".length));
    const lesson = getLessons().find(item => item.id === id);
    return lesson ? json(response, 200, lesson) : json(response, 404, { error: "Lesson not found." });
  }
  if (request.method === "PUT" && url.pathname.startsWith("/api/lessons/")) {
    const id = decodeURIComponent(url.pathname.slice("/api/lessons/".length));
    const existing = database.prepare("SELECT segments FROM lessons WHERE id = ?").get(id);
    if (!existing) return json(response, 404, { error: "Lesson not found." });
    const body = await readRequestJson(request);
    if (typeof body.title !== "string" || !body.title.trim() || !Array.isArray(body.segments) || body.segments.length < 1 || body.segments.length > 100) return json(response, 400, { error: "Add a lesson title and at least one segment." });
    const previous = safeJson(existing.segments, []);
    const segments = body.segments.map((segment, index) => ({
      ...previous[index],
      title: String(segment.title || `Segment ${index + 1}`).trim().slice(0, 120),
      minutes: Math.max(1, Math.min(120, Number(segment.minutes) || 5)),
      startSeconds: segment.startSeconds === "" || segment.startSeconds == null ? previous[index]?.startSeconds ?? null : Math.max(0, Number(segment.startSeconds) || 0),
      endSeconds: segment.endSeconds === "" || segment.endSeconds == null ? previous[index]?.endSeconds ?? null : Math.max(0, Number(segment.endSeconds) || 0),
      question: String(segment.question || "What is one idea you want to remember?").trim().slice(0, 500)
    }));
    database.prepare("UPDATE lessons SET title=?,course=?,segments=? WHERE id=?").run(body.title.trim().slice(0, 120), String(body.course || "Introduction to Psychology").trim().slice(0, 120), JSON.stringify(segments), id);
    return json(response, 200, getLessons().find(lesson => lesson.id === id));
  }
  if (request.method === "POST" && url.pathname.startsWith("/api/lessons/") && url.pathname.endsWith("/suggestions")) {
    const id = decodeURIComponent(url.pathname.slice("/api/lessons/".length, -"/suggestions".length));
    const existing = database.prepare("SELECT kind,asset_url FROM lessons WHERE id=?").get(id);
    if (!existing) return json(response, 404, { error: "Lesson not found." });
    if (existing.kind === "pdf" || existing.kind === "pptx") {
      const uploadedPath = path.join(uploadDir, path.basename(existing.asset_url || ""));
      let sourceBlocks;
      try {
        const bytes = await readFile(uploadedPath);
        sourceBlocks = existing.kind === "pdf" ? await extractPdfText(bytes) : extractPptxText(bytes);
      } catch (error) {
        return json(response, 422, { error: `The saved document could not be extracted: ${error.message}` });
      }
      const transcript = sourceBlocks.map(block => block.text).filter(Boolean).join("\n\n");
      const segments = splitContentBlocks(sourceBlocks, 180);
      if (!segments.length) return json(response, 422, { error: "No readable source text was found in the saved document." });
      database.prepare("UPDATE lessons SET transcript=?,segments=? WHERE id=?").run(transcript, JSON.stringify(segments), id);
      return json(response, 200, getLessons().find(lesson => lesson.id === id));
    }
    if (existing.kind !== "video") return json(response, 400, { error: "Suggestions are not available for this lesson type." });
    const body = await readRequestJson(request);
    const transcript = String(body.transcript || "").trim();
    if (!transcript) return json(response, 400, { error: "Add captions or paste a transcript first." });
    const segments = groupVideoTranscript(transcript);
    if (!segments.length) return json(response, 422, { error: "We could not find transcript text to make suggestions." });
    database.prepare("UPDATE lessons SET transcript=?,segments=? WHERE id=?").run(transcript, JSON.stringify(segments), id);
    return json(response, 200, { ...getLessons().find(lesson => lesson.id === id), needsTranscript: false });
  }
  if (request.method === "DELETE" && url.pathname.startsWith("/api/lessons/")) {
    const id = decodeURIComponent(url.pathname.slice("/api/lessons/".length));
    const lesson = database.prepare("SELECT asset_url FROM lessons WHERE id=? AND id<>?").get(id, "demo-memory");
    if (!lesson) return json(response, 404, { error: "Lesson not found." });
    database.prepare("DELETE FROM progress WHERE lesson_id=?").run(id);
    database.prepare("DELETE FROM lessons WHERE id=?").run(id);
    if (lesson.asset_url?.startsWith("/uploads/")) await unlink(path.join(uploadDir, path.basename(lesson.asset_url))).catch(() => {});
    return json(response, 200, { ok: true });
  }
  if (request.method === "POST" && url.pathname === "/api/uploads") {
    const form = await new Request(`http://${request.headers.host}/api/uploads`, { method: "POST", headers: request.headers, body: request, duplex: "half" }).formData();
    const file = form.get("file");
    if (!file || typeof file.arrayBuffer !== "function" || !file.name) return json(response, 400, { error: "Choose a video, PDF, or PowerPoint file first." });
    if (file.size > 100 * 1024 * 1024) return json(response, 413, { error: "Files must be smaller than 100 MB." });
    const extension = path.extname(file.name).toLowerCase();
    const isPdf = extension === ".pdf" || file.type === "application/pdf";
    const isPptx = extension === ".pptx" || file.type === "application/vnd.openxmlformats-officedocument.presentationml.presentation";
    const isVideo = [".mp4", ".webm", ".mov", ".m4v"].includes(extension) || file.type.startsWith("video/");
    if (!isPdf && !isPptx && !isVideo) return json(response, 415, { error: "Use a PDF, PPTX, or video file (MP4, WebM, MOV)." });
    const id = randomUUID();
    const storedName = `${id}${extension || (isPdf ? ".pdf" : isPptx ? ".pptx" : ".mp4")}`;
    const bytes = Buffer.from(await file.arrayBuffer());
    const uploadedPath = path.join(uploadDir, storedName);
    await writeFile(uploadedPath, bytes);
    let transcript = String(form.get("transcript") || "").trim();
    const captionFile = form.get("captions");
    if (captionFile && typeof captionFile.text === "function" && captionFile.size) transcript = await captionFile.text();
    let sourceBlocks = [];
    if (isPdf || isPptx) {
      try {
        sourceBlocks = isPdf ? await extractPdfText(bytes) : extractPptxText(bytes);
        transcript = sourceBlocks.map(block => block.text).filter(Boolean).join("\n\n");
        if (!transcript.trim()) throw new Error("No selectable text was found. This document may contain scanned images; run OCR or add text manually.");
      }
      catch (error) { await unlink(uploadedPath).catch(() => {}); throw error; }
    }
    const title = String(form.get("title") || path.basename(file.name, extension)).trim().slice(0, 120) || "New lesson";
    const course = String(form.get("course") || "Introduction to Psychology").trim().slice(0, 120);
    const needsTranscript = isVideo && !transcript;
    const segments = isPdf || isPptx ? splitContentBlocks(sourceBlocks, 180) : groupVideoTranscript(transcript);
    if (segments.length === 0) segments.push({ title: needsTranscript ? "Transcript needed" : "Key idea 1", minutes: 5, summary: needsTranscript ? "Add captions or a transcript to suggest segments and make this video searchable." : "A short lesson segment.", transcript: "", question: "What is one idea you want to remember from this section?", options: ["I can explain one key idea", "I want to review one part", "I have a question to explore"], answer: "I can explain one key idea", explanation: "A useful next step is to say the key idea in your own words. You can revisit this section at any time." });
    database.prepare("INSERT INTO lessons (id,title,course,kind,asset_url,asset_name,transcript,segments) VALUES (?,?,?,?,?,?,?,?)")
      .run(id, title, course, isPptx ? "pptx" : isPdf ? "pdf" : "video", `/uploads/${storedName}`, file.name, transcript, JSON.stringify(segments));
    return json(response, 201, { id, title, course, kind: isPptx ? "pptx" : isPdf ? "pdf" : "video", assetUrl: `/uploads/${storedName}`, assetName: file.name, transcript, segments, needsTranscript });
  }
  if (request.method === "POST" && url.pathname === "/api/progress") {
    const body = await readRequestJson(request);
    const lesson = database.prepare("SELECT id,segments FROM lessons WHERE id = ?").get(String(body.lessonId || ""));
    if (!lesson) return json(response, 404, { error: "Lesson not found." });
    const segments = safeJson(lesson.segments, []);
    const segmentIndex = Math.max(0, Math.min(segments.length - 1, Number(body.segmentIndex) || 0));
    database.prepare(`INSERT INTO progress (lesson_id,segment_index,position_seconds,completed,answer,updated_at) VALUES (?,?,?,?,?,CURRENT_TIMESTAMP)
      ON CONFLICT(lesson_id,segment_index) DO UPDATE SET position_seconds=excluded.position_seconds,completed=MAX(progress.completed,excluded.completed),answer=CASE WHEN excluded.answer='' THEN progress.answer ELSE excluded.answer END,updated_at=CURRENT_TIMESTAMP`)
      .run(lesson.id, segmentIndex, Math.max(0, Number(body.position) || 0), body.completed ? 1 : 0, String(body.answer || ""));
    return json(response, 200, { ok: true });
  }
  return json(response, 404, { error: "API route not found." });
}

const mimeTypes = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8", ".json": "application/json; charset=utf-8", ".svg": "image/svg+xml", ".pdf": "application/pdf", ".mp4": "video/mp4", ".webm": "video/webm", ".mov": "video/quicktime", ".m4v": "video/x-m4v" };
async function serveStatic(request, response, pathname) {
  const base = pathname.startsWith("/uploads/") ? uploadDir : publicDir;
  const relative = pathname.startsWith("/uploads/") ? pathname.slice("/uploads/".length) : pathname === "/" ? "index.html" : pathname.slice(1);
  const filePath = path.resolve(base, relative);
  if (!filePath.startsWith(`${path.resolve(base)}${path.sep}`)) return json(response, 403, { error: "Forbidden." });
  try {
    const fileStat = await stat(filePath);
    if (!fileStat.isFile()) return json(response, 404, { error: "Not found." });
    const contentType = mimeTypes[path.extname(filePath).toLowerCase()] || "application/octet-stream";
    const range = request.headers.range;
    if (base === uploadDir && range) {
      const match = range.match(/bytes=(\d*)-(\d*)/);
      if (!match) { response.writeHead(416, { "content-range": `bytes */${fileStat.size}` }); return response.end(); }
      const start = match[1] ? Number(match[1]) : Math.max(0, fileStat.size - Number(match[2]));
      const end = match[2] && match[1] ? Math.min(Number(match[2]), fileStat.size - 1) : fileStat.size - 1;
      if (start > end || start >= fileStat.size) { response.writeHead(416, { "content-range": `bytes */${fileStat.size}` }); return response.end(); }
      response.writeHead(206, { "content-type": contentType, "content-range": `bytes ${start}-${end}/${fileStat.size}`, "accept-ranges": "bytes", "content-length": end - start + 1, "x-content-type-options": "nosniff" });
      return createReadStream(filePath, { start, end }).pipe(response);
    }
    response.writeHead(200, { "content-type": contentType, "content-length": fileStat.size, "accept-ranges": base === uploadDir ? "bytes" : "none", "x-content-type-options": "nosniff" });
    if (base === uploadDir) return createReadStream(filePath).pipe(response);
    response.end(await readFile(filePath));
  } catch {
    json(response, 404, { error: "Not found." });
  }
}

const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url, `http://${request.headers.host || "127.0.0.1"}`);
    if (url.pathname.startsWith("/api/")) return await handleApi(request, response, url);
    await serveStatic(request, response, decodeURIComponent(url.pathname));
  } catch (error) {
    console.error(error);
    if (!response.headersSent) json(response, 500, { error: error.message || "The request could not be completed." });
    else response.destroy();
  }
});
const port = Number(process.env.PORT || 4173);
server.listen(port, "127.0.0.1", () => console.log(`STEP is running at http://127.0.0.1:${port}`));
