/* ============================================================
   CAMPUS NEXUS AI — chatbot.js
   A keyword-driven response engine that simulates an AI mentor.
   Organized as topic rules with multiple varied replies each,
   plus a light "memory" of the user's stated goal within session.
   ============================================================ */

(function(){
  const user = CN.currentUser();
  const storeKey = CN.ns('cn_chat', user ? user.id : 'guest');
  let history = JSON.parse(localStorage.getItem(storeKey) || '[]');
  const log = document.getElementById('chat-log');
  const input = document.getElementById('chat-text');
  const sendBtn = document.getElementById('chat-send');

  const RULES = [
    {
      test: /\b(hi|hello|hey|good (morning|evening|afternoon))\b/i,
      replies: [
        `Hey${user ? ' '+user.name.split(' ')[0] : ''}! I'm your AI Mentor. Ask me about roadmaps, interview prep, resumes, quizzes, or just where to start.`,
        `Hello! What's on your mind today — a skill to learn, an interview to prep for, or a decision to make?`
      ]
    },
    {
      test: /\broadmap|learning path|what should i learn|where do i start\b/i,
      replies: [
        `Good roadmaps have four phases: foundations, core skills, applied projects, and job-readiness. Head to the Roadmaps page, pick a destination like "Full-Stack Developer" or "Data Scientist," and I'll lay out milestones you can check off as you go.`,
        `The fastest way to a working roadmap is to name the destination role first — everything else (order, depth, timeline) follows from that. Try the Roadmaps tool and tell it your target role.`
      ]
    },
    {
      test: /\bdata scientist|data science\b/i,
      replies: [
        `For data science, sequence matters: Python + statistics first, then SQL and data wrangling, then core ML (regression, classification, evaluation), then a portfolio project on a real dataset, then interview-specific practice (case studies + SQL rounds). I laid out exactly this on the Roadmaps page under "Data Scientist" — want me to open it?`
      ]
    },
    {
      test: /\binterview|behavioral|technical round|mock interview\b/i,
      replies: [
        `For interviews, split prep into two lanes: technical (practice the actual problem types for the role) and behavioral (use the STAR method — Situation, Task, Action, Result — for every story). Head to Interview Prep to pick a role and run a timed mock round with feedback.`,
        `Biggest lever for interview performance is usually structure, not raw knowledge — answering in a clear shape beats a rambling correct answer. Try a mock session in Interview Prep and I'll score your structure and clarity.`
      ]
    },
    {
      test: /\bresume|cv\b/i,
      replies: [
        `A strong resume leads with impact, not duties: "Reduced page load time by 40% by refactoring the image pipeline" beats "Responsible for performance." Use one page, quantify results wherever you can, and tailor the top third to the specific role. Want me to point you to a roadmap step on this?`
      ]
    },
    {
      test: /\bquiz|test my|assess my skill|practice questions\b/i,
      replies: [
        `Quizzes are the fastest way to find your weak spots before an interviewer does. Head to the Quizzes page — there are focused sets on web development, data science, AI/ML, aptitude, and communication. Results save to your dashboard automatically.`
      ]
    },
    {
      test: /\bnot sure|don'?t know what career|confused about|which career|career fit\b/i,
      replies: [
        `That's exactly what Career Guidance is for — a short assessment on your interests and work style that maps to a shortlist of career paths, each linked to a starter roadmap. Want to try it now?`
      ]
    },
    {
      test: /\boverwhelm|stress|anxious|burnt out|burn ?out|behind\b/i,
      replies: [
        `That's a really common feeling, and it usually means the plan is too big, not that you're behind. Try shrinking your target to the next single milestone on your roadmap, and let the rest wait. If the stress feels bigger than workload, it's worth talking to someone you trust or a counselor, not just working through it alone.`
      ]
    },
    {
      test: /\bskills? (are )?in demand|hot skills|trending skills\b/i,
      replies: [
        `Right now, consistently in-demand skills span: applied AI/ML tooling, data analysis (SQL + Python), cloud fundamentals (AWS/Azure/GCP basics), and strong written communication — that last one is underrated and shows up in almost every roadmap here.`
      ]
    },
    {
      test: /\bchange career|switch career|career pivot|re-?skill\b/i,
      replies: [
        `Career switches go smoother when you map what transfers (communication, domain knowledge, project management) against what's net-new, then build a roadmap only for the gap — not from zero. Try Roadmaps and pick your target role; it accounts for prior experience.`
      ]
    },
    {
      test: /\bthank|thanks|appreciate\b/i,
      replies: [`Anytime. Come back whenever you hit the next fork in the road.`, `Glad that helped — good luck with the next step.`]
    },
    {
      test: /\bfaculty|teach|my students\b/i,
      replies: [
        `As faculty, you can point students to specific quiz topics to diagnose gaps before a unit, or assign a roadmap phase as a structured project. The Quizzes and Roadmaps pages both work well as reference material to link into a syllabus.`
      ]
    }
  ];

  const FALLBACKS = [
    `I don't have a sharp answer for that exact phrasing yet — but I can help with roadmaps, quizzes, interview prep, resumes, or career direction. Which of those is closest?`,
    `Let's narrow that down. Are you trying to learn something new, prep for an interview, or figure out a career direction?`,
    `I'm most useful on learning paths, interview prep, and career decisions — try rephrasing around one of those and I'll dig in.`
  ];

  function pick(arr){ return arr[Math.floor(Math.random()*arr.length)]; }

  function respond(text){
    for(const rule of RULES){
      if(rule.test.test(text)) return pick(rule.replies);
    }
    return pick(FALLBACKS);
  }

  function render(){
    log.innerHTML = '';
    if(history.length === 0){
      log.innerHTML = `<div class="msg bot"><span class="role">AI Mentor</span>I'm your AI Mentor — ask about a roadmap, an interview, a quiz topic, or where to start. Try one of the prompts on the left.</div>`;
    }
    history.forEach(m=>{
      const div = document.createElement('div');
      div.className = 'msg '+(m.role==='user'?'user':'bot');
      div.innerHTML = `<span class="role">${m.role==='user' ? 'You' : 'AI Mentor'}</span>${escapeHtml(m.text)}`;
      log.appendChild(div);
    });
    log.scrollTop = log.scrollHeight;
  }

  function escapeHtml(str){
    const d = document.createElement('div');
    d.textContent = str;
    return d.innerHTML;
  }

  function persist(){
    localStorage.setItem(storeKey, JSON.stringify(history));
  }

  function sendMessage(text){
    text = text.trim();
    if(!text) return;
    history.push({role:'user', text, ts:Date.now()});
    persist();
    render();
    input.value = '';

    const typingEl = document.createElement('div');
    typingEl.className = 'msg bot';
    typingEl.innerHTML = `<span class="role">AI Mentor</span><span class="typing"><span></span><span></span><span></span></span>`;
    log.appendChild(typingEl);
    log.scrollTop = log.scrollHeight;

    setTimeout(()=>{
      typingEl.remove();
      const reply = respond(text);
      history.push({role:'bot', text:reply, ts:Date.now()});
      persist();
      render();
    }, 500 + Math.random()*500);
  }

  sendBtn.addEventListener('click', ()=>sendMessage(input.value));
  input.addEventListener('keydown', e=>{
    if(e.key === 'Enter' && !e.shiftKey){
      e.preventDefault();
      sendMessage(input.value);
    }
  });
  document.querySelectorAll('.chip[data-q]').forEach(chip=>{
    chip.addEventListener('click', ()=>sendMessage(chip.dataset.q));
  });
  document.getElementById('clear-chat').addEventListener('click', ()=>{
    history = [];
    persist();
    render();
  });

  render();
})();
