/* ============================================================
   CAMPUS NEXUS AI — career.js
   Short interest/work-style assessment -> weighted category
   scores -> matched career paths with roadmap deep-links.
   ============================================================ */

const CG_QUESTIONS = [
  {
    q:'A new project lands on your desk with no clear plan. What do you do first?',
    options:[
      {text:'Start sketching how the pieces would technically fit together', cat:'technical'},
      {text:'Pull whatever data exists and look for patterns before deciding anything', cat:'analytical'},
      {text:'Imagine a few different directions it could go and how each would look/feel', cat:'creative'},
      {text:'Talk to the people involved to understand what they actually need', cat:'people'}
    ]
  },
  {
    q:'Which of these would you rather spend a free afternoon doing?',
    options:[
      {text:'Building or fixing something with code or tools', cat:'technical'},
      {text:'Digging through a spreadsheet or dataset that\'s been bugging you', cat:'analytical'},
      {text:'Sketching, writing, or redesigning something', cat:'creative'},
      {text:'Catching up with people and hearing what they\'re working on', cat:'people'}
    ]
  },
  {
    q:'In a group project, you naturally end up:',
    options:[
      {text:'Being the one who makes the thing actually work', cat:'technical'},
      {text:'Double-checking the numbers and the logic behind decisions', cat:'analytical'},
      {text:'Shaping how it looks, reads, or feels to the end user', cat:'creative'},
      {text:'Keeping everyone aligned and unblocked', cat:'people'}
    ]
  },
  {
    q:'What kind of feedback do you find most satisfying to receive?',
    options:[
      {text:'"That\'s a clever, well-built solution."', cat:'technical'},
      {text:'"Your analysis actually changed the decision."', cat:'analytical'},
      {text:'"This is genuinely beautiful/compelling work."', cat:'creative'},
      {text:'"You made this so much easier for the team."', cat:'people'}
    ]
  },
  {
    q:'Pick the sentence that sounds most like you:',
    options:[
      {text:'"I like knowing exactly how something works under the hood."', cat:'technical'},
      {text:'"I trust a well-reasoned number more than a strong opinion."', cat:'analytical'},
      {text:'"I care a lot about how something looks and feels."', cat:'creative'},
      {text:'"I get energy from talking things through with people."', cat:'people'}
    ]
  },
  {
    q:'What would frustrate you most in a job?',
    options:[
      {text:'Never getting to actually build anything', cat:'technical'},
      {text:'Decisions made on gut feeling with no data behind them', cat:'analytical'},
      {text:'Zero room for original ideas or design input', cat:'creative'},
      {text:'Working alone with little interaction with others', cat:'people'}
    ]
  }
];

const CAREER_MATCHES = {
  technical: [
    {title:'Full-Stack Developer', desc:'You like making things work end-to-end — from the interface down to the database.', roadmap:'Full-Stack Developer'},
    {title:'AI/ML Engineer', desc:'You\'re drawn to building systems, and increasingly, systems that learn.', roadmap:'AI/ML Engineer'}
  ],
  analytical: [
    {title:'Data Scientist', desc:'You trust evidence over instinct, and you like finding the story inside a dataset.', roadmap:'Data Scientist'},
    {title:'Digital Marketer (analytics-focused)', desc:'You could bring rigor to campaigns most people run on gut feeling.', roadmap:'Digital Marketer'}
  ],
  creative: [
    {title:'UI/UX Designer', desc:'You notice how things look and feel before anyone points it out — that\'s a design instinct.', roadmap:'UI/UX Designer'},
    {title:'Digital Marketer (brand-focused)', desc:'You could shape how a product or brand comes across to the world.', roadmap:'Digital Marketer'}
  ],
  people: [
    {title:'Product Manager', desc:'You naturally align people around a shared goal — that\'s the core of the PM job.', roadmap:'Product Manager'},
    {title:'Digital Marketer', desc:'You understand what moves people, which is most of marketing.', roadmap:'Digital Marketer'}
  ]
};

const CAT_LABELS = {technical:'Builder', analytical:'Analyst', creative:'Creative', people:'Connector'};

document.addEventListener('DOMContentLoaded', function(){
  const root = document.getElementById('cg-root');
  let state = {mode:'intro', qIndex:0, scores:{technical:0, analytical:0, creative:0, people:0}};

  function renderIntro(){
    state = {mode:'intro', qIndex:0, scores:{technical:0, analytical:0, creative:0, people:0}};
    root.innerHTML = `
      <div class="eyebrow">Career Guidance</div>
      <h1 style="margin-bottom:6px">Not sure what you're aiming for? Let's find out.</h1>
      <p style="max-width:600px; margin-bottom:26px">Six quick questions about how you naturally work, not what you think you "should" answer. Takes about two minutes.</p>
      <div class="card" style="max-width:520px">
        <p style="margin-bottom:18px">There are no right answers here — go with your gut on each one.</p>
        <button class="btn btn-primary" id="start-cg">Start assessment</button>
      </div>
    `;
    document.getElementById('start-cg').addEventListener('click', ()=>{
      state.mode = 'quiz';
      renderQuestion();
    });
  }

  function renderQuestion(){
    const q = CG_QUESTIONS[state.qIndex];
    root.innerHTML = `
      <div class="eyebrow">Question ${state.qIndex+1} of ${CG_QUESTIONS.length}</div>
      <div class="progress-track" style="margin-bottom:26px; max-width:600px"><div class="progress-fill" style="width:${state.qIndex/CG_QUESTIONS.length*100}%"></div></div>
      <div class="card" style="max-width:600px">
        <h3 style="font-size:18px">${q.q}</h3>
        <div style="margin-top:16px">
          ${q.options.map((opt,i)=>`
            <div class="quiz-option" data-cat="${opt.cat}">
              <span class="opt-key mono">${String.fromCharCode(65+i)}</span>
              <span>${opt.text}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
    root.querySelectorAll('.quiz-option').forEach(el=>{
      el.addEventListener('click', ()=>{
        state.scores[el.dataset.cat]++;
        if(state.qIndex === CG_QUESTIONS.length-1){
          renderResults();
        } else {
          state.qIndex++;
          renderQuestion();
        }
      });
    });
  }

  function renderResults(){
    const sorted = Object.entries(state.scores).sort((a,b)=>b[1]-a[1]);
    const topCat = sorted[0][0];
    const secondCat = sorted[1][0];
    const matches = CAREER_MATCHES[topCat];
    const secondaryMatches = CAREER_MATCHES[secondCat].filter(m=>!matches.find(x=>x.title===m.title));

    root.innerHTML = `
      <div class="eyebrow">Your results</div>
      <h1 style="margin-bottom:6px">Your strongest lean: <span class="mono" style="color:var(--signal)">${CAT_LABELS[topCat]}</span></h1>
      <p style="max-width:600px; margin-bottom:24px">This isn't a verdict — it's a starting point. Here's how your answers broke down, and paths worth exploring based on it.</p>

      <div class="grid grid-4" style="margin-bottom:36px; max-width:760px">
        ${Object.entries(state.scores).map(([cat,score])=>`
          <div class="card" style="padding:18px; text-align:center">
            <div style="font-family:var(--f-display); font-size:24px">${score}</div>
            <div class="mono" style="font-size:11.5px; color:var(--text-low); text-transform:uppercase; margin-top:4px">${CAT_LABELS[cat]}</div>
          </div>
        `).join('')}
      </div>

      <h3 style="margin-bottom:16px">Recommended for you</h3>
      <div class="grid grid-2" style="margin-bottom:8px">
        ${matches.map(m=>`
          <div class="card">
            <span class="tag tag-signal">Strong match</span>
            <h3 style="margin-top:12px; font-size:17px">${m.title}</h3>
            <p style="font-size:13.5px">${m.desc}</p>
            <a href="roadmaps.html" class="btn btn-primary btn-sm">See roadmap →</a>
          </div>
        `).join('')}
      </div>

      <h3 style="margin:30px 0 16px">Also worth a look</h3>
      <div class="grid grid-2">
        ${secondaryMatches.map(m=>`
          <div class="card">
            <span class="tag tag-career">Secondary match</span>
            <h3 style="margin-top:12px; font-size:17px">${m.title}</h3>
            <p style="font-size:13.5px">${m.desc}</p>
            <a href="roadmaps.html" class="btn btn-ghost btn-sm">See roadmap →</a>
          </div>
        `).join('')}
      </div>

      <div style="display:flex; gap:12px; margin-top:32px">
        <button class="btn btn-ghost" id="retake-cg">Retake assessment</button>
        <a href="chatbot.html" class="btn btn-ghost">Ask the AI Mentor about this</a>
      </div>
    `;
    document.getElementById('retake-cg').addEventListener('click', renderIntro);
  }

  renderIntro();
});
