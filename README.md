# Campus Nexus AI

An AI-powered learning & career platform prototype for students, faculty, professionals, job seekers, alumni, and lifelong learners.

## Running it

This now includes a small Node.js/Express backend (needed for the automated internship certificate pipeline — see below), so it's no longer just static files.

1. Unzip the folder.
2. Install dependencies:
   ```bash
   cd campus-nexus-ai
   npm install
   ```
3. Copy the environment template and fill in your own values (at minimum, your Make.com webhook URL once you've set it up — see the automation section below):
   ```bash
   cp .env.example .env
   ```
4. Start the server:
   ```bash
   npm start
   ```
5. Open `http://localhost:3000` in your browser.

Everything except the certificate pipeline (accounts, quizzes, roadmaps, chat, interview prep) still runs entirely in the browser via `localStorage`, same as before — the Node server's job is just to serve those files and host the certificate API.

## Features

- **Landing page** (`index.html`) — product overview, audiences served, feature tour.
- **Sign up / Log in** (`signup.html`, `login.html`) — client-side account creation and session handling (see note below).
- **Dashboard** (`dashboard.html`) — your roadmap progress, quiz history, mock-interview sessions, and AI Mentor activity in one place. Requires login.
- **AI Mentor** (`chatbot.html`) — a keyword-driven conversational assistant tuned for learning and career questions (roadmaps, interviews, resumes, career changes, study stress, etc.).
- **Roadmaps** (`roadmaps.html`) — generate a phased, checkable roadmap toward six destination roles (Full-Stack Developer, Data Scientist, Product Manager, UI/UX Designer, Digital Marketer, AI/ML Engineer). Progress is tracked with checkboxes and saved automatically.
- **Quizzes** (`quizzes.html`) — timed, scored multiple-choice quizzes across Web Development, Data Science, AI & ML, Aptitude & Reasoning, and Communication Skills, with answer review and history saved to your dashboard.
- **Interview Prep** (`interview-prep.html`) — browse role-specific question banks with tips, or run a mock interview: type an answer to each question and get rule-based feedback on length, keyword coverage, and structure (STAR for behavioral, reasoning for technical).
- **Career Guidance** (`career-guidance.html`) — a short work-style assessment that scores you across four dimensions (Builder / Analyst / Creative / Connector) and recommends career paths, each linking to a starter roadmap.
- **Internship Program** (`internship.html`) — three sequential Roadmap Domains, RD-1 (React JS), RD-2 (Power BI), and RD-3 (AI/ML using Python), each unlocked in order. Every RD lists its courses with individual and total estimated duration (e.g. "5 courses · 3.5h course"), embeds a reference tutorial video, and offers a generated PDF of course notes you can view in a new tab — then caps off with a scored quiz (70% to pass). A Capstone Projects module (one project per track, with an estimated effort per project, submitted via checklist) unlocks after RD-3. Completing all four unlocks a certificate request, which is handled by the automated pipeline described below: a real PDF is generated, and roughly 24 hours later it's emailed to the student's registered address automatically via Make.com + Gmail.

## How data is stored

Accounts, quiz results, roadmap progress, mock-interview history, and chat logs are still entirely client-side: they live in the browser's `localStorage`, scoped to whichever browser/device you're using, with no real backend or database behind them. Clearing browser data will remove them. Passwords are hashed with a simple non-cryptographic hash for the demo flow only — **do not reuse a real password when creating an account here.**

The one exception is the internship certificate pipeline (below), which now has a real, small Node.js backend: it generates and stores actual certificate PDFs on disk (`generated-certificates/`) and keeps a JSON record of each request (`data/certificates.json`).

You can also use the "Use a demo account instead" link on the login page to skip account creation entirely.

## Internship certificate automation (Make.com + Gmail)

Once all four internship modules are complete, the student clicks **Request certificate**. Here's exactly what happens:

1. The browser calls `POST /api/certificate/request` on this Node server.
2. The server immediately generates a real certificate PDF (via `pdfkit`), saves a record to `data/certificates.json`, and hosts the PDF at a public URL like `${BASE_URL}/certificates/CN-INT-xxxxx.pdf`.
3. **If `MAKE_WEBHOOK_URL` is set**, the server posts a JSON payload to it so your Make.com scenario takes over delivery (steps below). **If it's left blank, the app runs a built-in local mail simulation instead** — no external setup required: a background check (`simulateDeliveryTick` in `server.js`) runs once a minute, and as soon as 24 real hours have passed since a request (or you click the "Mark delivered (dev/testing only)" button for instant testing), the record flips to "delivered" and a line like this is logged to the server console in place of a real email:
   ```
   📧 [simulated email] To: student@example.com — Subject: "🎓 Your Campus Nexus AI Internship Certificate" — attachment: http://localhost:3000/certificates/CN-INT-....pdf
   ```
   The Internship page picks this up automatically (it polls status every 20 seconds) and shows the delivered banner with a working download link to the real generated PDF. This means the whole flow — request → wait → "email" → download — works right out of the box, with or without Make.com configured.
4. Once you're ready for real Gmail delivery, set `MAKE_WEBHOOK_URL` and build the scenario below; the payload includes:
   ```json
   {
     "userId": "...", "name": "...", "email": "...", "certId": "CN-INT-...",
     "requestedAt": "2026-07-10T09:00:00.000Z",
     "deliverAt": "2026-07-11T09:00:00.000Z",
     "certificateUrl": "http://your-host/certificates/CN-INT-....pdf",
     "callbackUrl": "http://your-host/api/certificate/mark-delivered",
     "callbackSecret": "the value of MAKE_CALLBACK_SECRET"
   }
   ```
5. **Your Make.com scenario** (you build this once, in your Make.com account) waits ~24 hours, downloads the PDF, and sends it from **gaya32420713@gmail.com** to the student via Make's Gmail module.
6. The last step of the scenario calls the `callbackUrl` back with `{ "userId", "certId", "secret" }` so this app knows it was actually delivered, which updates the "Delivered" status and download link shown on the Internship page. (The local simulation described above automatically steps aside as soon as `MAKE_WEBHOOK_URL` is set — only the real callback can mark a certificate delivered from then on.)

### Setting up the Make.com scenario

1. **Create a new scenario** in Make.com.
2. **Module 1 — Webhooks: Custom webhook.** Create a webhook, copy its URL into `.env` as `MAKE_WEBHOOK_URL`, and redeploy/restart this server so it picks up the value. Click "Redetermine data structure" and trigger a test request (e.g. run through the Internship flow once) so Make learns the JSON shape above.
3. **Module 2 — Tools: Sleep.** Set the delay so the scenario resumes at `{{deliverAt}}` (Make's Sleep module accepts a number of seconds — compute it as the difference between `deliverAt` and `now`, e.g. with a "Set variable"/formula step, or use Make's built-in date-difference function). *Note:* on some Make.com plans, very long-running scenario executions can be capped or billed differently — if that's a concern, the more robust production pattern is **two scenarios**: this first one just logs the request (e.g. to Google Sheets/Airtable) and returns immediately; a second scenario runs on a schedule (say, every 15–30 minutes), checks for rows where `deliverAt <= now` and not yet sent, and does steps 4–6 below for each one.
4. **Module 3 — HTTP: Get a file.** URL: `{{certificateUrl}}` from the webhook payload. This downloads the generated certificate PDF so it can be attached to the email.
5. **Module 4 — Gmail: Send an email.** Connect your `gaya32420713@gmail.com` account (Make will walk you through Google's OAuth consent screen the first time). Set:
   - To: `{{email}}`
   - Subject: `🎓 Your Campus Nexus AI Internship Certificate`
   - Content: a short congratulations message mentioning RD-1 React JS, RD-2 Power BI, RD-3 AI/ML using Python, and the capstone projects, plus the certificate ID `{{certId}}`.
   - Attachment: the file from Module 3.
6. **Module 5 — HTTP: Make a request.** POST to `{{callbackUrl}}` with JSON body `{ "userId": "{{userId}}", "certId": "{{certId}}", "secret": "{{callbackSecret}}" }` (the secret is also passed through the original webhook payload, or you can hardcode the same value you put in `.env` as `MAKE_CALLBACK_SECRET`).
7. Turn the scenario **on**.

While you're setting this up (or if you don't want to wait a real 24 hours to test), leave `DEV_MODE=true` in `.env` — the Internship page will show a **"Mark delivered (dev/testing only)"** button so you can see the fully delivered state instantly. Set `DEV_MODE=false` once you're in production so that button disappears and delivery only ever happens for real, via Make.com.

### Security notes

- `MAKE_CALLBACK_SECRET` is the only thing preventing someone else from POSTing to `/api/certificate/mark-delivered` and marking a certificate delivered without it actually being emailed — keep it secret and long/random.
- This app has no real user database or server-side authentication (see "How data is stored" below) — the certificate request trusts whatever `name`/`email` the browser sends, exactly as it trusts them for the rest of the demo. Don't point `gaya32420713@gmail.com` at a deployment with real students' data without adding real auth first.
- Generated PDFs and `data/certificates.json` are excluded from git via `.gitignore` since they contain personal data (names/emails) — don't commit them.

## Wiring in a real backend / real AI

To move this from prototype to production, the natural next steps are:
- Replace `js/auth.js`'s localStorage calls with real API calls to an auth service (e.g. sessions/JWT + a database).
- Replace the rule-based logic in `js/chatbot.js` and the feedback logic in `js/interview.js` with calls to a real LLM API for more flexible, higher-quality responses.
- Move the static data in `js/roadmaps.js`, `js/quizzes.js`, `js/interview.js`, and `js/career.js` into a database so content can be managed without editing code.

## File structure

```
campus-nexus-ai/
├── package.json
├── server.js              (Express server + certificate API + mail simulation)
├── .env.example           (copy to .env)
├── .gitignore
├── data/
│   └── certificates.json  (created at runtime; git-ignored)
├── generated-certificates/
│   └── *.pdf              (created at runtime; git-ignored)
└── campus nex/            (the static site, served by server.js)
    ├── index.html
    ├── login.html
    ├── signup.html
    ├── dashboard.html
    ├── chatbot.html
    ├── roadmaps.html
    ├── quizzes.html
    ├── interview-prep.html
    ├── career-guidance.html
    ├── internship.html
    ├── css/
    │   └── style.css
    └── js/
        ├── auth.js        (shared auth + header wiring)
        ├── dashboard.js
        ├── chatbot.js
        ├── roadmaps.js
        ├── quizzes.js
        ├── interview.js
        ├── career.js
        └── internship.js  (calls the certificate API on the server above)
```
