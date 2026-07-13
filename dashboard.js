document.addEventListener('DOMContentLoaded', function(){
  const user = CN.requireAuth();
  if(!user) return;

  const root = document.getElementById('dash-root');
  const quizHistory = JSON.parse(localStorage.getItem(CN.ns('cn_quiz_history', user.id)) || '[]');
  const roadmaps = JSON.parse(localStorage.getItem(CN.ns('cn_roadmaps', user.id)) || '[]');
  const interviews = JSON.parse(localStorage.getItem(CN.ns('cn_interview', user.id)) || '[]');
  const chat = JSON.parse(localStorage.getItem(CN.ns('cn_chat', user.id)) || '[]');
  const internRaw = localStorage.getItem(CN.ns('cn_internship', user.id));
  const intern = internRaw ? JSON.parse(internRaw) : null;
  const internDone = intern ? [intern.rd1.done, intern.rd2.done, intern.rd3.done, intern.projects.done].filter(Boolean).length : 0;
  const certStatus = intern ? intern.certificate.status : 'locked';
  const certLabel = { locked: 'Not eligible yet', available: 'Ready to request', pending: 'Generating…', delivered: 'Delivered ✓' }[certStatus] || 'Not eligible yet';

  const avgScore = quizHistory.length
    ? Math.round(quizHistory.reduce((s,q)=>s+(q.score/q.total*100),0)/quizHistory.length)
    : null;

  function roadmapProgress(rm){
    const all = rm.phases.flatMap(p=>p.tasks);
    const done = all.filter(t=>t.done).length;
    return all.length ? Math.round(done/all.length*100) : 0;
  }

  root.innerHTML = `
    <div class="eyebrow">Your nexus</div>
    <h1>Welcome back, ${user.name.split(' ')[0]}.</h1>
    <p style="max-width:560px">You're set up as <strong style="color:var(--text-hi)">${user.role}</strong>. Here's everything you've built so far, in one place.</p>

    <div class="grid grid-4" style="margin:28px 0 40px">
      <div class="card"><div class="pill mono">Roadmaps</div><div style="font-family:var(--f-display); font-size:30px; margin-top:12px">${roadmaps.length}</div><p style="font-size:13px; margin-top:4px">active paths</p></div>
      <div class="card"><div class="pill mono">Quizzes</div><div style="font-family:var(--f-display); font-size:30px; margin-top:12px">${quizHistory.length}</div><p style="font-size:13px; margin-top:4px">${avgScore!==null ? avgScore+'% avg score' : 'none taken yet'}</p></div>
      <div class="card"><div class="pill mono">Mock interviews</div><div style="font-family:var(--f-display); font-size:30px; margin-top:12px">${interviews.length}</div><p style="font-size:13px; margin-top:4px">sessions logged</p></div>
      <div class="card"><div class="pill mono">AI Mentor</div><div style="font-family:var(--f-display); font-size:30px; margin-top:12px">${chat.length}</div><p style="font-size:13px; margin-top:4px">messages exchanged</p></div>
    </div>

    <div class="card" style="margin-bottom:22px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:18px">
      <div>
        <span class="tag tag-signal">Internship</span>
        <h3 style="margin-top:12px">RD-1 · RD-2 · RD-3 · Projects</h3>
        <p style="margin-bottom:0">${internDone}/4 modules complete · Certificate: ${certLabel}</p>
      </div>
      <a href="internship.html" class="btn btn-primary">Open internship</a>
    </div>

    <div class="grid grid-2" style="align-items:start">
      <div class="card">
        <h3>Your roadmaps</h3>
        ${roadmaps.length===0 ? `
          <div class="empty-state">
            <div class="glyph">🧭</div>
            <p>No roadmap yet. Pick a destination and we'll lay out the path.</p>
            <a href="roadmaps.html" class="btn btn-primary btn-sm">Build a roadmap</a>
          </div>` : roadmaps.map((rm,i)=>{
            const pct = roadmapProgress(rm);
            return `
            <div style="margin-bottom:20px">
              <div style="display:flex; justify-content:space-between; margin-bottom:8px">
                <strong style="font-size:14.5px">${rm.goal}</strong>
                <span class="mono" style="font-size:12.5px; color:var(--text-low)">${pct}%</span>
              </div>
              <div class="progress-track"><div class="progress-fill" style="width:${pct}%"></div></div>
            </div>`;
          }).join('') + `<a href="roadmaps.html" class="btn btn-ghost btn-sm">Manage roadmaps →</a>`
        }
      </div>

      <div class="card">
        <h3>Recent quiz activity</h3>
        ${quizHistory.length===0 ? `
          <div class="empty-state">
            <div class="glyph">📝</div>
            <p>No quizzes taken yet. A quick one takes about five minutes.</p>
            <a href="quizzes.html" class="btn btn-primary btn-sm">Take a quiz</a>
          </div>` : `
          <table class="data">
            <thead><tr><th>Topic</th><th>Score</th><th>Date</th></tr></thead>
            <tbody>
              ${quizHistory.slice(-5).reverse().map(q=>`
                <tr><td>${q.topic}</td><td>${q.score}/${q.total}</td><td>${new Date(q.date).toLocaleDateString()}</td></tr>
              `).join('')}
            </tbody>
          </table>
          <a href="quizzes.html" class="btn btn-ghost btn-sm" style="margin-top:16px">Take another quiz →</a>`
        }
      </div>
    </div>

    <div class="card" style="margin-top:22px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:18px">
      <div>
        <span class="tag tag-signal">Quick action</span>
        <h3 style="margin-top:12px">Not sure what's next?</h3>
        <p style="margin-bottom:0">Ask the AI Mentor, or retake the career guidance assessment if your goals have shifted.</p>
      </div>
      <div style="display:flex; gap:10px">
        <a href="chatbot.html" class="btn btn-ghost">Open AI Mentor</a>
        <a href="career-guidance.html" class="btn btn-amber">Career Guidance</a>
      </div>
    </div>
  `;
});
