/* ============================================================
   CAMPUS NEXUS AI — auth.js
   Lightweight client-side auth simulation using localStorage.
   NOTE: this is a front-end prototype. Passwords are stored
   locally in the browser only, never sent anywhere — do not
   reuse real passwords here.
   ============================================================ */

const CN = (function(){
  const USERS_KEY = 'cn_users';
  const SESSION_KEY = 'cn_session';

  function getUsers(){
    return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  }
  function saveUsers(users){
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }
  function hash(str){
    // simple non-cryptographic hash, sufficient for a local demo
    let h = 0;
    for(let i=0;i<str.length;i++){ h = (h<<5)-h+str.charCodeAt(i); h|=0; }
    return String(h);
  }
  function signup({name,email,password,role}){
    const users = getUsers();
    if(users.find(u=>u.email.toLowerCase()===email.toLowerCase())){
      return {ok:false, error:'An account with this email already exists.'};
    }
    const user = {
      id: 'u_'+Date.now(),
      name, email, role,
      passHash: hash(password),
      createdAt: new Date().toISOString()
    };
    users.push(user);
    saveUsers(users);
    setSession(user.id);
    seedUserData(user.id);
    return {ok:true, user};
  }
  function login({email,password}){
    const users = getUsers();
    const user = users.find(u=>u.email.toLowerCase()===email.toLowerCase());
    if(!user) return {ok:false, error:'No account found with that email.'};
    if(user.passHash !== hash(password)) return {ok:false, error:'Incorrect password.'};
    setSession(user.id);
    return {ok:true, user};
  }
  function setSession(userId){
    localStorage.setItem(SESSION_KEY, userId);
  }
  function logout(){
    localStorage.removeItem(SESSION_KEY);
    window.location.href = 'index.html';
  }
  function currentUser(){
    const id = localStorage.getItem(SESSION_KEY);
    if(!id) return null;
    return getUsers().find(u=>u.id===id) || null;
  }
  function requireAuth(){
    const u = currentUser();
    if(!u){ window.location.href = 'login.html'; }
    return u;
  }
  function seedUserData(userId){
    localStorage.setItem('cn_quiz_history_'+userId, JSON.stringify([]));
    localStorage.setItem('cn_roadmaps_'+userId, JSON.stringify([]));
    localStorage.setItem('cn_chat_'+userId, JSON.stringify([]));
    localStorage.setItem('cn_interview_'+userId, JSON.stringify([]));
  }
  function ns(key, userId){
    const id = userId || (currentUser()||{}).id || 'guest';
    return key+'_'+id;
  }
  function toast(msg){
    let wrap = document.querySelector('.toast-wrap');
    if(!wrap){
      wrap = document.createElement('div');
      wrap.className='toast-wrap';
      document.body.appendChild(wrap);
    }
    const t = document.createElement('div');
    t.className='toast';
    t.textContent = msg;
    wrap.appendChild(t);
    setTimeout(()=>t.remove(), 3200);
  }

  return {getUsers, signup, login, logout, currentUser, requireAuth, ns, toast};
})();

/* ---------------- Shared header wiring ---------------- */
document.addEventListener('DOMContentLoaded', function(){
  const user = CN.currentUser();
  const authArea = document.querySelector('[data-auth-area]');
  if(authArea){
    if(user){
      authArea.innerHTML = `
        <a href="dashboard.html" class="btn btn-ghost btn-sm">Hi, ${user.name.split(' ')[0]}</a>
        <button class="btn btn-primary btn-sm" id="cn-logout-btn">Log out</button>
      `;
      document.getElementById('cn-logout-btn').addEventListener('click', CN.logout);
    } else {
      authArea.innerHTML = `
        <a href="login.html" class="btn btn-ghost btn-sm">Log in</a>
        <a href="signup.html" class="btn btn-primary btn-sm">Sign up free</a>
      `;
    }
  }
  const hamburger = document.querySelector('.hamburger');
  if(hamburger){
    hamburger.addEventListener('click', ()=>{
      document.querySelector('.site-header').classList.toggle('nav-open');
    });
  }
  // mark active nav link
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('nav.primary a').forEach(a=>{
    if(a.getAttribute('href') === path) a.classList.add('active');
  });
});
