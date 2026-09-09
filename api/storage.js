// Storage module for Medi Waves API
// Handles atomic JSON persistence and dual-write CSV exports (Excel compatible).
'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const SUBSCRIBERS_JSON = path.join(__dirname, 'subscribers.json');
const SUBSCRIBERS_CSV = path.join(__dirname, 'subscribers.csv');
const SUBMISSIONS_JSON = path.join(__dirname, 'submissions.json');
const SUBMISSIONS_CSV = path.join(__dirname, 'submissions.csv');

/**
 * Safely writes data to a file atomically using a temporary file.
 * Prevents file corruption during unexpected crashes or restarts.
 */
function atomicWriteFileSync(filePath, content) {
  const tempPath = `${filePath}.${crypto.randomBytes(6).toString('hex')}.tmp`;
  fs.writeFileSync(tempPath, content, 'utf8');
  fs.renameSync(tempPath, filePath);
}

/**
 * Escapes a field for CSV format.
 */
function escapeCsvField(val) {
  if (val === null || val === undefined) return '""';
  const str = String(val).replace(/"/g, '""');
  return `"${str}"`;
}

// ============================================================================
// SUBSCRIBER STORAGE METHODS
// ============================================================================

/**
 * Reads all subscribers from subscribers.json.
 */
function readSubscribers() {
  try {
    if (!fs.existsSync(SUBSCRIBERS_JSON)) {
      atomicWriteFileSync(SUBSCRIBERS_JSON, '[]');
      return [];
    }
    const raw = fs.readFileSync(SUBSCRIBERS_JSON, 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('[storage] Error reading subscribers.json:', err.message);
    return [];
  }
}

/**
 * Appends a subscriber to subscribers.csv for easy viewing in Excel/Sheets.
 */
function appendSubscriberCsv(sub) {
  try {
    const fileExists = fs.existsSync(SUBSCRIBERS_CSV);
    const row = [
      escapeCsvField(sub.id),
      escapeCsvField(sub.email),
      escapeCsvField(sub.subscribedAt),
      escapeCsvField(sub.status),
      escapeCsvField(sub.ip),
      escapeCsvField(sub.source || 'website_footer'),
    ].join(',') + '\n';

    if (!fileExists) {
      const header = 'ID,Email,SubscribedAt,Status,IP,Source\n';
      fs.writeFileSync(SUBSCRIBERS_CSV, header + row, 'utf8');
    } else {
      fs.appendFileSync(SUBSCRIBERS_CSV, row, 'utf8');
    }
  } catch (err) {
    console.error('[storage] Failed to write to subscribers.csv:', err.message);
  }
}

/**
 * Saves a new subscriber or returns existing subscriber details.
 * Prevents duplicate emails.
 */
function addSubscriber({ email, ip = '', source = 'website_footer' }) {
  const normalizedEmail = String(email || '').trim().toLowerCase();
  if (!normalizedEmail) {
    throw new Error('Email address is required.');
  }

  const subscribers = readSubscribers();
  const existing = subscribers.find((s) => s.email.toLowerCase() === normalizedEmail);

  if (existing) {
    return {
      isNew: false,
      subscriber: existing,
    };
  }

  const newSubscriber = {
    id: crypto.randomUUID(),
    email: normalizedEmail,
    subscribedAt: new Date().toISOString(),
    status: 'active',
    ip,
    source,
  };

  subscribers.push(newSubscriber);
  atomicWriteFileSync(SUBSCRIBERS_JSON, JSON.stringify(subscribers, null, 2));
  appendSubscriberCsv(newSubscriber);

  return {
    isNew: true,
    subscriber: newSubscriber,
  };
}

/**
 * Retrieves subscriber details by email address.
 */
function getSubscriber(email) {
  if (!email) return null;
  const normalizedEmail = String(email).trim().toLowerCase();
  const subscribers = readSubscribers();
  return subscribers.find((s) => s.email.toLowerCase() === normalizedEmail) || null;
}

/**
 * Lists all subscribers with optional limit/filtering.
 */
function listSubscribers() {
  return readSubscribers();
}

// ============================================================================
// CONTACT SUBMISSIONS STORAGE METHODS
// ============================================================================

/**
 * Reads all contact form submissions.
 */
function readSubmissions() {
  try {
    if (!fs.existsSync(SUBMISSIONS_JSON)) {
      atomicWriteFileSync(SUBMISSIONS_JSON, '[]');
      return [];
    }
    const raw = fs.readFileSync(SUBMISSIONS_JSON, 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('[storage] Error reading submissions.json:', err.message);
    return [];
  }
}

/**
 * Appends a contact submission to submissions.csv.
 */
function appendSubmissionCsv(item) {
  try {
    const fileExists = fs.existsSync(SUBMISSIONS_CSV);
    const row = [
      escapeCsvField(item.id),
      escapeCsvField(item.name),
      escapeCsvField(item.email),
      escapeCsvField(item.website),
      escapeCsvField(item.message),
      escapeCsvField(item.submittedAt),
      escapeCsvField(item.ip),
    ].join(',') + '\n';

    if (!fileExists) {
      const header = 'ID,Name,Email,Website,Message,SubmittedAt,IP\n';
      fs.writeFileSync(SUBMISSIONS_CSV, header + row, 'utf8');
    } else {
      fs.appendFileSync(SUBMISSIONS_CSV, row, 'utf8');
    }
  } catch (err) {
    console.error('[storage] Failed to write to submissions.csv:', err.message);
  }
}

/**
 * Adds and persists a new contact form submission.
 */
function addSubmission({ name, email, website = '', message, ip = '' }) {
  const list = readSubmissions();
  const item = {
    id: crypto.randomUUID(),
    name: String(name || '').trim(),
    email: String(email || '').trim().toLowerCase(),
    website: String(website || '').trim(),
    message: String(message || '').trim(),
    submittedAt: new Date().toISOString(),
    ip,
  };

  list.push(item);
  atomicWriteFileSync(SUBMISSIONS_JSON, JSON.stringify(list, null, 2));
  appendSubmissionCsv(item);

  return item;
}

module.exports = {
  // Subscribers
  addSubscriber,
  getSubscriber,
  listSubscribers,
  SUBSCRIBERS_JSON,
  SUBSCRIBERS_CSV,

  // Submissions
  addSubmission,
  readSubmissions,
  SUBMISSIONS_JSON,
  SUBMISSIONS_CSV,
};
