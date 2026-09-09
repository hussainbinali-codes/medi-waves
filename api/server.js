// Minimal contact-form API — no external dependencies required.
// Run with: node server.js   (defaults to http://localhost:8081)
'use strict';

require('dotenv').config();

const http = require('http');
const { sendContactEmail, sendNewsletterEmail } = require('./mailer');
const {
  addSubscriber,
  getSubscriber,
  listSubscribers,
  addSubmission,
  readSubmissions,
  SUBSCRIBERS_JSON,
  SUBSCRIBERS_CSV,
  SUBMISSIONS_JSON,
  SUBMISSIONS_CSV,
} = require('./storage');

const PORT = process.env.PORT || 8081;

// Allow the site's own dev and prod origins to call this API from the browser.
const ALLOWED_ORIGINS = [
  'http://localhost:8000',
  'http://127.0.0.1:8000',
  'http://localhost:8080',
  'http://127.0.0.1:8080',
  'https://www.medi-waves.com',
  'https://medi-waves.com',
];

function setCors(req, res) {
  const origin = req.headers.origin;
  if (!origin || ALLOWED_ORIGINS.includes(origin) || origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
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

    let submission;
    try {
      submission = addSubmission({
        name,
        email,
        website,
        message,
        ip: req.socket.remoteAddress || '',
      });
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

  // -------------------------------------------------------------
  // POST /api/newsletter (or /api/subscribe) — Join newsletter
  // -------------------------------------------------------------
  if ((url.pathname === '/api/newsletter' || url.pathname === '/api/subscribe') && req.method === 'POST') {
    let body;
    try {
      const raw = await readBody(req, 10 * 1024);
      body = JSON.parse(raw || '{}');
    } catch (err) {
      sendJson(res, 400, { ok: false, error: 'Invalid request body.' });
      return;
    }

    const email = String(body.email || '').trim().toLowerCase().slice(0, 200);

    if (!email) {
      sendJson(res, 422, { ok: false, error: 'Email address is required.' });
      return;
    }
    if (!isValidEmail(email)) {
      sendJson(res, 422, { ok: false, error: 'Please provide a valid email address.' });
      return;
    }

    let result;
    try {
      result = addSubscriber({
        email,
        ip: req.socket.remoteAddress || '',
        source: body.source || 'website_footer',
      });
    } catch (err) {
      console.error('Failed to persist subscriber:', err);
      sendJson(res, 500, { ok: false, error: 'Could not save subscription. Please try again.' });
      return;
    }

    if (!result.isNew) {
      sendJson(res, 200, {
        ok: true,
        alreadySubscribed: true,
        message: 'This email is already subscribed to our newsletter updates.',
        subscriber: result.subscriber,
      });
      return;
    }

    console.log(`[newsletter] New subscriber: ${email}`);

    sendNewsletterEmail({ email }).catch((err) => {
      console.error('[newsletter] Unexpected error while sending notification:', err);
    });

    sendJson(res, 201, {
      ok: true,
      message: 'Thank you for subscribing to our newsletter!',
      id: result.subscriber.id,
      subscriber: result.subscriber,
    });
    return;
  }

  // -------------------------------------------------------------
  // GET /api/newsletter (or /api/subscribers) — Get email details
  // Supports:
  // - /api/newsletter?email=user@example.com -> returns specific subscriber details
  // - /api/newsletter -> returns list of all subscribers & count
  // -------------------------------------------------------------
  if ((url.pathname === '/api/newsletter' || url.pathname === '/api/subscribers') && req.method === 'GET') {
    const queryEmail = url.searchParams.get('email');

    if (queryEmail) {
      const found = getSubscriber(queryEmail);

      if (found) {
        sendJson(res, 200, {
          ok: true,
          found: true,
          subscriber: found,
        });
      } else {
        sendJson(res, 404, {
          ok: false,
          found: false,
          error: `Subscriber with email '${queryEmail}' not found.`,
        });
      }
      return;
    }

    const subscribers = listSubscribers();
    sendJson(res, 200, {
      ok: true,
      total: subscribers.length,
      subscribers,
    });
    return;
  }

  if (url.pathname === '/api/health' && req.method === 'GET') {
    sendJson(res, 200, { ok: true, status: 'up' });
    return;
  }

  sendJson(res, 404, { ok: false, error: 'Not found.' });
});

server.listen(PORT, () => {
  console.log(`Medi Waves API listening on http://localhost:${PORT}`);
  console.log(`Submissions: ${SUBMISSIONS_JSON} & ${SUBMISSIONS_CSV}`);
  console.log(`Subscribers: ${SUBSCRIBERS_JSON} & ${SUBSCRIBERS_CSV}`);
});
