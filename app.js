const seed = window.PAO_DATA;
const state = JSON.parse(localStorage.getItem('pao_state') || 'null') || structuredClone(seed);
const thb = n => new Intl.NumberFormat('th-TH',{style:'currency',currency:'THB',maximumFractionDigits:0}).format(n||0);
const save=()=>localStorage.setItem('pao_state',JSON.stringify(state));

function pct(used,budget){return budget?Math.round(used/budget*100):0}
function pace(used,budget){ const d=new Date(); const elapsed=Math.min(1,d.getDate()/new Date(d.getFullYear(),d.getMonth()+1,0).getDate()); return budget? (used/budget)/elapsed : 0; }
function barClass(p){return p>=100?'danger':p>=75?'warn':''}
function safeToSpend(){
  const b=state.budgets;
  const remainingIncome=state.baselineIncome-(b.essential.used+b.discretionary.used+b.sinking.used+b.subscriptions.used);
  return Math.max(0,remainingIncome);
}

function budgetCard(key){ const x=state.budgets[key]; const p=pct(x.used,x.budget); return `<div class="card"><div class="kicker">${x.label}</div><div class="big">${thb(x.used)}</div><div class="small">จาก ${thb(x.budget)} · เหลือ ${thb(Math.max(0,x.budget-x.used))}</div><div class="bar"><div class="fill ${barClass(p)}" style="width:${Math.min(100,p)}%"></div></div><div class="small">ใช้แล้ว ${p}% ${key==='discretionary'?`· pace ${pace(x.used,x.budget).toFixed(1)}×`:''}</div></div>` }

function renderHome(){
  document.querySelector('#home').innerHTML=`<div class="top"><div><div class="brand">PAO+ME</div><div class="sub">Financial autopilot · ${state.month}</div></div><span class="pill">local-first</span></div>
  <div class="grid">${budgetCard('essential')}${budgetCard('discretionary')}${budgetCard('sinking')}${budgetCard('subscriptions')}
  <div class="card wide"><div class="kicker">Safe to Spend / Future Capital</div><div class="big">${thb(safeToSpend())}</div><div class="small">หลังหัก budget buckets ที่บันทึกในเดือนนี้</div></div>
  <div class="card wide"><div class="kicker">Gov Clearing</div><div class="row"><div><div class="name">Receivable</div><div class="meta">เงินที่สำรองจ่ายและรอเบิกคืน</div></div><div class="amount">${thb(state.gov.receivable)}</div></div><div class="row"><div><div class="name">Advance liability</div><div class="meta">เงินยืมราชการที่ยังต้องเคลียร์</div></div><div class="amount">${thb(state.gov.liability)}</div></div></div></div>
  <div class="section-title">Today</div><div class="card"><div class="row"><div><div class="name">Review Inbox</div><div class="meta">ถามเฉพาะรายการที่ AI/rules ยังไม่มั่นใจ</div></div><div class="amount">${state.inbox.length} รายการ</div></div></div>`;
}

function classify(item, choice){
  if(choice==='Essential') state.budgets.essential.used += item.amount;
  if(choice==='Discretionary') state.budgets.discretionary.used += item.amount;
  if(choice==='Official/Reimbursable') state.gov.receivable += item.amount;
  if(choice==='Reimbursement') state.gov.receivable = Math.max(0,state.gov.receivable-item.amount);
  state.inbox=state.inbox.filter(x=>x.id!==item.id); save(); renderAll();
}
function renderInbox(){ const el=document.querySelector('#inbox');
  el.innerHTML=`<div class="top"><div><div class="brand">Review Inbox</div><div class="sub">exception-only · one tap</div></div><span class="pill ${state.inbox.length?'warn':''}">${state.inbox.length} pending</span></div>` +
  (state.inbox.length? state.inbox.map(i=>`<div class="card" style="margin-bottom:10px"><div class="kicker">${i.source}</div><div class="row"><div><div class="name">${i.merchant}</div><div class="meta">${i.note||i.prompt}</div></div><div class="amount">${thb(i.amount)}</div></div><div class="small">${i.prompt}</div><div class="actions">${i.choices.map(c=>`<button class="btn ${c===i.choices[0]?'primary':''}" data-id="${i.id}" data-choice="${c}">${c}</button>`).join('')}</div></div>`).join('') : `<div class="card"><div class="big">✓</div><div class="name">ไม่มีรายการต้อง review</div><div class="meta">ระบบจะเงียบเมื่อไม่มีสิ่งที่ต้องตัดสินใจ</div></div>`);
  el.querySelectorAll('button[data-id]').forEach(b=>b.onclick=()=>classify(state.inbox.find(x=>x.id==b.dataset.id),b.dataset.choice));
}

function parseGovNote(note){ const t=(note||'').toLowerCase();
  if(/คืนเงิน(เหลือ|ยืม)|return.*advance/.test(t)) return {type:'Return of Unused Advance', effect:'liability -'};
  if(/เบิกคืน|reimburse/.test(t)) return {type:'Expense Reimbursement', effect:'receivable -'};
  if(/สำรอง.*ราชการ|สำรอง.*ประชุม|official.*expense/.test(t)) return {type:'Official Reimbursable Expense', effect:'receivable +'};
  if(/ยืมราชการ|เงินยืม|government advance/.test(t)) return {type:'Government Advance', effect:'liability +'};
  return {type:'Needs Review',effect:'none'};
}
function renderMonthly(){ const subs=state.subscriptions.map(s=>`<div class="row"><div><div class="name">${s.name}</div><div class="meta">${s.priority} · ${s.action}</div></div><div class="amount">${thb(s.amount)}</div></div>`).join('');
  document.querySelector('#monthly').innerHTML=`<div class="top"><div><div class="brand">Monthly Review</div><div class="sub">เป้าหมาย: จบภายใน 5–10 นาที</div></div></div><div class="note">หลัก: Merchant ≠ Category. Shopee/Grab/Apple เป็นช่องทางหรือ merchant; งบจะตัดสินจาก purpose + priority + behavior.</div><div class="section-title">Subscriptions</div><div class="card">${subs}</div><div class="section-title">Gov Note Interpreter</div><div class="card"><input id="govnote" class="input" placeholder="เช่น คืนเงินเหลือจากเงินยืมราชการ 2,300"><div class="footer-actions"><button id="parse" class="btn primary">Interpret</button></div><div id="parsed" class="meta" style="margin-top:10px"></div></div><div class="section-title">Backup</div><div class="card"><div class="meta">ข้อมูล MVP อยู่ใน browser เครื่องนี้ ควร Export backup เป็นระยะ</div><div class="actions"><button id="export" class="btn">Export JSON</button><button id="reset" class="btn">Reset demo</button></div></div>`;
  document.querySelector('#parse').onclick=()=>{const r=parseGovNote(document.querySelector('#govnote').value);document.querySelector('#parsed').textContent=`${r.type} → ${r.effect}`};
  document.querySelector('#export').onclick=()=>{const blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='pao-me-backup.json';a.click();URL.revokeObjectURL(a.href)};
  document.querySelector('#reset').onclick=()=>{localStorage.removeItem('pao_state');location.reload()};
}
function showTab(name){document.querySelectorAll('main>section').forEach(s=>s.classList.toggle('hidden',s.id!==name));document.querySelectorAll('.tab').forEach(t=>t.classList.toggle('active',t.dataset.tab===name));}
function renderAll(){renderHome();renderInbox();renderMonthly();}
document.querySelectorAll('.tab').forEach(t=>t.onclick=()=>showTab(t.dataset.tab));
renderAll(); showTab('home');
if('serviceWorker' in navigator) navigator.serviceWorker.register('./sw.js').catch(()=>{});
