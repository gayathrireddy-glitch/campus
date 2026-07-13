/* ============================================================
   CAMPUS NEXUS AI — internship.js
   Internship Program: RD-1 (React JS), RD-2 (Power BI),
   RD-3 (AI/ML with Python), Capstone Projects.
   Completing every RD's quiz + submitting the projects unlocks
   a certificate request. The certificate is generated 24 hours
   after request and "delivered" to the student's login email —
   simulated entirely client-side, see note in the UI + README.
   ============================================================ */

const INTERNSHIP_MODULES = {
  rd1: {
    order: 1, code: 'RD-1', title: 'React JS', tag: 'learn',
    summary: 'Build modern, component-based user interfaces with React.',
    video: { id: 'bMknfKXIFA8', title: 'React Course — Beginner\'s Tutorial for React JavaScript Library', channel: 'freeCodeCamp.org' },
    courses: [
      { title: 'React & JSX fundamentals', desc: 'Setting up a project, JSX syntax, rendering elements.', duration: 0.5 },
      { title: 'Components, props & state', desc: 'Function components, passing data down, local state with useState.', duration: 1 },
      { title: 'Hooks in practice', desc: 'useState, useEffect, and rules of hooks for side effects.', duration: 1 },
      { title: 'Routing with React Router', desc: 'Multi-page navigation in a single-page app.', duration: 0.5 },
      { title: 'Forms & API integration', desc: 'Controlled inputs, fetching data, handling loading/error states.', duration: 0.5 }
    ],
    quiz: [
      { q: 'What does JSX allow you to write directly inside JavaScript?', options: ['SQL queries', 'HTML-like markup', 'CSS animations', 'Shell commands'], correct: 1 },
      { q: 'Which hook is used to add local state to a function component?', options: ['useEffect', 'useRef', 'useState', 'useMemo'], correct: 2 },
      { q: 'In React, "props" are best described as:', options: ['Internal mutable state', 'Read-only data passed from a parent component', 'A CSS styling API', 'A database connection'], correct: 1 },
      { q: 'Which hook runs side effects like data fetching after render?', options: ['useEffect', 'useState', 'useContext', 'useCallback'], correct: 0 },
      { q: 'What is the purpose of a "key" prop when rendering a list?', options: ['To style list items', 'To help React identify which items changed', 'To encrypt list data', 'To sort the array'], correct: 1 },
      { q: 'Which library is most commonly used for client-side routing in React?', options: ['Express', 'Redux', 'React Router', 'Axios'], correct: 2 }
    ]
  },
  rd2: {
    order: 2, code: 'RD-2', title: 'Power BI', tag: 'career',
    summary: 'Turn raw data into interactive dashboards and business insight.',
    video: { id: 'FwjaHCVNBWA', title: 'Power BI for Data Analytics — Full Course for Beginners', channel: 'Luke Barousse' },
    courses: [
      { title: 'Power BI interface & data sources', desc: 'Connecting to Excel, CSV, SQL and other data sources.', duration: 1 },
      { title: 'Power Query — transforming data', desc: 'Cleaning, shaping, and combining data before it hits the model.', duration: 1.5 },
      { title: 'Data modeling & relationships', desc: 'Star schemas, one-to-many relationships, cardinality.', duration: 1.5 },
      { title: 'DAX fundamentals', desc: 'Measures, calculated columns, and common DAX functions.', duration: 1.5 },
      { title: 'Building dashboards & visuals', desc: 'Choosing the right visual, slicers, filters, drill-through.', duration: 1.5 },
      { title: 'Publishing & sharing reports', desc: 'Power BI Service, workspaces, and scheduled refresh.', duration: 1 }
    ],
    quiz: [
      { q: 'Which Power BI tool is used to clean and reshape data before loading it?', options: ['DAX editor', 'Power Query Editor', 'Report view', 'Bookmarks pane'], correct: 1 },
      { q: 'DAX is primarily used in Power BI to:', options: ['Design report page layouts', 'Write formulas for measures and calculated columns', 'Connect to cloud storage', 'Manage user permissions'], correct: 1 },
      { q: 'A "star schema" data model is characterized by:', options: ['One giant flat table only', 'A central fact table linked to surrounding dimension tables', 'No relationships between tables', 'Only text-based fields'], correct: 1 },
      { q: 'Which Power BI feature lets users interactively filter a report by clicking a value?', options: ['Slicer', 'Bookmark', 'Gateway', 'Dataflow'], correct: 0 },
      { q: 'Where do you publish a Power BI report so others can view it online?', options: ['Power BI Desktop only', 'Power BI Service (app.powerbi.com)', 'A local .pbix file', 'Excel Online'], correct: 1 },
      { q: 'What does "cardinality" describe in a data model relationship?', options: ['The color scheme of a visual', 'How rows in one table relate to rows in another (e.g. one-to-many)', 'The refresh schedule', 'The report page size'], correct: 1 }
    ]
  },
  rd3: {
    order: 3, code: 'RD-3', title: 'AI/ML using Python', tag: 'signal',
    summary: 'Apply Python to build, evaluate, and reason about machine learning models.',
    video: { id: 'hDKCxebp88A', title: 'Machine Learning with Python and Scikit-Learn — Full Course', channel: 'freeCodeCamp.org' },
    courses: [
      { title: 'Python for data science', desc: 'NumPy arrays and pandas DataFrames for working with data.', duration: 1 },
      { title: 'Data preprocessing & visualization', desc: 'Cleaning missing data, encoding, and plotting distributions.', duration: 1 },
      { title: 'Supervised learning algorithms', desc: 'Regression and classification with scikit-learn.', duration: 1.5 },
      { title: 'Model evaluation metrics', desc: 'Accuracy, precision/recall, F1 score, and the train/test split.', duration: 1 },
      { title: 'Intro to neural networks', desc: 'Layers, weights, activation functions, and loss at a high level.', duration: 1 },
      { title: 'Deploying a simple ML model', desc: 'Saving a trained model and serving predictions.', duration: 0.5 }
    ],
    quiz: [
      { q: 'Which Python library provides the DataFrame structure widely used for tabular data?', options: ['NumPy', 'pandas', 'Matplotlib', 'Flask'], correct: 1 },
      { q: 'Why do we split data into training and test sets?', options: ['To make the dataset smaller for storage', 'To evaluate how well a model generalizes to unseen data', 'To remove duplicate rows', 'It is required by Python syntax'], correct: 1 },
      { q: '"Overfitting" means a model:', options: ['Performs poorly on both train and test data', 'Learns the training data too closely and generalizes poorly', 'Trains faster than expected', 'Has too few parameters'], correct: 1 },
      { q: 'Which metric combines precision and recall into a single score?', options: ['R-squared', 'F1 score', 'Mean Squared Error', 'Standard deviation'], correct: 1 },
      { q: 'Which library is commonly used for classic ML algorithms in Python (e.g. logistic regression, decision trees)?', options: ['scikit-learn', 'React', 'Power Query', 'Bootstrap'], correct: 0 },
      { q: 'In a neural network, an activation function is primarily used to:', options: ['Store training data', 'Introduce non-linearity so the network can learn complex patterns', 'Connect to a database', 'Format output as JSON'], correct: 1 }
    ]
  }
};
const MODULE_ORDER = ['rd1', 'rd2', 'rd3', 'projects'];
const PASS_PCT = 70;

const CAPSTONE_PROJECTS = [
  { id: 'p1', track: 'React JS', title: 'Personal Task Manager App', brief: 'A React app with add/edit/delete tasks, filtering, and local persistence.', duration: 3 },
  { id: 'p2', track: 'Power BI', title: 'Sales Performance Dashboard', brief: 'An interactive dashboard modeling a sales dataset with DAX measures and drill-through.', duration: 3 },
  { id: 'p3', track: 'AI/ML using Python', title: 'Predictive Model Notebook', brief: 'A trained classification/regression model with a clear evaluation write-up.', duration: 4 }
];

function sumDuration(items) { return items.reduce((s, i) => s + i.duration, 0); }
function fmtHrs(h) { return (Number.isInteger(h) ? h : h.toFixed(1)) + 'h'; }

document.addEventListener('DOMContentLoaded', function () {
  const user = CN.requireAuth();
  if (!user) return;

  const STATE_KEY = CN.ns('cn_internship', user.id);
  const root = document.getElementById('internship-root');

  let view = { mode: 'overview', moduleId: null, qIndex: 0, answers: [] };
  let tickHandle = null;

  /* ---------------- State helpers ---------------- */
  function defaultState() {
    return {
      rd1: { done: false, score: null, total: null, attempts: 0, completedAt: null },
      rd2: { done: false, score: null, total: null, attempts: 0, completedAt: null },
      rd3: { done: false, score: null, total: null, attempts: 0, completedAt: null },
      projects: { done: false, submissions: { p1: false, p2: false, p3: false }, completedAt: null }
    };
  }
  function getState() {
    const raw = localStorage.getItem(STATE_KEY);
    if (!raw) { const s = defaultState(); saveState(s); return s; }
    try {
      const parsed = JSON.parse(raw);
      // backfill any missing keys for forward-compat
      return Object.assign(defaultState(), parsed);
    } catch (e) { return defaultState(); }
  }
  function saveState(s) { localStorage.setItem(STATE_KEY, JSON.stringify(s)); }

  const MODULES_DESC = 'RD-1 React JS · RD-2 Power BI · RD-3 AI/ML using Python · Capstone Projects';

  function isUnlocked(moduleId, s) {
    if (moduleId === 'rd1') return true;
    if (moduleId === 'rd2') return s.rd1.done;
    if (moduleId === 'rd3') return s.rd2.done;
    if (moduleId === 'projects') return s.rd3.done;
    return false;
  }
  function allComplete(s) { return s.rd1.done && s.rd2.done && s.rd3.done && s.projects.done; }
  function completedCount(s) { return [s.rd1.done, s.rd2.done, s.rd3.done, s.projects.done].filter(Boolean).length; }

  /* ---------------- Certificate lifecycle (backend-driven) ---------------- */
  async function fetchCertStatus() {
    try {
      const r = await fetch(`/api/certificate/status/${encodeURIComponent(user.id)}`);
      if (!r.ok) throw new Error('status ' + r.status);
      return await r.json();
    } catch (err) {
      console.error('Could not reach certificate API:', err.message);
      return { status: 'unreachable' };
    }
  }

  async function requestCertificateBackend() {
    try {
      const r = await fetch('/api/certificate/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, name: user.name, email: user.email, modules: MODULES_DESC })
      });
      const record = await r.json();
      if (!r.ok) { CN.toast(record.error || 'Could not request certificate.'); return; }
      CN.toast('Certificate requested — Make.com will email it to ' + user.email + ' within 24 hours.');
      renderOverview();
    } catch (err) {
      CN.toast('Could not reach the server. Is the Node app running?');
    }
  }

  async function devDeliverBackend() {
    try {
      const r = await fetch('/api/certificate/dev-deliver', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id })
      });
      if (!r.ok) { const e = await r.json(); CN.toast(e.error || 'Dev delivery failed.'); return; }
      renderOverview();
    } catch (err) {
      CN.toast('Could not reach the server.');
    }
  }

  function openModuleNotesPdf(mod) {
    if (!window.jspdf || !window.jspdf.jsPDF) {
      CN.toast('PDF library still loading — try again in a moment.');
      return;
    }
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const marginX = 56;
    let y = 70;

    doc.setFont('helvetica', 'bold'); doc.setFontSize(20);
    doc.setTextColor(20, 24, 40);
    doc.text(`${mod.code} · ${mod.title}`, marginX, y);
    y += 26;

    doc.setFont('helvetica', 'normal'); doc.setFontSize(11);
    doc.setTextColor(90, 96, 120);
    doc.text('Campus Nexus AI — Internship Program notes', marginX, y);
    y += 14;
    const hrs = sumDuration(mod.courses);
    doc.text(`${mod.courses.length} courses · ${fmtHrs(hrs)} total · generated ${new Date().toLocaleDateString()}`, marginX, y);
    y += 30;

    doc.setDrawColor(210, 214, 230);
    doc.line(marginX, y, 540, y);
    y += 26;

    mod.courses.forEach((c, i) => {
      if (y > 760) { doc.addPage(); y = 70; }
      doc.setFont('helvetica', 'bold'); doc.setFontSize(13);
      doc.setTextColor(30, 34, 54);
      doc.text(`${i + 1}. ${c.title}  (${fmtHrs(c.duration)})`, marginX, y);
      y += 18;
      doc.setFont('helvetica', 'normal'); doc.setFontSize(11);
      doc.setTextColor(80, 86, 110);
      const lines = doc.splitTextToSize(c.desc, 480);
      doc.text(lines, marginX, y);
      y += lines.length * 14 + 16;
    });

    y += 6;
    doc.setDrawColor(210, 214, 230);
    doc.line(marginX, y, 540, y);
    y += 22;
    doc.setFont('helvetica', 'normal'); doc.setFontSize(11);
    doc.setTextColor(120, 126, 150);
    doc.text(`Reference video: ${mod.video.title} (${mod.video.channel})`, marginX, y);
    y += 16;
    doc.text(`Watch it on the ${mod.code} page in Campus Nexus AI, or search the title on YouTube.`, marginX, y);

    const blobUrl = doc.output('bloburl');
    window.open(blobUrl, '_blank');
  }

  function fmtCountdown(ms) {
    if (ms <= 0) return '00:00:00';
    const h = Math.floor(ms / 3600000);
    const m = Math.floor((ms % 3600000) / 60000);
    const sec = Math.floor((ms % 60000) / 1000);
    return [h, m, sec].map(n => String(n).padStart(2, '0')).join(':');
  }

  /* ---------------- Views ---------------- */
  function statusPill(moduleId, s) {
    if (moduleId === 'projects') {
      if (s.projects.done) return '<span class="pill" style="border-color:var(--good); color:var(--good)">Submitted</span>';
      if (isUnlocked('projects', s)) return '<span class="pill" style="border-color:var(--career); color:var(--career)">In progress</span>';
      return '<span class="pill">Locked</span>';
    }
    const m = s[moduleId];
    if (m.done) return `<span class="pill" style="border-color:var(--good); color:var(--good)">Completed · ${Math.round(m.score / m.total * 100)}%</span>`;
    if (isUnlocked(moduleId, s)) return '<span class="pill" style="border-color:var(--career); color:var(--career)">In progress</span>';
    return '<span class="pill">🔒 Locked</span>';
  }

  async function renderOverview() {
    view = { mode: 'overview', moduleId: null, qIndex: 0, answers: [] };
    const s2 = getState();
    const doneCount = completedCount(s2);
    const cert = allComplete(s2) ? await fetchCertStatus() : null;

    root.innerHTML = `
      <div class="eyebrow">Internship Program</div>
      <h1 style="margin-bottom:6px">Your internship track, RD by RD.</h1>
      <p style="max-width:640px">Work through three Roadmap Domains — React JS, Power BI, and AI/ML using Python — each capped by a short quiz. Finish all three plus the capstone projects to unlock your completion certificate.</p>

      <div class="card" style="margin:20px 0 30px">
        <div style="display:flex; justify-content:space-between; margin-bottom:8px">
          <strong style="font-size:14.5px">Overall progress</strong>
          <span class="mono" style="font-size:12.5px; color:var(--text-low)">${doneCount}/4 complete</span>
        </div>
        <div class="progress-track"><div class="progress-fill" style="width:${doneCount / 4 * 100}%"></div></div>
      </div>

      <div class="grid grid-4" id="module-cards" style="margin-bottom:36px">
        ${MODULE_ORDER.map(id => {
          if (id === 'projects') {
            const projHrs = sumDuration(CAPSTONE_PROJECTS);
            return `
            <div class="card">
              <span class="tag tag-career">Capstone</span>
              <h3 style="margin-top:14px; font-size:17px">Projects</h3>
              <p style="font-size:13.5px">One hands-on project per track, submitted as a checklist.</p>
              <div class="badge-row" style="margin-top:10px">
                <span class="pill mono">${CAPSTONE_PROJECTS.length} projects</span>
                <span class="pill mono">~${fmtHrs(projHrs)} effort</span>
              </div>
              <div style="margin:10px 0 14px">${statusPill('projects', s2)}</div>
              <button class="btn btn-primary btn-sm" data-open="projects" ${isUnlocked('projects', s2) ? '' : 'disabled'}>
                ${s2.projects.done ? 'Review submissions' : (isUnlocked('projects', s2) ? 'Open projects' : 'Locked')}
              </button>
            </div>`;
          }
          const mod = INTERNSHIP_MODULES[id];
          const unlocked = isUnlocked(id, s2);
          const hrs = sumDuration(mod.courses);
          return `
          <div class="card">
            <span class="tag tag-${mod.tag}">${mod.code}</span>
            <h3 style="margin-top:14px; font-size:17px">${mod.title}</h3>
            <p style="font-size:13.5px">${mod.summary}</p>
            <div class="badge-row" style="margin-top:10px">
              <span class="pill mono">${mod.courses.length} courses</span>
              <span class="pill mono">${fmtHrs(hrs)} course</span>
            </div>
            <div style="margin:10px 0 14px">${statusPill(id, s2)}</div>
            <button class="btn btn-primary btn-sm" data-open="${id}" ${unlocked ? '' : 'disabled'}>
              ${s2[id].done ? 'Review & retake' : (unlocked ? 'Start ' + mod.code : 'Locked')}
            </button>
          </div>`;
        }).join('')}
      </div>

      <div class="card" style="margin-bottom:30px">
        <span class="tag tag-signal">Certificate</span>
        <h3 style="margin-top:14px">Program completion certificate</h3>
        ${renderCertificateBlock(s2, cert)}
      </div>
    `;

    root.querySelectorAll('button[data-open]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.open;
        if (id === 'projects') openProjects(); else openModule(id);
      });
    });
    const reqBtn = root.querySelector('#req-cert-btn');
    if (reqBtn) reqBtn.addEventListener('click', requestCertificateBackend);
    const skipBtn = root.querySelector('#dev-skip-btn');
    if (skipBtn) skipBtn.addEventListener('click', devDeliverBackend);

    startTicker(cert);
  }

  function renderCertificateBlock(s, cert) {
    const remaining = [
      !s.rd1.done && 'RD-1 React JS', !s.rd2.done && 'RD-2 Power BI',
      !s.rd3.done && 'RD-3 AI/ML using Python', !s.projects.done && 'Capstone Projects'
    ].filter(Boolean);

    if (!allComplete(s)) {
      return `<p style="margin-bottom:0">Complete ${remaining.join(', ')} to unlock certificate generation.</p>`;
    }
    if (!cert || cert.status === 'unreachable') {
      return `<p style="margin-bottom:0; color:var(--bad)">Couldn't reach the certificate service. Make sure the Node app is running (<code>npm start</code>) and try refreshing this page.</p>`;
    }
    if (cert.status === 'none') {
      return `
        <p>All modules complete — nice work. Request your certificate and it'll be generated and emailed to <strong style="color:var(--text-hi)">${user.email}</strong> within 24 hours, sent automatically via Make.com.</p>
        <button class="btn btn-primary" id="req-cert-btn">Request certificate</button>
      `;
    }
    if (cert.status === 'requested') {
      const remainMs = cert.deliverAt - Date.now();
      return `
        <p>Your certificate request is in (ID <span class="mono">${cert.certId}</span>). A Make.com scenario will email it from our Gmail account to <strong style="color:var(--text-hi)">${user.email}</strong> ${remainMs > 0 ? 'within' : 'in about'} <strong style="color:var(--text-hi)">24 hours</strong> of request.</p>
        <div class="callout signal" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:14px; margin:12px 0">
          <div>
            <div class="mono" style="font-size:12px; color:var(--text-low); text-transform:uppercase; letter-spacing:.06em">Estimated ready in</div>
            <div id="cert-countdown" class="mono" style="font-size:26px; color:var(--text-hi)">${fmtCountdown(remainMs)}</div>
          </div>
          <span class="pill" style="border-color:var(--career); color:var(--career)">Generating</span>
        </div>
        <p style="font-size:12.5px; color:var(--text-low); margin-bottom:0">
          The certificate PDF is already generated and hosted at <a href="${cert.certificateUrl}" target="_blank">${cert.certificateUrl}</a> — Make.com will fetch it and attach it to the email it sends.
          ${cert.devMode ? '<button class="btn btn-ghost btn-sm" id="dev-skip-btn" style="margin-top:10px" title="Testing helper only — marks the record delivered without waiting for the real Make.com scenario">⏩ Mark delivered (dev/testing only)</button>' : ''}
        </p>
      `;
    }
    // delivered
    return `
      <p>🎓 Delivered on ${new Date(cert.deliveredAt).toLocaleString()} to <strong style="color:var(--text-hi)">${user.email}</strong> via Make.com. Certificate ID: <span class="mono">${cert.certId}</span>.</p>
      <a class="btn btn-primary btn-sm" href="${cert.certificateUrl}" target="_blank">Download certificate (PDF)</a>
    `;
  }

  function startTicker(cert) {
    if (tickHandle) clearInterval(tickHandle);
    if (!cert || cert.status !== 'requested') return;
    tickHandle = setInterval(() => {
      const el = document.getElementById('cert-countdown');
      if (el) el.textContent = fmtCountdown(cert.deliverAt - Date.now());
    }, 1000);
    // Poll the backend every 20s so a real Make.com delivery (or dev button elsewhere) shows up without a manual refresh
    const pollHandle = setInterval(async () => {
      const latest = await fetchCertStatus();
      if (latest.status && latest.status !== 'requested') {
        clearInterval(pollHandle);
        renderOverview();
      }
    }, 20000);
  }

  /* ---------------- Module content + quiz ---------------- */
  function openModule(id) {
    view = { mode: 'content', moduleId: id, qIndex: 0, answers: [] };
    renderContent();
  }

  function renderContent() {
    const mod = INTERNSHIP_MODULES[view.moduleId];
    const s = getState();
    const m = s[view.moduleId];
    const hrs = sumDuration(mod.courses);
    root.innerHTML = `
      <div class="eyebrow">${mod.code} · ${mod.title}</div>
      <h1 style="margin-bottom:10px">${mod.summary}</h1>
      <div class="badge-row">
        <span class="pill mono">${mod.courses.length} courses</span>
        <span class="pill mono">${fmtHrs(hrs)} course</span>
      </div>

      <div class="card" style="margin:20px 0 24px; padding:0; overflow:hidden">
        <div style="position:relative; padding-top:56.25%; background:#000">
          <iframe src="https://www.youtube.com/embed/${mod.video.id}" title="${mod.video.title}"
            style="position:absolute; top:0; left:0; width:100%; height:100%; border:0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        </div>
        <div style="padding:16px 20px">
          <strong style="font-size:14.5px">${mod.video.title}</strong>
          <p style="margin:4px 0 0; font-size:12.5px; color:var(--text-low)">${mod.video.channel} · reference video for this Roadmap Domain</p>
        </div>
      </div>

      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px; flex-wrap:wrap; gap:10px">
        <p style="max-width:560px; margin-bottom:0">Review the courses below, then take the RD quiz. A score of ${PASS_PCT}% or higher marks this Roadmap Domain complete.</p>
        <button class="btn btn-ghost btn-sm" id="view-pdf">📄 View PDF notes</button>
      </div>

      <div class="grid grid-2" style="margin:0 0 30px">
        ${mod.courses.map((t, i) => `
          <div class="card">
            <div style="display:flex; justify-content:space-between; gap:10px">
              <h3 style="font-size:15.5px; margin-bottom:6px">${i + 1}. ${t.title}</h3>
              <span class="pill mono" style="white-space:nowrap">${fmtHrs(t.duration)}</span>
            </div>
            <p style="font-size:13.5px; margin-bottom:0">${t.desc}</p>
          </div>
        `).join('')}
      </div>
      ${m.done ? `<p style="font-size:13.5px">You already passed this quiz with <strong style="color:var(--good)">${m.score}/${m.total}</strong>. You can retake it any time.</p>` : ''}
      <div style="display:flex; gap:12px; flex-wrap:wrap">
        <button class="btn btn-primary" id="start-quiz">${m.done ? 'Retake the ' + mod.code + ' quiz' : 'Take the ' + mod.code + ' quiz'}</button>
        <button class="btn btn-ghost" id="back-overview">Back to internship</button>
      </div>
    `;
    document.getElementById('start-quiz').addEventListener('click', () => startQuiz(view.moduleId));
    document.getElementById('back-overview').addEventListener('click', renderOverview);
    document.getElementById('view-pdf').addEventListener('click', () => openModuleNotesPdf(mod));
  }

  function startQuiz(id) {
    view = { mode: 'quiz', moduleId: id, qIndex: 0, answers: [] };
    renderQuiz();
  }

  function renderQuiz() {
    const mod = INTERNSHIP_MODULES[view.moduleId];
    const q = mod.quiz[view.qIndex];
    const selected = view.answers[view.qIndex];
    const locked = selected !== undefined;

    root.innerHTML = `
      <div class="eyebrow">${mod.code} · ${mod.title} quiz</div>
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px">
        <h2 style="margin:0">Question ${view.qIndex + 1} of ${mod.quiz.length}</h2>
        <span class="mono" style="color:var(--text-low); font-size:13px">${view.answers.filter(a => a !== undefined).length}/${mod.quiz.length} answered</span>
      </div>
      <div class="progress-track" style="margin-bottom:26px"><div class="progress-fill" style="width:${(view.qIndex) / mod.quiz.length * 100}%"></div></div>
      <div class="card" style="max-width:680px">
        <h3 style="font-size:18px">${q.q}</h3>
        <div style="margin-top:18px">
          ${q.options.map((opt, i) => {
            let cls = 'quiz-option';
            if (locked) {
              if (i === q.correct) cls += ' correct';
              else if (i === selected) cls += ' incorrect';
            }
            return `<div class="${cls}" data-opt="${i}">
              <span class="opt-key mono">${String.fromCharCode(65 + i)}</span>
              <span>${opt}</span>
            </div>`;
          }).join('')}
        </div>
        ${locked ? `<p style="margin-top:14px; font-size:13.5px; color:${selected === q.correct ? 'var(--good)' : 'var(--bad)'}">
            ${selected === q.correct ? 'Correct.' : 'Not quite — the correct answer is highlighted above.'}
          </p>` : ''}
        <div style="display:flex; justify-content:space-between; margin-top:22px">
          <button class="btn btn-ghost btn-sm" id="quiz-exit">Exit quiz</button>
          <button class="btn btn-primary btn-sm" id="quiz-next" ${locked ? '' : 'disabled'}>
            ${view.qIndex === mod.quiz.length - 1 ? 'See results' : 'Next question'}
          </button>
        </div>
      </div>
    `;

    if (!locked) {
      root.querySelectorAll('.quiz-option').forEach(el => {
        el.addEventListener('click', () => {
          view.answers[view.qIndex] = +el.dataset.opt;
          renderQuiz();
        });
      });
    }
    document.getElementById('quiz-exit').addEventListener('click', () => openModule(view.moduleId));
    document.getElementById('quiz-next').addEventListener('click', () => {
      if (view.qIndex === mod.quiz.length - 1) finishQuiz();
      else { view.qIndex++; renderQuiz(); }
    });
  }

  function finishQuiz() {
    const id = view.moduleId;
    const mod = INTERNSHIP_MODULES[id];
    const score = view.answers.reduce((sum, a, i) => sum + (a === mod.quiz[i].correct ? 1 : 0), 0);
    const total = mod.quiz.length;
    const pct = Math.round(score / total * 100);
    const passed = pct >= PASS_PCT;

    const s = getState();
    s[id].attempts += 1;
    if (passed) {
      s[id].done = true; s[id].score = score; s[id].total = total; s[id].completedAt = Date.now();
    }
    saveState(s);

    // also log to the shared quiz history so it shows up on the dashboard
    const histKey = CN.ns('cn_quiz_history', user.id);
    const hist = JSON.parse(localStorage.getItem(histKey) || '[]');
    hist.push({ topic: `Internship ${mod.code} · ${mod.title}`, score, total, date: new Date().toISOString() });
    localStorage.setItem(histKey, JSON.stringify(hist));

    root.innerHTML = `
      <div class="eyebrow">${mod.code} · ${mod.title} · results</div>
      <h1 style="margin-bottom:16px">You scored ${score}/${total}</h1>
      <div class="card" style="max-width:520px; margin-bottom:28px">
        <div class="progress-track" style="margin-bottom:14px"><div class="progress-fill" style="width:${pct}%"></div></div>
        <p style="margin-bottom:0">${passed ? `Passed — ${mod.code} is now marked complete.` : `You need ${PASS_PCT}% to pass. Review the topics and try again.`}</p>
      </div>
      <h3 style="margin-bottom:14px">Review your answers</h3>
      ${mod.quiz.map((q, i) => {
        const correct = view.answers[i] === q.correct;
        return `
        <div class="card" style="margin-bottom:14px">
          <div style="display:flex; justify-content:space-between; gap:10px">
            <strong style="font-size:14.5px">${i + 1}. ${q.q}</strong>
            <span class="pill" style="border-color:${correct ? 'var(--good)' : 'var(--bad)'}; color:${correct ? 'var(--good)' : 'var(--bad)'}">${correct ? 'Correct' : 'Missed'}</span>
          </div>
          <p style="margin-top:8px; margin-bottom:0; font-size:13.5px">Correct answer: <strong style="color:var(--text-hi)">${q.options[q.correct]}</strong></p>
        </div>`;
      }).join('')}
      <div style="display:flex; gap:12px; margin-top:10px; flex-wrap:wrap">
        ${!passed ? `<button class="btn btn-primary" id="retake">Retake this quiz</button>` : ''}
        <button class="btn btn-ghost" id="back-overview2">Back to internship</button>
      </div>
    `;
    const retakeBtn = document.getElementById('retake');
    if (retakeBtn) retakeBtn.addEventListener('click', () => startQuiz(id));
    document.getElementById('back-overview2').addEventListener('click', renderOverview);
  }

  /* ---------------- Projects ---------------- */
  function openProjects() {
    view = { mode: 'projects', moduleId: 'projects', qIndex: 0, answers: [] };
    renderProjects();
  }

  function renderProjects() {
    const s = getState();
    root.innerHTML = `
      <div class="eyebrow">Capstone · Projects</div>
      <h1 style="margin-bottom:10px">Ship one project per track.</h1>
      <p style="max-width:620px">Build each project, then mark it submitted below. Once all three are checked, submit the module to unlock your certificate request.</p>
      <div class="grid grid-3" style="margin:24px 0 24px">
        ${CAPSTONE_PROJECTS.map(p => `
          <div class="card">
            <span class="tag tag-learn">${p.track}</span>
            <h3 style="margin-top:14px; font-size:16px">${p.title}</h3>
            <p style="font-size:13.5px">${p.brief}</p>
            <span class="pill mono">~${fmtHrs(p.duration)} effort</span>
            <label style="display:flex; align-items:center; gap:10px; margin-top:14px; cursor:pointer">
              <input type="checkbox" data-proj="${p.id}" ${s.projects.submissions[p.id] ? 'checked' : ''} ${s.projects.done ? 'disabled' : ''} style="width:17px; height:17px; accent-color:var(--good)">
              <span style="font-size:13.5px">Mark as submitted</span>
            </label>
          </div>
        `).join('')}
      </div>
      <div style="display:flex; gap:12px; flex-wrap:wrap">
        <button class="btn btn-primary" id="submit-projects" ${s.projects.done ? 'disabled' : ''}>
          ${s.projects.done ? 'Projects module complete' : 'Submit projects module'}
        </button>
        <button class="btn btn-ghost" id="back-overview3">Back to internship</button>
      </div>
    `;
    root.querySelectorAll('input[data-proj]').forEach(cb => {
      cb.addEventListener('change', () => {
        const st = getState();
        st.projects.submissions[cb.dataset.proj] = cb.checked;
        saveState(st);
        const allChecked = CAPSTONE_PROJECTS.every(p => st.projects.submissions[p.id]);
        document.getElementById('submit-projects').disabled = !allChecked || st.projects.done;
      });
    });
    const allChecked = CAPSTONE_PROJECTS.every(p => s.projects.submissions[p.id]);
    document.getElementById('submit-projects').disabled = !allChecked || s.projects.done;
    document.getElementById('submit-projects').addEventListener('click', () => {
      const st = getState();
      if (!CAPSTONE_PROJECTS.every(p => st.projects.submissions[p.id])) return;
      st.projects.done = true; st.projects.completedAt = Date.now();
      saveState(st);
      CN.toast('Projects module submitted.');
      renderOverview();
    });
    document.getElementById('back-overview3').addEventListener('click', renderOverview);
  }

  function render() {
    if (tickHandle) { clearInterval(tickHandle); tickHandle = null; }
    if (view.mode === 'overview') renderOverview();
    else if (view.mode === 'content') renderContent();
    else if (view.mode === 'quiz') renderQuiz();
    else if (view.mode === 'projects') renderProjects();
  }

  renderOverview();
});
