/* ---------- অথ গার্ড ---------- */
auth.onAuthStateChanged(u=>{
 if(!u){location.replace('../login.html');return;}
 $('#admEmail').textContent='👤 '+u.email;
 init();
});
$('#admExit').onclick=async()=>{await auth.signOut();location.replace('../login.html');};

let PRODUCTS=[],ORDERS=[];
const SEED=[
 {name:'হাইব্রিড টমেটো বীজ — সুলতান-৭',cat:'সবজি বীজ',price:120,old:150,stock:140,rating:4.9,badge:'হাইব্রিড',desc:'গাছপ্রতি ৪–৫ কেজি ফলন, রোগসহনশীল ও দীর্ঘদিন সংরক্ষণযোগ্য।',img:'https://picsum.photos/seed/hybrid-tomato-seeds/600/600'},
 {name:'প্রিমিয়াম স্ট্রবেরি বীজ',cat:'ফলের বীজ',price:250,old:300,stock:60,rating:4.8,badge:'জনপ্রিয়',desc:'ঠান্ডা মৌসুমে দারুণ ফলন, মিষ্টি ও সুগন্ধি ফল। টবেও চাষযোগ্য।',img:'https://picsum.photos/seed/strawberry-seeds-red/600/600'},
 {name:'হাইব্রিড চাইনিজ বাঁশ লাউ বীজ',cat:'লাউ ও কুমড়া',price:180,old:220,stock:90,rating:4.9,badge:'হাইব্রিড',desc:'লম্বা, সোজা ও নরম বাঁশ লাউ; মাচায় অসাধারণ ফলন।',img:'https://picsum.photos/seed/chinese-bottle-gourd/600/600'},
 {name:'বিগ বস কুমড়া বীজ',cat:'লাউ ও কুমড়া',price:160,old:200,stock:75,rating:4.7,badge:'সেরা ফলন',desc:'একেকটি কুমড়া ৮–১০ কেজি পর্যন্ত, মিষ্টি ও ঘন শাঁস।',img:'https://picsum.photos/seed/big-boss-pumpkin/600/600'},
 {name:'হাইব্রিড শসা বীজ — গ্রিন কিং',cat:'সবজি বীজ',price:110,old:0,stock:120,rating:4.6,badge:'',desc:'খাসখাসে ফল, দ্রুত বর্ধনশীল লতানো জাত।',img:'https://picsum.photos/seed/hybrid-cucumber-seeds/600/600'},
 {name:'হাইব্রিড মরিচ বীজ — তীব্র',cat:'সবজি বীজ',price:130,old:0,stock:100,rating:4.7,badge:'হাইব্রিড',desc:'ঝাল ও সুগন্ধি, গাছপ্রতি প্রচুর ফলন।',img:'https://picsum.photos/seed/hybrid-chili-seeds/600/600'},
 {name:'সূর্যমুখী ফুলের বীজ',cat:'ফুলের বীজ',price:90,old:110,stock:80,rating:4.8,badge:'নতুন',desc:'বড়, উজ্জ্বল হলুদ ফুল; বাগান ও ছাদে দারুণ মানায়।',img:'https://picsum.photos/seed/sunflower-seeds-yellow/600/600'},
 {name:'হাইব্রিড তরমুজ বীজ — সুইট রেড',cat:'ফলের বীজ',price:200,old:240,stock:55,rating:4.8,badge:'হাইব্রিড',desc:'গভীর লাল শাঁস, উচ্চ মিষ্টতা, ৬–৮ কেজি ফল।',img:'https://picsum.photos/seed/hybrid-watermelon/600/600'},
 {name:'হাইব্রিড বেগুন বীজ — লম্বা সবুজ',cat:'সবজি বীজ',price:125,old:0,stock:110,rating:4.5,badge:'',desc:'নরম, কম বীজযুক্ত ফল; বছরজুড়ে চাষযোগ্য।',img:'https://picsum.photos/seed/hybrid-brinjal-seeds/600/600'},
 {name:'জারবেরা মিক্স ফুলের বীজ',cat:'ফুলের বীজ',price:140,old:170,stock:65,rating:4.6,badge:'নতুন',desc:'রঙধনু জারবেরা — লাল, হলুদ, গোলাপি মিক্স।',img:'https://picsum.photos/seed/gerbera-flower-seeds/600/600'},
 {name:'ধনে পাতা বীজ — দেশি',cat:'পাতা ও মসলা',price:70,old:0,stock:150,rating:4.7,badge:'দেশি',desc:'ঘন সুগন্ধি পাতা, ৩০ দিনেই ফসল ঘরে।',img:'https://picsum.photos/seed/coriander-seeds-green/600/600'},
 {name:'মিষ্টি ভুট্টা বীজ — সুপার সুইট',cat:'সবজি বীজ',price:150,old:180,stock:85,rating:4.8,badge:'হাইব্রিড',desc:'চিনির মতো মিষ্টি দানা, সেদ্ধ ও ভুনা দুটোতেই সেরা।',img:'https://picsum.photos/seed/sweet-corn-seeds/600/600'}
];

async function init(){
 await Promise.all([loadProducts(),loadOrders(),loadAdmSettings()]);
 renderDash();renderProdTbl();renderOrders();
}
async function loadProducts(){
 try{const s=await db.collection('products').get();PRODUCTS=s.docs.map(d=>({id:d.id,...d.data()}));}
 catch(e){toast('পণ্য লোড করা যায়নি','err');}
}
async function loadOrders(){
 try{const s=await db.collection('orders').get();ORDERS=s.docs.map(d=>({id:d.id,...d.data()})).sort((a,b)=>(b.date||0)-(a.date||0));}
 catch(e){toast('অর্ডার লোড করা যায়নি','err');}
}
async function loadAdmSettings(){
 try{const d=await db.collection('settings').doc('global').get();
  if(d.exists){SETTINGS={...SETTINGS,...d.data()};}
  $('#set-city').value=SETTINGS.city;$('#set-out').value=SETTINGS.out;$('#set-phone').value=SETTINGS.phone;
 }catch(e){}
}

/* ট্যাব */
$$('.atab').forEach(b=>b.onclick=()=>{
 $$('.atab').forEach(x=>x.classList.remove('on'));b.classList.add('on');
 $$('.tsec').forEach(s=>s.classList.remove('on'));$('#tab-'+b.dataset.tab).classList.add('on');
});

/* ড্যাশবোর্ড */
function renderDash(){
 $('#stProds').textContent=bn(PRODUCTS.length);
 $('#stPend').textContent=bn(ORDERS.filter(o=>o.status==='pending').length);
 $('#stDeliv').textContent=bn(ORDERS.filter(o=>o.status==='delivered').length);
 $('#stSales').textContent=tk(ORDERS.filter(o=>o.status!=='cancelled').reduce((s,o)=>s+(o.total||0),0));
 $('#seedBox').innerHTML=PRODUCTS.length===0
  ?`<div class="panel" style="text-align:center;background:#fdf7e4"><b>দোকান এখনো খালি!</b><p class="hint">এক ক্লিকে ১২টি ডেমো বীজ যোগ করুন, তারপর নিজের মতো এডিট করুন।</p><button class="btn btn-gold btn-sm" id="seedBtn" style="margin-top:10px">🌱 ডেমো পণ্য যোগ করুন</button></div>`:'';
 const sb=$('#seedBtn');
 if(sb)sb.onclick=seedProducts;
 $('#recentTbl').innerHTML=ORDERS.slice(0,5).map(o=>`<tr><td><b>${o.id}</b></td><td>${esc(o.name)}</td><td>${new Date(o.date).toLocaleDateString('bn-BD',{day:'numeric',month:'short'})}</td><td>${tk(o.total)}</td><td><span class="os os-${o.status}">${STL[o.status]}</span></td></tr>`).join('')
  ||'<tr><td colspan="5" style="text-align:center;color:var(--mut)">এখনো কোনো অর্ডার আসেনি 🌾</td></tr>';
}
async function seedProducts(){
 const btn=$('#seedBtn');btn.disabled=true;btn.textContent='যোগ হচ্ছে…';
 try{
  const batch=db.batch();
  SEED.forEach(p=>{const ref=db.collection('products').doc();batch.set(ref,{...p,createdAt:Date.now()});});
  await batch.commit();
  toast('✓ ১২টি ডেমো পণ্য যোগ হয়েছে');
  await loadProducts();renderDash();renderProdTbl();
 }catch(e){toast('যোগ করা যায়নি','err');btn.disabled=false;btn.textContent='🌱 ডেমো পণ্য যোগ করুন';}
}

/* পণ্য ফর্ম */
let imgData=null,uploadFile=null;
$('#addProdBtn').onclick=()=>{resetPForm();$('#prodForm').style.display='block';$('#prodForm').scrollIntoView({behavior:'smooth'});};
$('#pf-cancel').onclick=()=>$('#prodForm').style.display='none';
function resetPForm(){
 $('#pfForm').reset();$('#pf-id').value='';$('#pfTitle').textContent='নতুন পণ্য';
 imgData=null;uploadFile=null;$('#pf-prev').style.display='none';$('#pf-prev-txt').textContent='ছবির প্রিভিউ';
 $('#pf-upbar').style.display='none';
}
function setPrev(src){if(src){$('#pf-prev').src=src;$('#pf-prev').style.display='block';$('#pf-prev-txt').textContent='প্রিভিউ ✓';}}
$('#pf-imgfile').onchange=e=>{uploadFile=e.target.files[0]||null;if(uploadFile)setPrev(URL.createObjectURL(uploadFile));};
$('#pf-imgurl').oninput=e=>{if(!uploadFile&&e.target.value)setPrev(e.target.value);};

function uploadImage(file){
 return new Promise((res,rej)=>{
  const ref=storage.ref('products/'+Date.now()+'_'+file.name);
  const task=ref.put(file);
  $('#pf-upbar').style.display='block';
  task.on('state_changed',
   s=>{$('#pf-upfill').style.width=Math.round(s.bytesTransferred/s.totalBytes*100)+'%';},
   rej,
   async()=>{$('#pf-upfill').style.width='100%';res(await task.snapshot.ref.getDownloadURL());});
 });
}

$('#pfForm').onsubmit=async e=>{
 e.preventDefault();
 const btn=$('#pf-save');btn.disabled=true;btn.textContent='সংরক্ষণ হচ্ছে…';
 try{
  let img=$('#pf-imgurl').value.trim();
  if(uploadFile)img=await uploadImage(uploadFile);
  const old=PRODUCTS.find(p=>p.id===$('#pf-id').value);
  if(!img)img=old?old.img:'https://picsum.photos/seed/'+encodeURIComponent($('#pf-name').value.trim().slice(0,12)||'seed')+'/600/600';
  const data={
   name:$('#pf-name').value.trim(),cat:$('#pf-cat').value.trim()||'অন্যান্য',
   price:+$('#pf-price').value||0,old:+$('#pf-old').value||0,
   stock:+$('#pf-stock').value||0,rating:Math.min(5,+$('#pf-rate').value||4.8),
   badge:$('#pf-badge').value.trim(),desc:$('#pf-desc').value.trim(),img
  };
  if(!data.name||!data.price)throw {message:'নাম ও মূল্য দিন'};
  if($('#pf-id').value){await db.collection('products').doc($('#pf-id').value).update(data);}
  else{data.createdAt=Date.now();await db.collection('products').add(data);}
  toast('✓ পণ্য সংরক্ষিত হয়েছে');
  $('#prodForm').style.display='none';resetPForm();
  PRODUCTS_CACHE=null;await loadProducts();renderProdTbl();renderDash();
 }catch(err){toast(err.message||'সংরক্ষণ করা যায়নি','err');}
 btn.disabled=false;btn.textContent='💾 সংরক্ষণ করুন';
};

function renderProdTbl(){
 $('#catsList').innerHTML=[...new Set(PRODUCTS.map(p=>p.cat))].map(c=>`<option value="${esc(c)}">`).join('');
 $('#prodTbl').innerHTML=PRODUCTS.map(p=>`<tr>
  <td><img src="${esc(p.img)}" alt=""></td>
  <td><b>${esc(p.name)}</b>${p.badge?`<br><small style="color:var(--mut)">${esc(p.badge)}</small>`:''}</td>
  <td>${catEmoji(p.cat)} ${esc(p.cat)}</td>
  <td>${tk(p.price)}${p.old>p.price?` <s style="color:var(--mut);font-size:.8rem">${tk(p.old)}</s>`:''}</td>
  <td>${bn(p.stock)}</td>
  <td><button class="mini-btn mb-e" data-edit="${p.id}">✎ এডিট</button><button class="mini-btn mb-d" data-dp="${p.id}">🗑</button></td>
 </tr>`).join('')||'<tr><td colspan="6" style="text-align:center;color:var(--mut)">কোনো পণ্য নেই</td></tr>';

 $$('#prodTbl [data-edit]').forEach(b=>b.onclick=()=>{
  const p=PRODUCTS.find(x=>x.id===b.dataset.edit);if(!p)return;
  $('#pf-id').value=p.id;$('#pf-name').value=p.name;$('#pf-cat').value=p.cat;
  $('#pf-price').value=p.price;$('#pf-old').value=p.old||'';$('#pf-stock').value=p.stock;
  $('#pf-badge').value=p.badge||'';$('#pf-rate').value=p.rating||4.8;$('#pf-desc').value=p.desc||'';
  $('#pf-imgurl').value=(p.img||'').startsWith('data:')?'':(p.img||'');
  uploadFile=null;setPrev(p.img);
  $('#pfTitle').textContent='পণ্য এডিট করুন';$('#prodForm').style.display='block';
  $('#prodForm').scrollIntoView({behavior:'smooth'});
 });
 $$('#prodTbl [data-dp]').forEach(b=>b.onclick=async()=>{
  if(!confirm('এই পণ্যটি মুছে ফেলবেন?'))return;
  const p=PRODUCTS.find(x=>x.id===b.dataset.dp);
  try{
   if(p&&p.img&&p.img.includes('firebasestorage.app')){try{await storage.refFromURL(p.img).delete();}catch(e){}}
   await db.collection('products').doc(b.dataset.dp).delete();
   toast('পণ্য মুছে ফেলা হয়েছে');
   PRODUCTS_CACHE=null;await loadProducts();renderProdTbl();renderDash();
  }catch(e){toast('মুছা যায়নি','err');}
 });
}

/* অর্ডার */
$('#ordFilter').onchange=renderOrders;
function renderOrders(){
 const f=$('#ordFilter').value;
 const list=ORDERS.filter(o=>f==='all'||o.status===f);
 $('#ordList').innerHTML=list.length?list.map(o=>`
  <div class="ocard">
   <div class="ohead"><b>${o.id}</b><span class="os os-${o.status}">${STL[o.status]}</span></div>
   <div>👤 <b>${esc(o.name)}</b> • 📞 <a href="tel:${o.phone}" style="color:var(--g700);font-weight:600">${bn(o.phone)}</a></div>
   <div>📍 ${esc(o.address)}</div>
   <div class="oitems">${(o.items||[]).map(i=>`${esc(i.name)} × ${bn(i.qty)} = ${tk(i.price*i.qty)}`).join('<br>')}</div>
   <div style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:10px">
    <b style="font-size:1.05rem">মোট: ${tk(o.total)}</b>
    <small style="color:var(--mut)">${esc(o.pay)} • ${new Date(o.date).toLocaleString('bn-BD',{day:'numeric',month:'long',hour:'2-digit',minute:'2-digit'})}</small>
   </div>
   <div style="display:flex;gap:10px;align-items:center;margin-top:12px;flex-wrap:wrap">
    <label style="font-size:.88rem;font-weight:600">স্ট্যাটাস:</label>
    <select data-ost="${o.id}">${Object.keys(STL).map(s=>`<option value="${s}" ${o.status===s?'selected':''}>${STL[s]}</option>`).join('')}</select>
    <button class="mini-btn mb-d" data-do="${o.id}" style="margin-left:auto">🗑 মুছুন</button>
   </div>
  </div>`).join(''):'<p class="empty-msg">এই ফিল্টারে কোনো অর্ডার নেই 🌾</p>';

 $$('#ordList [data-ost]').forEach(s=>s.onchange=async()=>{
  await db.collection('orders').doc(s.dataset.ost).update({status:s.value});
  const o=ORDERS.find(x=>x.id===s.dataset.ost);if(o)o.status=s.value;
  renderOrders();renderDash();toast(`অর্ডার ${s.dataset.ost} → "${STL[s.value]}"`);
 });
 $$('#ordList [data-do]').forEach(b=>b.onclick=async()=>{
  if(!confirm('অর্ডারটি মুছে ফেলবেন?'))return;
  await db.collection('orders').doc(b.dataset.do).delete();
  ORDERS=ORDERS.filter(o=>o.id!==b.dataset.do);
  renderOrders();renderDash();toast('অর্ডার মুছে ফেলা হয়েছে');
 });
}

/* সেটিংস */
$('#saveSet').onclick=async()=>{
 const data={city:+$('#set-city').value||0,out:+$('#set-out').value||0,phone:$('#set-phone').value.trim()||SETTINGS.phone};
 try{await db.collection('settings').doc('global').set(data);SETTINGS={...SETTINGS,...data};toast('✓ সেটিংস সংরক্ষিত হয়েছে');}
 catch(e){toast('সংরক্ষণ করা যায়নি','err');}
};
