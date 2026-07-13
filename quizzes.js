/* ============================================================
   CAMPUS NEXUS AI — quizzes.js
   ============================================================ */

const QUIZ_BANK = {
  'Web Development': {
    tag:'learn',
    questions:[
      {q:'Which HTML tag is used to link an external CSS file?', options:['<style>','<script>','<link>','<css>'], correct:2},
      {q:'In CSS, which property controls the space between an element\'s content and its border?', options:['margin','padding','spacing','gap'], correct:1},
      {q:'Which JavaScript keyword declares a block-scoped variable that can be reassigned?', options:['const','var','let','static'], correct:2},
      {q:'What does REST stand for in the context of web APIs?', options:['Rapid External Server Transfer','Representational State Transfer','Remote Endpoint Service Transport','Recursive State Transition'], correct:1},
      {q:'Which HTTP method is typically used to partially update a resource?', options:['GET','PATCH','DELETE','HEAD'], correct:1},
      {q:'What does the CSS Flexbox property `justify-content` control?', options:['Alignment along the cross axis','Alignment along the main axis','Font weight','Element stacking order'], correct:1}
    ]
  },
  'Data Science': {
    tag:'signal',
    questions:[
      {q:'Which measure describes the spread of a dataset around its mean?', options:['Median','Standard deviation','Mode','Correlation'], correct:1},
      {q:'In a pandas DataFrame, which method returns summary statistics for numeric columns?', options:['.info()','.describe()','.head()','.columns()'], correct:1},
      {q:'What does overfitting mean in machine learning?', options:['The model performs poorly on both train and test data','The model memorizes training data and generalizes poorly','The model trains too slowly','The dataset is too small to train on'], correct:1},
      {q:'Which SQL clause is used to filter rows after aggregation (e.g. after GROUP BY)?', options:['WHERE','HAVING','FILTER','LIMIT'], correct:1},
      {q:'A correlation coefficient close to 0 between two variables suggests:', options:['A strong positive relationship','A strong negative relationship','Little to no linear relationship','The variables are identical'], correct:2},
      {q:'Which of these is a classification metric, not a regression metric?', options:['Mean Squared Error','R-squared','F1 score','Mean Absolute Error'], correct:2}
    ]
  },
  'AI & Machine Learning': {
    tag:'signal',
    questions:[
      {q:'What is the primary purpose of a loss function during model training?', options:['To visualize the data','To measure how far predictions are from actual values','To split data into train/test sets','To normalize input features'], correct:1},
      {q:'In the context of LLMs, what is a "token"?', options:['A security credential','A unit of text the model processes, like a word or sub-word piece','A type of neural network layer','A training epoch'], correct:1},
      {q:'What does "supervised learning" require that "unsupervised learning" does not?', options:['A GPU','Labeled training data','A neural network','Internet access'], correct:1},
      {q:'What is the purpose of a validation set?', options:['To train the final production model','To tune hyperparameters and check generalization during development','To store raw unprocessed data','To replace the test set entirely'], correct:1},
      {q:'What does "prompt engineering" primarily involve?', options:['Writing backend APIs for a model','Designing inputs to get better outputs from a language model','Training a model from scratch','Compressing model weights'], correct:1}
    ]
  },
  'Aptitude & Reasoning': {
    tag:'career',
    questions:[
      {q:'If a train travels 60 km in 45 minutes, what is its speed in km/h?', options:['70 km/h','75 km/h','80 km/h','65 km/h'], correct:2},
      {q:'Complete the series: 2, 6, 12, 20, 30, ?', options:['40','42','36','44'], correct:1},
      {q:'A shop offers a 20% discount, then an additional 10% off the discounted price. What is the total effective discount?', options:['30%','28%','32%','25%'], correct:1},
      {q:'If all Zips are Zaps, and all Zaps are Zops, then:', options:['All Zops are Zips','All Zips are Zops','No Zips are Zops','Cannot be determined'], correct:1},
      {q:'What comes next: A, C, F, J, O, ?', options:['S','T','U','R'], correct:2}
    ]
  },
  'Communication Skills': {
    tag:'career',
    questions:[
      {q:'In the STAR method for interview answers, what does the "R" stand for?', options:['Response','Result','Review','Reasoning'], correct:1},
      {q:'Which of these is an example of active listening?', options:['Planning your reply while the other person is still talking','Paraphrasing what the speaker said to confirm understanding','Interrupting to add your own experience','Checking your phone occasionally'], correct:1},
      {q:'In a professional email, what is generally the best approach to the subject line?', options:['Leave it blank for a personal touch','Make it long and detailed with every point','Keep it short and specific to the email\'s purpose','Use all capital letters for visibility'], correct:2},
      {q:'When giving constructive feedback, which approach tends to work best?', options:['Focus only on what went wrong','Be vague to avoid discomfort','Be specific, focus on behavior, and suggest a path forward','Deliver it publicly for accountability'], correct:2},
      {q:'What is the main goal of an "elevator pitch"?', options:['To explain every detail of your background','To concisely communicate who you are and your value in a short time','To ask the listener for a job directly','To read your resume aloud'], correct:1}
    ]
  }
};

document.addEventListener('DOMContentLoaded', function(){
  const user = CN.currentUser();
  const historyKey = CN.ns('cn_quiz_history', user ? user.id : 'guest');
  const root = document.getElementById('quiz-root');

  let state = {mode:'picker', topic:null, qIndex:0, answers:[], locked:false};

  function saveHistory(topic, score, total){
    const hist = JSON.parse(localStorage.getItem(historyKey) || '[]');
    hist.push({topic, score, total, date:new Date().toISOString()});
    localStorage.setItem(historyKey, JSON.stringify(hist));
  }

  function renderPicker(){
    state = {mode:'picker', topic:null, qIndex:0, answers:[], locked:false};
    root.innerHTML = `
      <div class="eyebrow">Quizzes</div>
      <h1 style="margin-bottom:6px">Check your skills, five minutes at a time.</h1>
      <p style="max-width:600px; margin-bottom:30px">Pick a topic. Every quiz is scored instantly and saved to your dashboard so you can track progress over time.</p>
      <div class="grid grid-3">
        ${Object.keys(QUIZ_BANK).map(topic=>{
          const t = QUIZ_BANK[topic];
          return `
          <div class="card">
            <span class="tag tag-${t.tag}">${t.questions.length} questions</span>
            <h3 style="margin-top:14px; font-size:17px">${topic}</h3>
            <p style="font-size:13.5px">Instant scoring · answer review at the end.</p>
            <button class="btn btn-primary btn-sm" data-topic="${topic}">Start quiz</button>
          </div>`;
        }).join('')}
      </div>
    `;
    root.querySelectorAll('button[data-topic]').forEach(btn=>{
      btn.addEventListener('click', ()=> startQuiz(btn.dataset.topic));
    });
  }

  function startQuiz(topic){
    state = {mode:'quiz', topic, qIndex:0, answers:[], locked:false};
    renderQuiz();
  }

  function renderQuiz(){
    const bank = QUIZ_BANK[state.topic];
    const q = bank.questions[state.qIndex];
    const selected = state.answers[state.qIndex];
    const locked = selected !== undefined;

    root.innerHTML = `
      <div class="eyebrow">${state.topic}</div>
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px">
        <h2 style="margin:0">Question ${state.qIndex+1} of ${bank.questions.length}</h2>
        <span class="mono" style="color:var(--text-low); font-size:13px">${state.answers.filter(a=>a!==undefined).length}/${bank.questions.length} answered</span>
      </div>
      <div class="progress-track" style="margin-bottom:26px"><div class="progress-fill" style="width:${(state.qIndex)/bank.questions.length*100}%"></div></div>
      <div class="card" style="max-width:680px">
        <h3 style="font-size:18px">${q.q}</h3>
        <div style="margin-top:18px">
          ${q.options.map((opt,i)=>{
            let cls = 'quiz-option';
            if(locked){
              if(i===q.correct) cls += ' correct';
              else if(i===selected) cls += ' incorrect';
            }
            return `<div class="${cls}" data-opt="${i}">
              <span class="opt-key mono">${String.fromCharCode(65+i)}</span>
              <span>${opt}</span>
            </div>`;
          }).join('')}
        </div>
        ${locked ? `<p style="margin-top:14px; font-size:13.5px; color:${selected===q.correct?'var(--good)':'var(--bad)'}">
            ${selected===q.correct ? 'Correct.' : 'Not quite — the correct answer is highlighted above.'}
          </p>` : ''}
        <div style="display:flex; justify-content:space-between; margin-top:22px">
          <button class="btn btn-ghost btn-sm" id="quiz-exit">Exit quiz</button>
          <button class="btn btn-primary btn-sm" id="quiz-next" ${locked ? '' : 'disabled'}>
            ${state.qIndex === bank.questions.length-1 ? 'See results' : 'Next question'}
          </button>
        </div>
      </div>
    `;

    if(!locked){
      root.querySelectorAll('.quiz-option').forEach(el=>{
        el.addEventListener('click', ()=>{
          state.answers[state.qIndex] = +el.dataset.opt;
          renderQuiz();
        });
      });
    }
    document.getElementById('quiz-exit').addEventListener('click', renderPicker);
    document.getElementById('quiz-next').addEventListener('click', ()=>{
      if(state.qIndex === bank.questions.length-1){
        finishQuiz();
      } else {
        state.qIndex++;
        renderQuiz();
      }
    });
  }

  function finishQuiz(){
    const bank = QUIZ_BANK[state.topic];
    const score = state.answers.reduce((s,a,i)=> s + (a===bank.questions[i].correct ? 1 : 0), 0);
    saveHistory(state.topic, score, bank.questions.length);
    const pct = Math.round(score/bank.questions.length*100);
    const verdict = pct>=80 ? 'Strong grasp — you\'re ready to move on.' : pct>=50 ? 'Solid start — a bit more practice will help.' : 'Worth revisiting the fundamentals before moving on.';

    root.innerHTML = `
      <div class="eyebrow">${state.topic} · results</div>
      <h1 style="margin-bottom:16px">You scored ${score}/${bank.questions.length}</h1>
      <div class="card" style="max-width:520px; margin-bottom:28px">
        <div class="progress-track" style="margin-bottom:14px"><div class="progress-fill" style="width:${pct}%"></div></div>
        <p style="margin-bottom:0">${verdict}</p>
      </div>
      <h3 style="margin-bottom:14px">Review your answers</h3>
      ${bank.questions.map((q,i)=>{
        const correct = state.answers[i]===q.correct;
        return `
        <div class="card" style="margin-bottom:14px">
          <div style="display:flex; justify-content:space-between; gap:10px">
            <strong style="font-size:14.5px">${i+1}. ${q.q}</strong>
            <span class="pill" style="border-color:${correct?'var(--good)':'var(--bad)'}; color:${correct?'var(--good)':'var(--bad)'}">${correct?'Correct':'Missed'}</span>
          </div>
          <p style="margin-top:8px; margin-bottom:0; font-size:13.5px">Correct answer: <strong style="color:var(--text-hi)">${q.options[q.correct]}</strong></p>
        </div>`;
      }).join('')}
      <div style="display:flex; gap:12px; margin-top:10px">
        <button class="btn btn-primary" id="retake">Retake this quiz</button>
        <button class="btn btn-ghost" id="back-picker">Choose another topic</button>
        ${user ? '<a href="dashboard.html" class="btn btn-ghost">View dashboard</a>' : '<a href="signup.html" class="btn btn-ghost">Sign up to save progress</a>'}
      </div>
    `;
    document.getElementById('retake').addEventListener('click', ()=> startQuiz(state.topic));
    document.getElementById('back-picker').addEventListener('click', renderPicker);
  }

  renderPicker();
});
