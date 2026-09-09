# Medi Waves API (Contact & Newsletter)

A lightweight, reliable Node.js server that handles contact form submissions and newsletter subscriptions.

## Run it

```bash
cd api
node server.js
```

Listens on `http://localhost:8081` by default (override with `PORT=xxxx node server.js`).

## Endpoints

### 1. Newsletter Subscription
- **`POST /api/newsletter`** (or `/api/subscribe`)
  - Request Body: `{ "email": "user@example.com" }`
  - Response (New subscriber):
    ```json
    {
      "ok": true,
      "message": "Thank you for subscribing to our newsletter!",
      "id": "uuid-v4",
      "subscriber": {
        "id": "uuid-v4",
        "email": "user@example.com",
        "subscribedAt": "2026-09-09T12:00:00.000Z",
        "status": "active",
        "ip": "::1",
        "source": "website_footer"
      }
    }
    ```
  - Response (Already subscribed):
    ```json
    {
      "ok": true,
      "alreadySubscribed": true,
      "message": "This email is already subscribed to our newsletter updates.",
      "subscriber": { ... }
    }
    ```

- **`GET /api/newsletter?email=user@example.com`**
  - Looks up a specific subscriber by email.
  - Returns: `{ "ok": true, "found": true, "subscriber": { ... } }` or 404 if not found.

- **`GET /api/newsletter`** (or `/api/subscribers`)
  - Returns all registered subscribers and total count:
    ```json
    {
      "ok": true,
      "total": 5,
      "subscribers": [ ... ]
    }
    ```

### 2. Contact Form
- **`POST /api/contact`** — body `{ name, email, website?, message }` (JSON). Saves submission and sends email notification.
- **`GET /api/contact`** — returns all stored contact inquiries.

### 3. Health Check
- **`GET /api/health`** — returns `{ "ok": true, "status": "up" }`.

## Data Storage Method
All submissions and subscriptions are stored safely using the storage module (`storage.js`):
1. **Atomic File Writing**: Writes to a temporary `.tmp` file and replaces the destination atomically (`atomicWriteFileSync`), preventing any data corruption.
2. **Dual-Format Persistence**:
   - `subscribers.json`: Full JSON record array.
   - `subscribers.csv`: Excel-ready CSV file with columns: `ID, Email, SubscribedAt, Status, IP, Source`.
   - `submissions.json`: Contact inquiries in JSON.
   - `submissions.csv`: Contact inquiries in CSV.
