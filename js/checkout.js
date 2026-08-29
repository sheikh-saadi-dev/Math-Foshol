let PRODS=[];

(async()=>{
 try{PRODS=await getAllProducts();}catch(e){toast('পণ্য লোড হয়নি','err');}
 render();
})();

function items(){return getCart().map(i=>({...i,p:PRODS.find(x=>x.id===i.id)})).filter(i=>i.p);}
function totals(){
 const sub=items().reduce((s,i)=>s+i.p.price*i.qty,0);
 const r=document.querySelector('input[name=deliv]:checked');
 const ship=items().length?(r&&r.value==='out'?SETTINGS.out:SETTINGS.city):0;
 return {sub,ship,total:sub+ship};
}
function refreshTotals(){
 const t=totals(),el=$('#totEl');
 if(el)el.textContent=tk(t.total);
}

function render(){
 const box=$('#coBox');
 if(!items().length){
  box.innerHTML=`<div class="empty-msg"><div style="font-size:3.4rem">🧺</div><h3 class="ff-t" style="margin:10px 0">কার্ট খালি</h3><a href="shop.html" class="btn btn-gold">বীজ ভাণ্ডারে যান</a></div>`;
  return;
 }
 box.innerHTML=`<div class="order-grid">
  <form class="panel" id="coForm" novalidate>
   <h3 class="ff-t" style="margin-bottom:16px">📝 ডেলিভারির তথ্য</h3>
   <div class="field"><label>আপনার নাম *</label><input id="co-name" placeholder="যেমন: আব্দুল করিম"></div>
   <div class="field"><label>মোবাইল নম্বর *</label><input id="co-phone" inputmode="tel" placeholder="01XXXXXXXXX"></div>
   <div class="field"><label>সম্পূর্ণ ঠিকানা *</label><textarea id="co-addr" rows="3" placeholder="গ্রাম/বাসা, থানা, জেলা"></textarea></div>
   <div class="field"><label>ডেলিভারি এলাকা</label>
    <div class="deliv-pick">
     <label><input type="radio" name="deliv" value="city" checked><span>ঢাকা সিটি — ৳<span data-scity>৬০</span></span></label>
     <label><input type="radio" name="deliv" value="out"><span>বাইরে — ৳<span data-sout>১২০</span></span></label>
    </div>
   </div>
   <div class="field"><label>পেমেন্ট মাধ্যম</label>
    <div class="pay-opt">
     <label><input type="radio" name="pay" value="ক্যাশ অন ডেলিভারি" checked>💵 ক্যাশ অন ডেলিভারি</label>
     <label><input type="radio" name="pay" value="বিকাশ/নগদ (অগ্রিম)">📱 বিকাশ/নগদ</label>
    </div>
   </div>
   <button type="submit" class="btn btn-green" id="coBtn" style="width:100%">✓ অর্ডার নিশ্চিত করুন</button>
  </form>
  <div class="panel">
   <h3 class="ff-t" style="margin-bottom:12px">🧺 আপনার বীজগুলো</h3>
   ${items().map(i=>`<div class="sum-item"><span>${esc(i.p.name)} × ${bn(i.qty)}</span><b>${tk(i.p.price*i.qty)}</b></div>`).join('')}
   <div class="trow total"><span>সর্বমোট (ডেলিভারিসহ)</span><b id="totEl">৳০</b></div>
  </div>
 </div>`;
 applySettings();refreshTotals();
 $$('#coBox input[name=deliv]').forEach(r=>r.onchange=refreshTotals);

 $('#coForm').onsubmit=async e=>{
  e.preventDefault();
  const name=$('#co-name').value.trim(),phone=enD($('#co-phone').value.trim()),addr=$('#co-addr').value.trim();
  let ok=true;
  const mark=(el,cond)=>{el.closest('.field').classList.toggle('bad',!cond);if(!cond)ok=false;};
  mark($('#co-name'),name.length>=2);
  mark($('#co-phone'),/^01[3-9]\d{8}$/.test(phone));
  mark($('#co-addr'),addr.length>=8);
  if(!ok)return toast('সব ঘর সঠিকভাবে পূরণ করুন','err');

  const btn=$('#coBtn');btn.disabled=true;btn.textContent='অর্ডার পাঠানো হচ্ছে…';
  const t=totals();
  const id='MF-'+Date.now().toString(36).toUpperCase();
  try{
   await db.collection('orders').doc(id).set({
    items:items().map(i=>({id:i.p.id,name:i.p.name,price:i.p.price,qty:i.qty})),
    sub:t.sub,ship:t.ship,total:t.total,name,phone,address:addr,
    pay:document.querySelector('input[name=pay]:checked').value,
    status:'pending',date:Date.now()
   });
   setCart([]);
   box.innerHTML=`<div class="empty-msg" style="padding:70px 20px">
    <div style="width:90px;height:90px;margin:0 auto 18px;background:var(--g600);border-radius:50%;display:grid;place-items:center;font-size:2.6rem;color:#fff;animation:cardIn .6s">✓</div>
    <h2 class="ff-t">অর্ডার সফল হয়েছে!</h2>
    <p style="margin:10px 0">আপনার অর্ডার নম্বর</p>
    <span style="display:inline-block;background:var(--gold);color:var(--g950);font-weight:700;border-radius:10px;padding:8px 22px;font-size:1.2rem">${id}</span>
    <p style="margin:16px auto;max-width:44ch;color:var(--mut)">আমাদের টিম শীঘ্রই ফোন করে অর্ডারটি নিশ্চিত করবে। অর্ডারের খোঁজ নিতে <a href="track-order.html" style="color:var(--g700);font-weight:700">অর্ডার ট্র্যাক</a> পেজে আপনার মোবাইল নম্বর দিন।</p>
    <a href="shop.html" class="btn btn-gold" style="margin-top:10px">আরও কেনাকাটা করুন</a></div>`;
   window.scrollTo({top:0,behavior:'smooth'});
  }catch(err){
   console.error(err);btn.disabled=false;btn.textContent='✓ অর্ডার নিশ্চিত করুন';
   toast('অর্ডার পাঠানো যায়নি, আবার চেষ্টা করুন','err');
  }
 };
}
