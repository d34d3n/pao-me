const seed = window.PAO_DATA;
const STORAGE_KEY='pao_state_v2';
let state = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
if(!state || state.schemaVersion !== seed.schemaVersion){ state = structuredClone(seed); localStorage.setItem(STORAGE_KEY,JSON.stringify(state)); }
const thb = n => new Intl.NumberFormat('th-TH',{style:'currency',currency:'THB',maximumFractionDigits:0}).format(Number(n)||0);
const save=()=>localStorage.setItem(STORAGE_KEY,JSON.stringify(state));
const sum=(arr,key='amount')=>(arr||[]).reduce((a,x)=>a+(Number(x[key])||0),0);
function pct(used,budget){return budget?Math.round(used/budget*100):0}
function barClass(p){return p>=100?'danger':p>=75?'warn':''}
function futureCapitalPlan(){
  const b=state.budgetPlan;
  return Math.max(0,state.baselineIncome-b.essential.budget-b.discretionary.budget-b.sinking.budget);
}
function budgetCard(key){
  const x=state.budgetPlan[key]; const p=pct(x.used,x.budget);
  return `<div class="card"><div class="kicker">${x.label}</div><div class="big">${thb(x.budget)}</div><div class="small">วงเงินวางแผน/เดือน · ใช้บันทึกแล้ว ${thb(x.used)}</div><div class="bar"><div class="fill ${barClass(p)}" style="width:${Math.min(100,p)}%"></div></div><div class="small">${x.note}</div></div>`;
}
function renderHome(){
  const eplan=sum(state.essentialPlan);
  document.querySelector('#home').innerHTML=`
  <div class="top"><div><div class="brand">PAO+ME</div><div class="sub">Financial autopilot · ${state.month}</div></div><span class="pill">baseline v1.1</span></div>
  <div class="note">ตอนนี้เป็น <b>planning baseline</b> จากข้อมูล มิ.ย.–ส.ค. ยังไม่ใช่ยอดใช้จริงของเดือนปัจจุบัน</div>
  <div class="grid" style="margin-top:10px">${budgetCard('essential')}${budgetCard('discretionary')}${budgetCard('sinking')}
  <div class="card"><div class="kicker">Essential plan components</div><div class="big">${thb(eplan)}</div><div class="small">เป้าหมายใกล้เคียง ${thb(state.budgetPlan.essential.budget)} · รายละเอียดอยู่ Monthly</div></div>
  <div class="card wide"><div class="kicker">Planned Future Capital</div><div class="big">${thb(futureCapitalPlan())}</div><div class="small">รายรับฐาน ${thb(state.baselineIncome)} − Essential − Discretionary − Sinking Fund; ไม่ใช่ยอดเงินสดคงเหลือในบัญชี</div></div>
  <div class="card wide"><div class="kicker">Gov Clearing</div><div class="row"><div><div class="name">Receivable</div><div class="meta">สำรองจ่ายราชการและรอเบิกคืน</div></div><div class="amount">${thb(state.gov.receivable)}</div></div><div class="row"><div><div class="name">Advance liability</div><div class="meta">เงินยืมราชการที่ยังต้องเคลียร์/คืน</div></div><div class="amount">${thb(state.gov.liability)}</div></div></div></div>
  <div class="section-title">Action</div><div class="card"><div class="row"><div><div class="name">Review Inbox</div><div class="meta">เฉพาะรายการที่มีผลต่อการตัดสินใจทางการเงิน</div></div><div class="amount">${state.inbox.length} รายการ</div></div></div>`;
}
function classify(item, choice){
  if(choice==='Personal Expense') state.budgetPlan.discretionary.used += item.amount;
  if(choice==='Return of Gov Advance') state.gov.liability = Math.max(0,state.gov.liability-item.amount);
  // Card Settlement is explicitly non-expense.
  state.inbox=state.inbox.filter(x=>x.id!==item.id); save(); renderAll();
}
function renderInbox(){
  const el=document.querySelector('#inbox');
  el.innerHTML=`<div class="top"><div><div class="brand">Review Inbox</div><div class="sub">exception-only · one tap</div></div><span class="pill ${state.inbox.length?'warn':''}">${state.inbox.length} pending</span></div>`+
  (state.inbox.length?state.inbox.map(i=>`<div class="card" style="margin-bottom:10px"><div class="kicker">${i.date||''} · ${i.source}</div><div class="row"><div><div class="name">${i.merchant}</div><div class="meta">${i.note||''}</div></div><div class="amount">${thb(i.amount)}</div></div><div class="small">${i.prompt}</div><div class="actions">${i.choices.map(c=>`<button class="btn ${c===i.choices[0]?'primary':''}" data-id="${i.id}" data-choice="${c}">${c}</button>`).join('')}</div></div>`).join(''):`<div class="card"><div class="big">✓</div><div class="name">ไม่มีรายการต้อง review</div><div class="meta">ระบบจะเงียบเมื่อไม่มีสิ่งที่ต้องตัดสินใจ</div></div>`);
  el.querySelectorAll('button[data-id]').forEach(b=>b.onclick=()=>classify(state.inbox.find(x=>x.id==b.dataset.id),b.dataset.choice));
}
function parseGovNote(note){
  const t=(note||'').toLowerCase();
  if(/คืนเงิน(เหลือ|ยืม)|คืน.*ราชการ|return.*advance/.test(t)) return {type:'Return of Unused Government Advance',effect:'ลด Gov liability; ไม่ใช่ personal expense'};
  if(/เบิกคืน|reimburse/.test(t)) return {type:'Expense Reimbursement',effect:'ลด Gov receivable; ไม่ใช่ income'};
  if(/สำรอง.*ราชการ|สำรอง.*ประชุม|เบิกได้|official.*expense/.test(t)) return {type:'Official Reimbursable Expense',effect:'เพิ่ม Gov receivable; ไม่ใช่ personal expense'};
  if(/ยืมราชการ|เงินยืม|government advance/.test(t)) return {type:'Government Advance',effect:'เพิ่ม Gov liability; ไม่ใช่ income'};
  return {type:'Needs Review',effect:'ยังไม่เปลี่ยนบัญชี'};
}
function historicalCard(h){
  const oo=sum(h.oneOff);
  return `<div class="card" style="margin-bottom:10px"><div class="row"><div><div class="name">${h.month}</div><div class="meta">Known spending ${thb(h.knownSpending)} · family support ที่บันทึก ${thb(h.familySupportRecorded)}</div></div><div class="amount">${thb(h.normalizedKnown)}</div></div><div class="small">Normalized known spending หลังตัด timing/one-off ที่ระบุได้ ${oo?`· one-off/timing ${thb(oo)}`:''}</div>${h.oneOff.map(x=>`<div class="meta">• ${x.label}: ${thb(x.amount)} — ${x.treatment}</div>`).join('')}<div class="meta">Provisional ${thb(h.provisional)} · unresolved ${thb(h.unresolved)} (ยังไม่นำไปบังคับเป็น expense)</div></div>`;
}
function renderMonthly(){
  const essentials=state.essentialPlan.map(s=>`<div class="row"><div><div class="name">${s.name}</div><div class="meta">${s.priority} · ${s.responsibility}</div></div><div class="amount">${thb(s.amount)}</div></div>`).join('');
  const subs=state.subscriptions.map(s=>`<div class="row"><div><div class="name">${s.name}</div><div class="meta">${s.priority} · bucket: ${s.bucket} · ${s.action}</div></div><div class="amount">${s.amount?thb(s.amount):'—'}</div></div>`).join('');
  document.querySelector('#monthly').innerHTML=`<div class="top"><div><div class="brand">Monthly Review</div><div class="sub">baseline + exceptions · เป้าหมาย 5–10 นาที</div></div></div>
  <div class="note"><b>Merchant ≠ Category.</b> Shopee/Grab/Apple เป็น merchant/channel; Essential vs Discretionary ตัดสินจาก purpose + priority. Subscription เป็น cross-cut ไม่ใช่ budget bucket แยก จึงไม่ double count.</div>
  <div class="section-title">Essential plan</div><div class="card">${essentials}</div>
  <div class="section-title">Jun–Aug evidence</div>${state.historical.map(historicalCard).join('')}
  <div class="section-title">Subscriptions</div><div class="card">${subs}</div>
  <div class="section-title">Gov Note Interpreter</div><div class="card"><input id="govnote" class="input" placeholder="เช่น คืนเงินเหลือจากเงินยืมราชการ 2,300"><div class="footer-actions"><button id="parse" class="btn primary">Interpret</button></div><div id="parsed" class="meta" style="margin-top:10px"></div></div>
  <div class="section-title">Backup</div><div class="card"><div class="meta">MVP เก็บ state ใน browser เครื่องนี้ ไม่ได้ส่งข้อมูลการเงินขึ้น GitHub</div><div class="actions"><button id="export" class="btn">Export JSON</button><button id="reset" class="btn">Reset baseline</button></div></div>`;
  document.querySelector('#parse').onclick=()=>{const r=parseGovNote(document.querySelector('#govnote').value);document.querySelector('#parsed').textContent=`${r.type} → ${r.effect}`};
  document.querySelector('#export').onclick=()=>{const blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='pao-me-backup-v1.1.json';a.click();URL.revokeObjectURL(a.href)};
  document.querySelector('#reset').onclick=()=>{localStorage.removeItem(STORAGE_KEY);location.reload()};
}
function showTab(name){document.querySelectorAll('main>section').forEach(s=>s.classList.toggle('hidden',s.id!==name));document.querySelectorAll('.tab').forEach(t=>t.classList.toggle('active',t.dataset.tab===name));}
function renderAll(){renderHome();renderInbox();renderMonthly();}
document.querySelectorAll('.tab').forEach(t=>t.onclick=()=>showTab(t.dataset.tab));
renderAll();showTab('home');
if('serviceWorker' in navigator) navigator.serviceWorker.register('./sw.js').catch(()=>{});
