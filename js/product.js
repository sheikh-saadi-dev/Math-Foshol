(async()=>{
 const id=new URLSearchParams(location.search).get('id');
 if(!id)return location.href='shop.html';
 let prods=[],p=null;
 try{prods=await getAllProducts();p=prods.find(x=>x.id===id);}catch(e){}
 const wrap=$('#pdWrap');
 if(!p){wrap.innerHTML='<div class="wrap"><p class="empty-msg">পণ্যটি পাওয়া যায়নি 😕<br><br><a class="btn btn-green" href="shop.html">বীজ ভাণ্ডারে ফিরুন</a></p></div>';return;}

 document.title=p.name+' — মাঠ ফসল';
 const disc=p.old>p.price?Math.round((1-p.price/p.old)*100):0;
 const stockHtml=(p.stock||0)<=0?'<span style="color:var(--red)">✗ স্টক শেষ</span>'
  :p.stock<20?`<span class="stock-low">⚡ মাত্র ${bn(p.stock)} প্যাকেট বাকি!</span>`
  :`<span class="stock-ok">✓ স্টকে আছে (${bn(p.stock)} প্যাকেট)</span>`;

 wrap.innerHTML=`<div class="wrap pd-grid">
  <div class="pd-img"><img src="${esc(p.img)}" alt="${esc(p.name)}"></div>
  <div class="pd-info">
   <div class="pd-cat">${catEmoji(p.cat)} ${esc(p.cat)} ${p.badge?'• '+esc(p.badge):''}</div>
   <h1>${esc(p.name)}</h1>
   <div class="pd-rate">★ ${bn(p.rating||'৪.৫')} <span style="color:var(--mut);font-weight:400;font-size:.88rem">(${bn(Math.floor((p.rating||4.5)*120))}+ রিভিউ)</span></div>
   <div class="pd-price">${tk(p.price)}${p.old>p.price?`<s>${tk(p.old)}</s><span class="disc">−${bn(disc)}%</span>`:''}</div>
   <p class="pd-desc">${esc(p.desc||'কোনো বিবরণ যোগ করা হয়নি।')}</p>
   <div class="pd-stock">${stockHtml}</div>
   <div class="qty-step">
    <button type="button" id="qMinus">−</button><b id="pdQty">১</b><button type="button" id="qPlus">+</button>
   </div>
   <div class="pd-actions">
    <button class="btn btn-gold" id="addBtn" data-add="${p.id}" data-qty="1" ${p.stock<=0?'disabled':''}>🧺 কার্টে যোগ করুন</button>
    <button class="btn btn-green" id="buyBtn" ${p.stock<=0?'disabled':''}>⚡ এখনই অর্ডার করুন</button>
   </div>
   <ul class="pd-meta">
    <li>🚚 ডেলিভারি: ঢাকায় ৳<span data-scity>৬০</span>, বাইরে ৳<span data-sout>১২০</span> (২–৩ দিন)</li>
    <li>💵 ক্যাশ অন ডেলিভারি সুবিধা</li>
    <li>🌱 বপন নির্দেশিকা প্যাকেটের সঙ্গে ফ্রি</li>
    <li>☎ পরামর্শ: <span data-phone>০১৭০০-০০০০০০</span></li>
   </ul>
  </div>
 </div>`;
 applySettings();

 let qty=1;
 const upd=()=>{$('#pdQty').textContent=bn(qty);$('#addBtn').dataset.qty=qty;};
 $('#qMinus').onclick=()=>{if(qty>1){qty--;upd();}};
 $('#qPlus').onclick=()=>{if(qty<p.stock){qty++;upd();}};
 $('#buyBtn').onclick=async()=>{await addToCart(p.id,qty);location.href='checkout.html';};

 const rel=prods.filter(x=>x.cat===p.cat&&x.id!==p.id).slice(0,4);
 $('#relGrid').innerHTML=rel.length?rel.map((x,i)=>productCard(x,i)).join('')
  :'<p class="loading">এই ক্যাটাগরিতে আর কোনো বীজ নেই।</p>';
})();
