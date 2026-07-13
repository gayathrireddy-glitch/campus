/* ============================================================
   CAMPUS NEXUS AI — server.js
   Serves the existing static site and adds a small API that
   powers the automated internship certificate pipeline:

     1. POST /api/certificate/request
        Student has finished RD-1, RD-2, RD-3 + Projects and
        clicks "Request certificate" in the browser. This route
        generates the certificate PDF, stores a record, and
        pings your Make.com webhook.

     2. Make.com (configured by you, see README.md) waits ~24
        hours, downloads the PDF from the URL we gave it, and
        sends it from gaya32420713@gmail.com via its Gmail
        module to the student's registered email.

     3. Make.com calls back:
        POST /api/certificate/mark-delivered
        so our own records / UI reflect that it was actually sent.

     4. The front end polls:
        GET /api/certificate/status/:userId
        to show live status (none / requested / delivered).
   ============================================================ */

require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');
const PDFDocument = require('pdfkit');

const app = express();

const PORT = process.env.PORT || 3000;
const BASE_URL = (process.env.BASE_URL || `http://localhost:${PORT}`).replace(/\/$/, '');
const MAKE_WEBHOOK_URL = process.env.MAKE_WEBHOOK_URL || '';
const MAKE_CALLBACK_SECRET = process.env.MAKE_CALLBACK_SECRET || 'change-me';
const DEV_MODE = process.env.DEV_MODE === 'true';
const CERT_DELAY_MS = 24 * 60 * 60 * 1000; // 24 hours

const STATIC_ROOT = path.join(__dirname, 'campus nex');
const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'certificates.json');
const CERT_DIR = path.join(__dirname, 'generated-certificates');

for (const dir of [DATA_DIR, CERT_DIR]) fs.mkdirSync(dir, { recursive: true });
if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, '{}');

/* ---------------- tiny JSON "database" ---------------- */
function readDb() {
  try { return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8')); }
  catch (e) { return {}; }
}
function writeDb(db) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2));
}

/* ---------------- certificate PDF ---------------- */
function generateCertId(userId) {
  const digits = String(userId).replace(/\D/g, '').slice(-6) || '000000';
  return 'CN-INT-' + digits + '-' + Date.now().toString(36).toUpperCase();
}

function drawCertificatePdf({ filePath, name, certId, modules, dateStr }) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: [1400, 990], margin: 0 });
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    // background + border
    doc.rect(0, 0, 1400, 990).fill('#0B1120');
    doc.lineWidth(6).strokeColor('#6C63FF').rect(30, 30, 1340, 930).stroke();
    doc.lineWidth(2).strokeColor('#2B3760').rect(50, 50, 1300, 890).stroke();
    doc.rect(50, 50, 90, 6).fill('#FFB648');
    doc.rect(50, 50, 6, 90).fill('#FFB648');
    doc.rect(1170, 934, 90, 6).fill('#4FD1C5');
    doc.rect(1338, 844, 6, 90).fill('#4FD1C5');

    doc.fillColor('#7C86AC').font('Helvetica-Bold').fontSize(20)
      .text('CAMPUS NEXUS AI', 0, 130, { align: 'center', width: 1400 });

    doc.fillColor('#EEF1FA').font('Helvetica-Bold').fontSize(38)
      .text('Certificate of Internship Completion', 0, 190, { align: 'center', width: 1400 });

    doc.fillColor('#B7BEDA').font('Helvetica').fontSize(20)
      .text('This certifies that', 0, 280, { align: 'center', width: 1400 });

    doc.fillColor('#FFB648').font('Helvetica-Bold').fontSize(44)
      .text(name, 0, 320, { align: 'center', width: 1400 });

    doc.fillColor('#B7BEDA').font('Helvetica').fontSize(18)
      .text('has successfully completed the Campus Nexus AI Internship Program, covering:', 0, 400, { align: 'center', width: 1400 });

    doc.fillColor('#EEF1FA').font('Helvetica-Bold').fontSize(19)
      .text(modules, 0, 440, { align: 'center', width: 1400 });

    doc.moveTo(300, 560).lineTo(1100, 560).lineWidth(1).strokeColor('#2B3760').stroke();

    doc.fillColor('#7C86AC').font('Helvetica').fontSize(14)
      .text(`Issue date: ${dateStr}`, 0, 600, { align: 'center', width: 1400 })
      .text(`Certificate ID: ${certId}`, 0, 622, { align: 'center', width: 1400 });

    doc.fillColor('#6C63FF').font('Helvetica-Bold').fontSize(16).text('Campus Nexus AI', 140, 860);
    doc.fillColor('#7C86AC').font('Helvetica').fontSize(11).text('Learning & Career Platform', 140, 882);

    doc.end();
    stream.on('finish', resolve);
    stream.on('error', reject);
  });
}

/* ---------------- app ---------------- */
app.use(express.json());
app.use(express.static(STATIC_ROOT));
app.use('/certificates', express.static(CERT_DIR));

// Request a certificate: generates the PDF immediately, stores a record,
// and (if configured) notifies the Make.com scenario which owns the
// 24-hour wait + the actual Gmail send.
app.post('/api/certificate/request', async (req, res) => {
  try {
    const { userId, name, email, modules } = req.body || {};
    if (!userId || !name || !email) {
      return res.status(400).json({ error: 'userId, name and email are required.' });
    }

    const db = readDb();
    const existing = db[userId];
    if (existing && (existing.status === 'requested' || existing.status === 'delivered')) {
      return res.json({ ...existing, devMode: DEV_MODE });
    }

    const certId = generateCertId(userId);
    const requestedAt = Date.now();
    const deliverAt = requestedAt + CERT_DELAY_MS;
    const fileName = `${certId}.pdf`;
    const filePath = path.join(CERT_DIR, fileName);
    const dateStr = new Date(deliverAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const modulesLabel = modules || 'RD-1 React JS · RD-2 Power BI · RD-3 AI/ML using Python · Capstone Projects';

    await drawCertificatePdf({ filePath, name, certId, modules: modulesLabel, dateStr });

    const record = {
      userId, name, email, certId,
      status: 'requested',
      requestedAt, deliverAt, deliveredAt: null,
      certificateUrl: `${BASE_URL}/certificates/${fileName}`
    };
    db[userId] = record;
    writeDb(db);

    if (MAKE_WEBHOOK_URL) {
      fetch(MAKE_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId, name, email, certId,
          requestedAt: new Date(requestedAt).toISOString(),
          deliverAt: new Date(deliverAt).toISOString(),
          certificateUrl: record.certificateUrl,
          callbackUrl: `${BASE_URL}/api/certificate/mark-delivered`,
          callbackSecret: MAKE_CALLBACK_SECRET
        })
      }).catch(err => console.error('⚠️  Make.com webhook call failed:', err.message));
    } else {
      console.warn('⚠️  MAKE_WEBHOOK_URL is not set — no Make.com scenario was notified. This server will simulate delivery locally once 24 hours pass (see simulateDeliveryTick in server.js), so the flow still works end-to-end for testing.');
    }

    res.json({ ...record, devMode: DEV_MODE });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to request certificate.' });
  }
});

// Front end polls this to show live status.
app.get('/api/certificate/status/:userId', (req, res) => {
  const db = readDb();
  const record = db[req.params.userId];
  if (!record) return res.json({ status: 'none', devMode: DEV_MODE });
  res.json({ ...record, devMode: DEV_MODE });
});

// Called by the Make.com scenario's final HTTP module, right after its
// Gmail "Send an Email" step succeeds.
app.post('/api/certificate/mark-delivered', (req, res) => {
  const { userId, certId, secret } = req.body || {};
  if (secret !== MAKE_CALLBACK_SECRET) {
    return res.status(401).json({ error: 'Invalid callback secret.' });
  }
  const db = readDb();
  const record = db[userId];
  if (!record || record.certId !== certId) {
    return res.status(404).json({ error: 'No matching certificate request.' });
  }
  record.status = 'delivered';
  record.deliveredAt = Date.now();
  db[userId] = record;
  writeDb(db);
  res.json({ ok: true });
});

// Dev-only helper: lets you see the "delivered" state locally without
// waiting for a real Make.com scenario to run. Disabled unless DEV_MODE=true.
app.post('/api/certificate/dev-deliver', (req, res) => {
  if (!DEV_MODE) return res.status(403).json({ error: 'DEV_MODE is off — set DEV_MODE=true in .env to use this.' });
  const { userId } = req.body || {};
  const db = readDb();
  const record = db[userId];
  if (!record) return res.status(404).json({ error: 'No certificate request found for this user yet.' });
  record.status = 'delivered';
  record.deliveredAt = Date.now();
  db[userId] = record;
  writeDb(db);
  res.json({ ok: true, record });
});

// If MAKE_WEBHOOK_URL isn't configured yet, this server simulates the
// Make.com + Gmail step itself so the whole certificate flow still works
// end-to-end out of the box: once 24 hours actually pass (or you use the
// dev-deliver button), the record flips to "delivered" and a line is
// logged here standing in for the email that Make.com would have sent.
// As soon as you set MAKE_WEBHOOK_URL, this simulation steps aside and
// only the real Make.com scenario (via /api/certificate/mark-delivered)
// can mark a certificate delivered.
function simulateDeliveryTick() {
  if (MAKE_WEBHOOK_URL) return; // real automation is configured — let Make.com own delivery
  const db = readDb();
  let changed = false;
  for (const userId of Object.keys(db)) {
    const record = db[userId];
    if (record.status === 'requested' && Date.now() >= record.deliverAt) {
      record.status = 'delivered';
      record.deliveredAt = Date.now();
      changed = true;
      console.log(`📧 [simulated email] To: ${record.email} — Subject: "🎓 Your Campus Nexus AI Internship Certificate" — attachment: ${record.certificateUrl}`);
    }
  }
  if (changed) writeDb(db);
}
setInterval(simulateDeliveryTick, 60 * 1000);
simulateDeliveryTick();

app.listen(PORT, () => {
  console.log(`\n🎓 Campus Nexus AI running at ${BASE_URL}`);
  if (!MAKE_WEBHOOK_URL) {
    console.warn('⚠️  MAKE_WEBHOOK_URL is not set — running in local mail-simulation mode: certificates still generate and "deliver" themselves after 24 hours (logged to this console), but nothing is really emailed until you wire up Make.com. See README.md.');
  }
});
