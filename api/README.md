# Contact Form API

A tiny dependency-free Node server that receives submissions from the contact
form on `/contact/` and saves them to `submissions.json`.

## Run it

```bash
cd api
node server.js
```

It listens on `http://localhost:8081` by default (override with `PORT=xxxx node server.js`).

## Endpoints

- `POST /api/contact` — body `{ name, email, website?, message }` (JSON). Saves the
  submission and returns `{ ok: true, id }`.
- `GET /api/contact` — returns all stored submissions as JSON (no auth — for local
  review only, don't expose this publicly as-is).
- `GET /api/health` — basic liveness check.

## Data

Submissions are appended to `submissions.json` in this folder as an array of
objects: `{ id, name, email, website, message, submittedAt, ip }`.

## Next steps (optional)

- Email delivery: wire in SMTP (e.g. via `nodemailer`) once you have provider
  credentials, and send each submission as an email in addition to/instead of
  saving locally.
- Auth: if you deploy this publicly, put `GET /api/contact` behind a login or
  remove it, since it currently has no access control.
- Production hosting: this dev server is single-process and has no HTTPS —
  put it behind a reverse proxy (nginx) or move the endpoint into your real
  hosting stack (e.g. a serverless function) for production use.
