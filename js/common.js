/* ---------- হেল্পার ---------- */
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const bn=n=>String(n).replace(/[0-9]/g,d=>'০১২৩৪৫৬৭৮৯'[d]);
const enD=s=>String(s).replace(/[০-৯]/g,d=>'০১২৩৪৫৬৭৮৯'.indexOf(d));
const tk=n=>'৳'+Number(n||0).toLocaleString('en-IN').replace(/[0-9]/g,d=>'০১২৩৪৫৬৭৮৯'[d]);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const catEmoji=c=>({'সবজি বীজ':'🥬','ফলের বীজ':'🍓','লাউ ও কুমড়া':'🎃','ফুলের বীজ':'🌻','পাতা ও মসলা':'🌿'}[c]||'🌱');
const STL={pending:'অপেক্ষমাণ',confirmed:'নিশ্চিত',shipped:'পাঠানো হয়েছে',delivered:'ডেলিভারড',cancelled:'বাতিল'};

function toast(msg,type){
 let box=$('#toasts');
 if(!box){box=document.createElement('div');box.id='toasts';document.body.appendChild(box);}
 const t=document.createElement('div');t.className='toast'+(type==='err'?' err':'');t.textContent=msg;
 box.appendChild(t);
 setTimeout(()=>{t.style.transition='all .4s';t.style.opacity='0';t.style.transform='translateY(14px)';setTimeout(()=>t.remove(),400)},3000);
}

/* ---------- সেটিংস (ফায়ারস্টোর) ---------- */
let SETTINGS={city:60,out:120,phone:'01700-000000'};
async function loadSettings(){
 try{
  const d=await db.collection('settings').doc('global').get();
  if(d.exists)SETTINGS={...SETTINGS,...d.data()};
 }catch(e){}
 applySettings();
}
function applySettings(){
 $$('[data-scity]').forEach(e=>e.textContent=bn(SETTINGS.city));
 $$('[data-sout]').forEach(e=>e.textContent=bn(SETTINGS.out));
 $$('[data-phone]').forEach(e=>e.textContent=bn(SETTINGS.phone));
 $$('[data-tel]').forEach(a=>a.href='tel:'+SETTINGS.phone.replace(/[^0-9]/g,''));
 if(typeof refreshTotals==='function')refreshTotals();
}

/* ---------- পণ্য (ফায়ারস্টোর ক্যাশ) ---------- */
let PRODUCTS_CACHE=null;
async function getAllProducts(){
 if(PRODUCTS_CACHE)return PRODUCTS_CACHE;
 const snap=await db.collection('products').get();
 PRODUCTS_CACHE=snap.docs.map(d=>({id:d.id,...d.data()}));
 return PRODUCTS_CACHE;
}

/* ---------- কার্ট (লোকাল) ---------- */
function getCart(){try{return JSON.parse(localStorage.getItem('mf_cart'))||[]}catch(e){return[]}}
function setCart(c){localStorage.setItem('mf_cart',JSON.stringify(c));updateCartBadge();}
function cartCount(){return getCart().reduce((s,i)=>s+i.qty,0);}
function updateCartBadge(){const el=$('#cartCount');if(el)el.textContent=bn(cartCount());}

async function addToCart(id,qty=1){
 try{
  const prods=await getAllProducts();
  const p=prods.find(x=>x.id===id);
  if(!p||(p.stock||0)<=0)return toast('দুঃখিত, এই বীজটি এখন স্টকে নেই','err');
  const cart=getCart();const it=cart.find(i=>i.id===id);
  const cur=it?it.qty:0;
  if(cur+qty>p.stock)return toast('দুঃখিত, এর বেশি স্টক নেই','err');
  it?it.qty+=qty:cart.push({id,qty});
  setCart(cart);
  toast('🧺 কার্টে যোগ হয়েছে: '+p.name);
 }catch(e){toast('সমস্যা হয়েছে, আবার চেষ্টা করুন','err');}
}

/* ---------- প্রোডাক্ট কার্ড ---------- */
function productCard(p,i=0){
 const disc=p.old>p.price?Math.round((1-p.price/p.old)*100):0;
 const stockHtml=(p.stock||0)<=0?'<span style="color:var(--red);font-weight:700">স্টক শেষ</span>'
  :p.stock<20?`<span class="stock-low">মাত্র ${bn(p.stock)}টি বাকি!</span>`:'<span class="stock-ok">✓ স্টকে আছে</span>';
 return `<div class="pcard" style="animation-delay:${i*45}ms">
  <a class="pimg" href="product.html?id=${p.id}"><img src="${esc(p.img)}" alt="${esc(p.name)}" loading="lazy">
   <div class="pbadge">${disc?`<span class="bg-gold">−${bn(disc)}%</span>`:''}${p.badge?`<span class="bg-green">${esc(p.badge)}</span>`:''}</div></a>
  <div class="pbody">
   <div class="pcat">${catEmoji(p.cat)} ${esc(p.cat)}</div>
   <h3><a href="product.html?id=${p.id}">${esc(p.name)}</a></h3>
   <p class="pdesc">${esc(p.desc||'')}</p>
   <div class="prow"><span class="rate">★ ${bn(p.rating||'৪.৫')}</span>${stockHtml}</div>
   <div class="pfoot"><div class="price">${tk(p.price)}${p.old>p.price?`<s>${tk(p.old)}</s>`:''}</div>
   <button class="addbtn" data-add="${p.id}" ${p.stock<=0?'disabled':''}>${p.stock<=0?'শেষ':'🧺 কার্টে'}</button></div>
  </div></div>`;
}

/* ---------- নেভিগেশন ---------- */
document.addEventListener('DOMContentLoaded',()=>{
 loadSettings();
 updateCartBadge();
 const burger=$('#burger');
 if(burger)burger.onclick=()=>$('#navLinks').classList.toggle('open');
 const pg=location.pathname.split('/').pop()||'index.html';
 $$('nav.links a').forEach(a=>{if(a.getAttribute('href')===pg)a.classList.add('act');});
 window.addEventListener('scroll',()=>$('#hdr')&&$('#hdr').classList.toggle('sc',scrollY>10),{passive:true});
});

/* কার্টে যোগ — সব পেজে কাজ করে */
document.addEventListener('click',e=>{
 const a=e.target.closest('[data-add]');
 if(a)addToCart(a.dataset.add,+a.dataset.qty||1);
});
