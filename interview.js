/* ============================================================
   CAMPUS NEXUS AI — interview.js
   ============================================================ */

const INTERVIEW_BANK = {
  'Software Engineer': {
    tag:'learn',
    questions:[
      {q:'Walk me through how you would design a URL shortener.', type:'technical', tips:'Cover requirements, data model, hashing/ID generation, and how you\'d handle scale.', keywords:['scale','database','hash','cache','api']},
      {q:'Explain the difference between a stack and a queue, and give a real use case for each.', type:'technical', tips:'Be concrete — name an actual scenario, not just the definition.', keywords:['lifo','fifo','stack','queue']},
      {q:'Tell me about a time you disagreed with a teammate on a technical decision.', type:'behavioral', tips:'Use STAR: Situation, Task, Action, Result. Focus on how you resolved it, not who was "right."', keywords:['situation','result','decided','outcome']},
      {q:'How do you approach debugging a production issue you can\'t reproduce locally?', type:'technical', tips:'Mention logs, monitoring, reproducing conditions, and isolating variables.', keywords:['logs','monitor','reproduce','isolate']},
      {q:'Describe a project you\'re proud of and your specific contribution to it.', type:'behavioral', tips:'Be specific about your role — avoid "we" when the interviewer is asking about you.', keywords:['i built','i led','result','impact']}
    ]
  },
  'Data Analyst': {
    tag:'signal',
    questions:[
      {q:'How would you investigate a sudden drop in a key metric?', type:'technical', tips:'Talk through segmenting the data, checking for data issues, and forming hypotheses before jumping to conclusions.', keywords:['segment','hypothesis','data quality','trend']},
      {q:'Explain a time your analysis changed a business decision.', type:'behavioral', tips:'Quantify the impact and be clear about your specific role in the analysis.', keywords:['impact','decision','result','recommend']},
      {q:'What\'s the difference between a left join and an inner join, and when would you use each?', type:'technical', tips:'Give a concrete example table scenario, not just the textbook definition.', keywords:['join','null','match','table']},
      {q:'How do you communicate a complex finding to a non-technical stakeholder?', type:'behavioral', tips:'Emphasize simplifying without dumbing down, and leading with the "so what."', keywords:['simplify','visual','stakeholder','clear']}
    ]
  },
  'Product Manager': {
    tag:'career',
    questions:[
      {q:'How would you prioritize a backlog with limited engineering resources?', type:'technical', tips:'Reference a framework (RICE, ICE, or value vs. effort) and explain your reasoning, not just the framework name.', keywords:['prioritize','impact','effort','framework']},
      {q:'Tell me about a product decision that didn\'t go as planned.', type:'behavioral', tips:'Focus on what you learned and changed afterward — this is as much about growth as the decision itself.', keywords:['learned','changed','result','mistake']},
      {q:'How do you decide when a feature is "done" and ready to ship?', type:'technical', tips:'Mention success metrics, edge cases, and how you\'d validate before and after launch.', keywords:['metric','launch','validate','ship']},
      {q:'Describe how you\'d gather requirements for a feature with no existing user research.', type:'technical', tips:'Talk through lightweight discovery methods you could run quickly.', keywords:['interview','research','assumption','test']}
    ]
  },
  'HR / Behavioral (any role)': {
    tag:'career',
    questions:[
      {q:'Tell me about yourself.', type:'behavioral', tips:'Keep it under 90 seconds: past (relevant background) → present (what you do now) → future (why this role).', keywords:['background','currently','looking for']},
      {q:'What is your greatest weakness?', type:'behavioral', tips:'Pick something real, show self-awareness, and describe what you\'re actively doing about it.', keywords:['working on','improve','learned']},
      {q:'Describe a time you had to meet a tight deadline.', type:'behavioral', tips:'Use STAR and be specific about the actions you took to make the deadline.', keywords:['deadline','prioritized','result','completed']},
      {q:'Why do you want to work here?', type:'behavioral', tips:'Reference something specific about the company or role — generic answers are the most common miss here.', keywords:['because','specifically','excites me','mission']},
      {q:'Tell me about a time you failed and what you learned.', type:'behavioral', tips:'Own the failure honestly, then pivot quickly to the lesson and how you applied it since.', keywords:['failed','learned','since then','changed']}
    ]
  },
  'Marketing': {
    tag:'career',
    questions:[
      {q:'How would you measure the success of a campaign?', type:'technical', tips:'Name specific metrics tied to the campaign\'s actual goal (awareness vs. conversion vs. retention).', keywords:['metric','conversion','roi','goal']},
      {q:'Tell me about a campaign that underperformed and what you did next.', type:'behavioral', tips:'Show the diagnosis process, not just the fix.', keywords:['underperformed','diagnosed','changed','result']},
      {q:'How do you decide which channel to prioritize for a new product launch?', type:'technical', tips:'Reference audience fit, cost, and how you\'d test small before scaling.', keywords:['audience','test','channel','budget']}
    ]
  }
};

document.addEventListener('DOMContentLoaded', function(){
  const user = CN.currentUser();
  const historyKey = CN.ns('cn_interview', user ? user.id : 'guest');
  const root = document.getElementById('iv-root');

  let state = {mode:'picker'};

  function renderPicker(){
    state = {mode:'picker'};
    root.innerHTML = `
      <div class="eyebrow">Interview Prep</div>
      <h1 style="margin-bottom:6px">Practice the questions before they're asked for real.</h1>
      <p style="max-width:620px; margin-bottom:30px">Browse role-specific questions with tips, or run a timed mock interview and get structured feedback on each answer.</p>
      <div class="grid grid-3">
        ${Object.keys(INTERVIEW_BANK).map(role=>{
          const r = INTERVIEW_BANK[role];
          return `
          <div class="card">
            <span class="tag tag-${r.tag}">${r.questions.length} questions</span>
            <h3 style="margin-top:14px; font-size:17px">${role}</h3>
            <div style="display:flex; gap:8px; margin-top:14px">
              <button class="btn btn-ghost btn-sm" data-browse="${role}">Browse</button>
              <button class="btn btn-primary btn-sm" data-mock="${role}">Mock interview</button>
            </div>
          </div>`;
        }).join('')}
      </div>
    `;
    root.querySelectorAll('button[data-browse]').forEach(b=> b.addEventListener('click', ()=> renderBrowse(b.dataset.browse)));
    root.querySelectorAll('button[data-mock]').forEach(b=> b.addEventListener('click', ()=> startMock(b.dataset.mock)));
  }

  function renderBrowse(role){
    const bank = INTERVIEW_BANK[role];
    root.innerHTML = `
      <div class="eyebrow">${role}</div>
      <h1 style="margin-bottom:22px">Question bank</h1>
      ${bank.questions.map((q,i)=>`
        <div class="card" style="margin-bottom:14px">
          <span class="pill">${q.type === 'behavioral' ? 'Behavioral' : 'Technical'}</span>
          <h3 style="margin-top:12px; font-size:16px">${i+1}. ${q.q}</h3>
          <p style="margin-bottom:0; font-size:13.5px"><strong style="color:var(--text-hi)">Tip:</strong> ${q.tips}</p>
        </div>
      `).join('')}
      <div style="display:flex; gap:12px; margin-top:6px">
        <button class="btn btn-primary" id="to-mock">Run a mock interview instead</button>
        <button class="btn btn-ghost" id="back">Back to roles</button>
      </div>
    `;
    document.getElementById('back').addEventListener('click', renderPicker);
    document.getElementById('to-mock').addEventListener('click', ()=> startMock(role));
  }

  function startMock(role){
    state = {mode:'mock', role, qIndex:0, results:[]};
    renderMock();
  }

  function scoreAnswer(answer, q){
    const words = answer.trim().split(/\s+/).filter(Boolean);
    const wc = words.length;
    const lower = answer.toLowerCase();
    const feedback = [];
    let score = 0;

    if(wc === 0){
      return {score:0, feedback:['No answer was given — try to always leave the interviewer with something concrete.']};
    }
    if(wc < 15){
      feedback.push('This answer is quite brief — aim to add specific detail or an example.');
    } else if(wc > 220){
      feedback.push('This is a long answer — practice trimming to the most relevant points so you don\'t lose the interviewer.');
    } else {
      score += 2;
      feedback.push('Good length — detailed without rambling.');
    }

    const hitKeywords = (q.keywords||[]).filter(k=>lower.includes(k));
    if(hitKeywords.length >= Math.ceil((q.keywords||[]).length/2)){
      score += 2;
      feedback.push('Your answer touches the core ideas this question is looking for.');
    } else {
      feedback.push('Consider explicitly addressing: ' + (q.keywords||[]).slice(0,3).join(', ') + '.');
    }

    if(q.type === 'behavioral'){
      const hasStructure = /(situation|when i|task|i had to|action|i did|so i|result|as a result|which led)/i.test(answer);
      if(hasStructure){
        score += 1;
        feedback.push('You show clear structure — that reads like STAR (Situation, Task, Action, Result).');
      } else {
        feedback.push('Try shaping this with STAR: what was the situation, what did you do, what was the result?');
      }
    } else {
      const hasReasoning = /(because|so that|which means|this way|therefore|trade-?off)/i.test(answer);
      if(hasReasoning){
        score += 1;
        feedback.push('You explain your reasoning, not just your conclusion — that\'s exactly what technical interviewers look for.');
      } else {
        feedback.push('Try narrating your reasoning ("I chose X because…") rather than just stating the final answer.');
      }
    }
    return {score: Math.min(score,5), feedback};
  }

  function renderMock(){
    const bank = INTERVIEW_BANK[state.role];
    const q = bank.questions[state.qIndex];
    root.innerHTML = `
      <div class="eyebrow">${state.role} · Mock interview</div>
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px">
        <h2 style="margin:0">Question ${state.qIndex+1} of ${bank.questions.length}</h2>
        <span class="pill">${q.type === 'behavioral' ? 'Behavioral' : 'Technical'}</span>
      </div>
      <div class="progress-track" style="margin-bottom:26px"><div class="progress-fill" style="width:${state.qIndex/bank.questions.length*100}%"></div></div>
      <div class="card" style="max-width:700px">
        <h3 style="font-size:18px">${q.q}</h3>
        <div class="field" style="margin-top:16px">
          <label for="answer">Your answer</label>
          <textarea id="answer" rows="6" placeholder="Type your answer as if you were speaking it out loud…"></textarea>
        </div>
        <div id="feedback-area"></div>
        <div style="display:flex; justify-content:space-between; margin-top:18px">
          <button class="btn btn-ghost btn-sm" id="iv-exit">Exit</button>
          <div style="display:flex; gap:10px">
            <button class="btn btn-ghost btn-sm" id="iv-submit">Get feedback</button>
            <button class="btn btn-primary btn-sm" id="iv-next" disabled>${state.qIndex===bank.questions.length-1 ? 'Finish session' : 'Next question'}</button>
          </div>
        </div>
      </div>
    `;
    document.getElementById('iv-exit').addEventListener('click', renderPicker);
    document.getElementById('iv-submit').addEventListener('click', ()=>{
      const answer = document.getElementById('answer').value;
      const result = scoreAnswer(answer, q);
      state.results[state.qIndex] = {question:q.q, answer, score:result.score};
      const area = document.getElementById('feedback-area');
      area.innerHTML = `
        <div class="callout signal" style="margin-top:16px">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px">
            <strong>Feedback</strong>
            <span class="mono" style="font-size:13px; color:var(--signal)">${result.score}/5</span>
          </div>
          <ul style="margin:0; padding-left:18px; font-size:13.5px; color:var(--text-mid)">
            ${result.feedback.map(f=>`<li style="margin-bottom:6px">${f}</li>`).join('')}
          </ul>
        </div>`;
      document.getElementById('iv-next').disabled = false;
    });
    document.getElementById('iv-next').addEventListener('click', ()=>{
      if(state.qIndex === bank.questions.length-1){
        finishMock();
      } else {
        state.qIndex++;
        renderMock();
      }
    });
  }

  function finishMock(){
    const bank = INTERVIEW_BANK[state.role];
    const avg = state.results.reduce((s,r)=>s+(r?r.score:0),0)/state.results.length;
    const hist = JSON.parse(localStorage.getItem(historyKey) || '[]');
    hist.push({role:state.role, date:new Date().toISOString(), questionsAnswered:state.results.length, avgScore: Math.round(avg*10)/10});
    localStorage.setItem(historyKey, JSON.stringify(hist));

    root.innerHTML = `
      <div class="eyebrow">${state.role} · session complete</div>
      <h1 style="margin-bottom:16px">Average score: ${Math.round(avg*10)/10}/5</h1>
      ${state.results.map((r,i)=>`
        <div class="card" style="margin-bottom:14px">
          <div style="display:flex; justify-content:space-between; gap:10px">
            <strong style="font-size:14.5px">${i+1}. ${r.question}</strong>
            <span class="pill">${r.score}/5</span>
          </div>
        </div>
      `).join('')}
      <div style="display:flex; gap:12px; margin-top:10px">
        <button class="btn btn-primary" id="retake">Run another mock session</button>
        <button class="btn btn-ghost" id="back-picker">Back to roles</button>
        ${user ? '<a href="dashboard.html" class="btn btn-ghost">View dashboard</a>' : '<a href="signup.html" class="btn btn-ghost">Sign up to save progress</a>'}
      </div>
    `;
    document.getElementById('retake').addEventListener('click', ()=> startMock(state.role));
    document.getElementById('back-picker').addEventListener('click', renderPicker);
  }

  renderPicker();
});
