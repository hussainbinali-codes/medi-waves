// Minimal contact-form API — no external dependencies required.
// Run with: node server.js   (defaults to http://localhost:8081)
'use strict';

require('dotenv').config();

const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { sendContactEmail } = require('./mailer');

const PORT = process.env.PORT || 8081;
const DATA_FILE = path.join(__dirname, 'submissions.json');

// Allow the site's own dev origins to call this API from the browser.
const ALLOWED_ORIGINS = [
  'http://localhost:8080',
  'http://127.0.0.1:8080',
];

function readSubmissions() {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    return [];
  }
}

function writeSubmissions(list) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(list, null, 2), 'utf8');
}

function setCors(req, res) {
  const origin = req.headers.origin;
  if (ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

function sendJson(res, status, body) {
  const data = JSON.stringify(body);
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(data);
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function readBody(req, maxBytes) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on('data', (chunk) => {
      size += chunk.length;
      if (size > maxBytes) {
        reject(new Error('Payload too large'));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

const server = http.createServer(async (req, res) => {
  setCors(req, res);

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host}`);

  if (url.pathname === '/api/contact' && req.method === 'POST') {
    let body;
    try {
      const raw = await readBody(req, 20 * 1024); // 20KB cap
      body = JSON.parse(raw || '{}');
    } catch (err) {
      sendJson(res, 400, { ok: false, error: 'Invalid request body.' });
      return;
    }

    const name = String(body.name || '').trim().slice(0, 200);
    const email = String(body.email || '').trim().slice(0, 200);
    const website = String(body.website || '').trim().slice(0, 300);
    const message = String(body.message || '').trim().slice(0, 4000);

    if (!name || !email || !message) {
      sendJson(res, 422, { ok: false, error: 'Name, email and message are required.' });
      return;
    }
    if (!isValidEmail(email)) {
      sendJson(res, 422, { ok: false, error: 'Please provide a valid email address.' });
      return;
    }

    const submission = {
      id: crypto.randomUUID(),
      name,
      email,
      website,
      message,
      submittedAt: new Date().toISOString(),
      ip: req.socket.remoteAddress || '',
    };

    try {
      const list = readSubmissions();
      list.push(submission);
      writeSubmissions(list);
    } catch (err) {
      console.error('Failed to persist submission:', err);
      sendJson(res, 500, { ok: false, error: 'Could not save your message. Please try again.' });
      return;
    }

    console.log(`[contact] New message from ${name} <${email}>`);

    // Fire-and-forget: email sending never blocks or fails the API response
    // (the submission is already safely saved above).
    sendContactEmail({ name, email, website, message }).catch((err) => {
      console.error('[contact] Unexpected error while sending email:', err);
    });

    sendJson(res, 200, { ok: true, id: submission.id });
    return;
  }

  if (url.pathname === '/api/contact' && req.method === 'GET') {
    // Simple listing endpoint for reviewing submissions locally (no auth — dev use only).
    sendJson(res, 200, { ok: true, submissions: readSubmissions() });
    return;
  }

  if (url.pathname === '/api/health' && req.method === 'GET') {
    sendJson(res, 200, { ok: true, status: 'up' });
    return;
  }

  sendJson(res, 404, { ok: false, error: 'Not found.' });
});

server.listen(PORT, () => {
  console.log(`Contact API listening on http://localhost:${PORT}`);
  console.log(`Submissions are stored at ${DATA_FILE}`);
});
