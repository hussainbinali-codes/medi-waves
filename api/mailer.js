// Nodemailer service for the contact form.
// Sends a notification email whenever someone submits the contact form.
'use strict';

const nodemailer = require('nodemailer');

// ============================================================
// GMAIL CREDENTIALS — loaded from api/.env (not committed to git)
// ============================================================
// EMAIL_USER: the Gmail address that sends the notification
// EMAIL_PASS: a Gmail "App Password" (NOT the normal login password)
//   Generated at: https://myaccount.google.com/apppasswords
//   (requires 2-Step Verification to be enabled on the account)
// CONTACT_RECEIVER: where contact form notifications are delivered
//
// See api/.env for the actual values.
const EMAIL_USER = process.env.EMAIL_USER || '';
const EMAIL_PASS = process.env.EMAIL_PASS || '';
const CONTACT_RECEIVER = process.env.CONTACT_RECEIVER || EMAIL_USER;

let transporter = null;

function getTransporter() {
  if (!EMAIL_USER || !EMAIL_PASS) {
    return null;
  }
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
      },
    });
  }
  return transporter;
}

/**
 * Sends a contact-form notification email.
 * Resolves silently (does not throw) if credentials are not configured,
 * so the API can still save the submission even if email isn't set up yet.
 */
async function sendContactEmail({ name, email, website, message }) {
  const t = getTransporter();
  if (!t) {
    console.warn('[mailer] EMAIL_USER / EMAIL_PASS not configured — skipping email send.');
    return { sent: false, reason: 'not_configured' };
  }

  const mailOptions = {
    from: `"Medi Waves Website" <${EMAIL_USER}>`,
    to: CONTACT_RECEIVER,
    replyTo: email,
    subject: `New Contact Form Submission from ${name}`,
    text: [
      `Name: ${name}`,
      `Email: ${email}`,
      website ? `Website: ${website}` : null,
      '',
      'Message:',
      message,
    ].filter(Boolean).join('\n'),
    html: `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      ${website ? `<p><strong>Website:</strong> ${website}</p>` : ''}
      <p><strong>Message:</strong></p>
      <p>${String(message).replace(/\n/g, '<br>')}</p>
    `,
  };

  try {
    await t.sendMail(mailOptions);
    return { sent: true };
  } catch (err) {
    console.error('[mailer] Failed to send email:', err.message);
    return { sent: false, reason: 'send_failed', error: err.message };
  }
}

module.exports = { sendContactEmail };
