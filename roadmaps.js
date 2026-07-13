/* ============================================================
   CAMPUS NEXUS AI — roadmaps.js
   Static goal templates -> phased, checkable roadmaps saved
   per-user (or per-guest) to localStorage.
   ============================================================ */

const ROADMAP_TEMPLATES = {
  'Full-Stack Developer': {
    tag:'learn',
    phases:[
      {title:'Foundations', tasks:[
        ['HTML, CSS & the DOM','Build three static pages by hand before reaching for a framework.'],
        ['JavaScript fundamentals','Variables, functions, arrays/objects, async/await, fetch.'],
        ['Git & GitHub','Branches, pull requests, resolving merge conflicts.']
      ]},
      {title:'Core skills', tasks:[
        ['A frontend framework (React)','Components, state, props, hooks.'],
        ['Backend basics (Node/Express or similar)','Routing, middleware, REST APIs.'],
        ['Databases','Relational (SQL) and one NoSQL option; CRUD from your API.']
      ]},
      {title:'Applied projects', tasks:[
        ['Full-stack CRUD app','Auth, database, deployed frontend + backend.'],
        ['Contribute to an open-source repo','Even a small docs or bug-fix PR counts.']
      ]},
      {title:'Job-ready', tasks:[
        ['Portfolio site with 2–3 projects','Live links + source, one paragraph on your role in each.'],
        ['Mock technical interviews','Practice data structures, whiteboard-style, out loud.']
      ]}
    ]
  },
  'Data Scientist': {
    tag:'signal',
    phases:[
      {title:'Foundations', tasks:[
        ['Python for data','pandas, numpy, plotting with matplotlib/seaborn.'],
        ['Statistics essentials','Distributions, hypothesis testing, correlation vs causation.'],
        ['SQL','Joins, aggregations, window functions.']
      ]},
      {title:'Core skills', tasks:[
        ['Classical ML','Regression, classification, trees/ensembles, evaluation metrics.'],
        ['Data wrangling at scale','Missing data, feature engineering, pipelines.'],
        ['Experiment design','A/B testing basics, confidence intervals.']
      ]},
      {title:'Applied projects', tasks:[
        ['End-to-end project on a real dataset','Clean data → model → written findings.'],
        ['A dashboard or report for a non-technical audience','Communication is half the job.']
      ]},
      {title:'Job-ready', tasks:[
        ['SQL + case-study mock interviews','Practice explaining trade-offs out loud.'],
        ['Portfolio write-up','One deep case study beats five shallow ones.']
      ]}
    ]
  },
  'Product Manager': {
    tag:'career',
    phases:[
      {title:'Foundations', tasks:[
        ['Product fundamentals','Problem framing, user stories, prioritization frameworks.'],
        ['Basic data literacy','Reading dashboards, defining a metric that matters.']
      ]},
      {title:'Core skills', tasks:[
        ['Discovery & user research','Interview scripts, synthesizing themes.'],
        ['Roadmapping & prioritization','RICE/ICE scoring, saying no with a reason.'],
        ['Working with engineering & design','Specs, trade-off conversations, sprint rituals.']
      ]},
      {title:'Applied projects', tasks:[
        ['Ship a mock PRD for a real product gap','Problem, goals, scope, success metric.'],
        ['Run a mock stakeholder review','Practice defending prioritization decisions.']
      ]},
      {title:'Job-ready', tasks:[
        ['Case-study interview practice','Product sense + estimation + execution rounds.'],
        ['Portfolio of 2–3 PRDs or case studies','Show reasoning, not just outcomes.']
      ]}
    ]
  },
  'UI/UX Designer': {
    tag:'career',
    phases:[
      {title:'Foundations', tasks:[
        ['Design principles','Hierarchy, contrast, spacing, type systems.'],
        ['A design tool (Figma)','Components, auto-layout, prototyping.']
      ]},
      {title:'Core skills', tasks:[
        ['User research basics','Interviews, personas, journey maps.'],
        ['Wireframing → high-fidelity flows','Low-fidelity first, then polish.'],
        ['Usability testing','Running a 5-user test and synthesizing findings.']
      ]},
      {title:'Applied projects', tasks:[
        ['Redesign an existing product flow','Document the problem and your rationale.'],
        ['Original case study, start to finish','Research → wireframes → final UI → outcome.']
      ]},
      {title:'Job-ready', tasks:[
        ['Portfolio site with 3 case studies','Process over pretty pictures.'],
        ['Portfolio review practice','Walk someone through your reasoning in 10 minutes.']
      ]}
    ]
  },
  'Digital Marketer': {
    tag:'career',
    phases:[
      {title:'Foundations', tasks:[
        ['Marketing fundamentals','Funnels, positioning, channels.'],
        ['Analytics basics','GA4 or equivalent, reading a dashboard.']
      ]},
      {title:'Core skills', tasks:[
        ['SEO & content','Keyword research, on-page basics.'],
        ['Paid & organic social','Campaign structure, targeting, creative testing.'],
        ['Email & lifecycle marketing','Segmentation, basic automation flows.']
      ]},
      {title:'Applied projects', tasks:[
        ['Run a small real or mock campaign','Set a goal, execute, report results.'],
        ['Write a campaign retro','What worked, what you'+"'"+'d change, why.']
      ]},
      {title:'Job-ready', tasks:[
        ['Portfolio of campaigns with metrics','Numbers over adjectives.'],
        ['Mock stakeholder pitch','Practice presenting a campaign plan in 5 minutes.']
      ]}
    ]
  },
  'AI/ML Engineer': {
    tag:'signal',
    phases:[
      {title:'Foundations', tasks:[
        ['Python + linear algebra/calculus refresher','Enough to read model internals.'],
        ['ML fundamentals','Supervised/unsupervised learning, evaluation.']
      ]},
      {title:'Core skills', tasks:[
        ['Deep learning basics','Neural nets, training loops, one framework (PyTorch/TF).'],
        ['Working with LLMs & APIs','Prompting, embeddings, retrieval basics.'],
        ['MLOps basics','Versioning data/models, basic deployment.']
      ]},
      {title:'Applied projects', tasks:[
        ['Fine-tune or prompt-engineer a model for a real task','Document the iteration process.'],
        ['Deploy a small model behind an API','Even a simple endpoint counts.']
      ]},
      {title:'Job-ready', tasks:[
        ['ML system design practice','Talk through data → training → serving trade-offs.'],
        ['Portfolio write-up of your project','Include what didn'+"'"+'t work, not just what did.']
      ]}
    ]
  }
};

document.addEventListener('DOMContentLoaded', function(){
  const user = CN.currentUser();
  const storeKey = CN.ns('cn_roadmaps', user ? user.id : 'guest');
  let roadmaps = JSON.parse(localStorage.getItem(storeKey) || '[]');

  const picker = document.getElementById('goal-picker');
  const myRoadmaps = document.getElementById('my-roadmaps');

  picker.innerHTML = Object.keys(ROADMAP_TEMPLATES).map(goal=>{
    const tpl = ROADMAP_TEMPLATES[goal];
    return `
      <div class="card">
        <span class="tag tag-${tpl.tag}">${tpl.phases.length} phases</span>
        <h3 style="margin-top:14px; font-size:17px">${goal}</h3>
        <p style="font-size:13.5px">${tpl.phases[0].tasks[0][0]} → … → job-ready.</p>
        <button class="btn btn-primary btn-sm" data-goal="${goal}">Generate roadmap</button>
      </div>`;
  }).join('');

  picker.querySelectorAll('button[data-goal]').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const goal = btn.dataset.goal;
      if(roadmaps.find(r=>r.goal===goal)){
        CN.toast('You already have a roadmap for '+goal+'.');
        renderRoadmaps();
        document.getElementById('rm-'+slug(goal)).scrollIntoView({behavior:'smooth'});
        return;
      }
      const tpl = ROADMAP_TEMPLATES[goal];
      const roadmap = {
        goal,
        tag: tpl.tag,
        createdAt: new Date().toISOString(),
        phases: tpl.phases.map(p=>({
          title: p.title,
          tasks: p.tasks.map(t=>({title:t[0], desc:t[1], done:false}))
        }))
      };
      roadmaps.push(roadmap);
      persist();
      CN.toast('Roadmap generated for '+goal+'.');
      renderRoadmaps();
    });
  });

  function slug(str){ return str.toLowerCase().replace(/[^a-z0-9]+/g,'-'); }
  function persist(){ localStorage.setItem(storeKey, JSON.stringify(roadmaps)); }

  function progressOf(rm){
    const all = rm.phases.flatMap(p=>p.tasks);
    const done = all.filter(t=>t.done).length;
    return {done, total: all.length, pct: all.length ? Math.round(done/all.length*100) : 0};
  }

  function renderRoadmaps(){
    if(roadmaps.length === 0){
      myRoadmaps.innerHTML = `
        <div class="empty-state">
          <div class="glyph">🧭</div>
          <p>No roadmap generated yet — pick a destination above to get started.</p>
        </div>`;
      return;
    }
    myRoadmaps.innerHTML = `<h2 style="margin-bottom:22px">Your roadmaps</h2>` + roadmaps.map((rm,ri)=>{
      const prog = progressOf(rm);
      return `
      <div class="card" id="rm-${slug(rm.goal)}" style="margin-bottom:26px">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:14px; margin-bottom:8px">
          <div>
            <span class="tag tag-${rm.tag}">Roadmap</span>
            <h3 style="margin-top:10px; margin-bottom:0">${rm.goal}</h3>
          </div>
          <div style="display:flex; align-items:center; gap:14px">
            <div class="mono" style="font-size:13px; color:var(--text-low)">${prog.done}/${prog.total} tasks</div>
            <button class="btn btn-ghost btn-sm" data-remove="${ri}">Remove</button>
          </div>
        </div>
        <div class="progress-track" style="margin-bottom:22px"><div class="progress-fill" style="width:${prog.pct}%"></div></div>
        ${rm.phases.map((phase,pi)=>{
          const phaseDone = phase.tasks.every(t=>t.done);
          return `
          <div class="roadmap-phase ${phaseDone?'done':''}">
            <h3>${phase.title}</h3>
            <div class="phase-meta">Phase ${pi+1} of ${rm.phases.length}</div>
            ${phase.tasks.map((task,ti)=>`
              <div class="task-row ${task.done?'checked':''}">
                <input type="checkbox" ${task.done?'checked':''} data-r="${ri}" data-p="${pi}" data-t="${ti}">
                <div>
                  <div class="task-title">${task.title}</div>
                  <div class="task-desc">${task.desc}</div>
                </div>
              </div>`).join('')}
          </div>`;
        }).join('')}
      </div>`;
    }).join('');

    myRoadmaps.querySelectorAll('input[type=checkbox]').forEach(cb=>{
      cb.addEventListener('change', ()=>{
        const r = +cb.dataset.r, p = +cb.dataset.p, t = +cb.dataset.t;
        roadmaps[r].phases[p].tasks[t].done = cb.checked;
        persist();
        renderRoadmaps();
      });
    });
    myRoadmaps.querySelectorAll('button[data-remove]').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        roadmaps.splice(+btn.dataset.remove, 1);
        persist();
        renderRoadmaps();
      });
    });
  }

  renderRoadmaps();
});
