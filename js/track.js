const STEPS=['pending','confirmed','shipped','delivered'];
const LBL={pending:'অর্ডার হয়েছে',confirmed:'নিশ্চিত',shipped:'পাঠানো হয়েছে',delivered:'ডেলিভারড'};

$('#trForm').onsubmit=async e=>{
 e.preventDefault();
 const phone=enD($('#trPhone').value.trim());
 if(!/^01[3-9]\d{8}$/.test(phone))return toast('সঠিক মোবাইল নম্বর দিন','err');
 const box=$('#trResults');
 box.innerHTML='<p class="loading">খোঁজা হচ্ছে…</p>';
 try{
  const snap=await db.collection('orders').where('phone','==',phone).get();
  const orders=snap.docs.map(d=>({id:d.id,...d.data()})).sort((a,b)=>(b.date||0)-(a.date||0));
  if(!orders.length){box.innerHTML='<p class="empty-msg">এই নম্বরে কোনো অর্ডার পাওয়া যায়নি 🌾</p>';return;}
  box.innerHTML=orders.map(o=>{
   const idx=o.status==='cancelled'?-1:STEPS.indexOf(o.status);
   return `<div class="track-card">
    <div class="ohead"><b style="font-size:1.05rem">${o.id}</b>
     ${o.status==='cancelled'?'<span class="cancel-badge">বাতিল</span>':`<span class="os os-${o.status}">${STL[o.status]}</span>`}
    </div>
    <div style="font-size:.9rem;color:var(--mut)">📅 ${new Date(o.date).toLocaleDateString('bn-BD',{day:'numeric',month:'long',year:'numeric'})} • ${o.items.length}টি পণ্য • মোট ${tk(o.total)}</div>
    <div class="oitems">${o.items.map(i=>`${esc(i.name)} × ${bn(i.qty)}`).join(' • ')}</div>
    ${o.status!=='cancelled'?`<div class="tl">${STEPS.map((s,i)=>`
     <div class="tl-step ${i<idx?'done':''} ${i===idx?'now':''}"><i>${i<idx?'✓':bn(i+1)}</i><span>${LBL[s]}</span></div>`).join('')}
    </div>`:''}
   </div>`;
  }).join('');
 }catch(err){console.error(err);box.innerHTML='<p class="empty-msg" style="color:var(--red)">খুঁজতে সমস্যা হয়েছে, আবার চেষ্টা করুন।</p>';}
};
