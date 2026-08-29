let PRODS=[];

(async()=>{
 try{PRODS=await getAllProducts();}catch(e){}
 renderCartPage();
})();

function cartItems(){
 return getCart().map(i=>({...i,p:PRODS.find(x=>x.id===i.id)})).filter(i=>i.p);
}
function totals(){
 const items=cartItems();
 const sub=items.reduce((s,i)=>s+i.p.price*i.qty,0);
 const r=document.querySelector('input[name=deliv]:checked');
 const ship=items.length?(r&&r.value==='out'?SETTINGS.out:SETTINGS.city):0;
 return {sub,ship,total:sub+ship};
}
function refreshTotals(){
 const t=totals();
 const s=$('#subEl');if(!s)return;
 $('#subEl').textContent=tk(t.sub);
 $('#shipEl').textContent=tk(t.ship);
 $('#totEl').textContent=tk(t.total);
}

function renderCartPage(){
 const box=$('#cartBox');
 const items=cartItems();
 /* যেসব কার্ট আইটেম আর ফায়ারস্টোরে নেই সেগুলো বাদ */
 const valid=getCart().filter(i=>PRODS.find(x=>x.id===i.id));
 if(valid.length!==getCart().length)setCart(valid);

 if(!items.length){
  box.innerHTML=`<div class="empty-msg"><div style="font-size:3.4rem">🌱</div>
   <h3 class="ff-t" style="margin:10px 0 6px">আপনার কার্ট খালি</h3>
   <p>পছন্দের বীজ যোগ করুন, ফলনের প্রস্তুতি শুরু হোক!</p>
   <br><a href="shop.html" class="btn btn-gold">বীজ ভাণ্ডারে যান</a></div>`;
  return;
 }
 box.innerHTML=`<div class="order-grid">
  <div class="panel">
   ${items.map(i=>`<div class="citem">
    <img src="${esc(i.p.img)}" alt="">
    <div><h4><a href="product.html?id=${i.p.id}">${esc(i.p.name)}</a></h4><div class="cp">${tk(i.p.price)} / প্যাকেট</div>
     <div class="qty"><button data-dec="${i.p.id}">−</button><b>${bn(i.qty)}</b><button data-inc="${i.p.id}">+</button></div></div>
    <div style="text-align:right"><b>${tk(i.p.price*i.qty)}</b><br><button class="cdel" data-rem="${i.p.id}">🗑</button></div>
   </div>`).join('')}
  </div>
  <div class="panel">
   <h3 class="ff-t" style="margin-bottom:12px">অর্ডার সারসংক্ষেপ</h3>
   <label style="font-weight:600;font-size:.9rem">ডেলিভারি এলাকা</label>
   <div class="deliv-pick">
    <label><input type="radio" name="deliv" value="city" checked><span>ঢাকা সিটি — ৳<span data-scity>৬০</span></span></label>
    <label><input type="radio" name="deliv" value="out"><span>বাইরে — ৳<span data-sout>১২০</span></span></label>
   </div>
   <div class="trow"><span>সাবটোটাল (${bn(cartCount())}টি)</span><b id="subEl">৳০</b></div>
   <div class="trow"><span>ডেলিভারি চার্জ</span><b id="shipEl">৳০</b></div>
   <div class="trow total"><span>সর্বমোট</span><b id="totEl">৳০</b></div>
   <a href="checkout.html" class="btn btn-gold" style="width:100%;margin-top:14px">অর্ডার করুন →</a>
  </div>
 </div>`;
 applySettings();refreshTotals();

 box.addEventListener('click',e=>{
  const cart=getCart();
  const inc=e.target.closest('[data-inc]'),dec=e.target.closest('[data-dec]'),rem=e.target.closest('[data-rem]');
  if(inc){const it=cart.find(i=>i.id===inc.dataset.inc);const p=PRODS.find(x=>x.id===it.id);if(it.qty<p.stock)it.qty++;setCart(cart);renderCartPage();}
  if(dec){const it=cart.find(i=>i.id===dec.dataset.dec);it.qty--;if(it.qty<=0)cart.splice(cart.indexOf(it),1);setCart(cart);renderCartPage();}
  if(rem){setCart(cart.filter(i=>i.id!==rem.dataset.rem));renderCartPage();toast('পণ্যটি বাদ দেওয়া হলো');}
 });
 $$('#cartBox input[name=deliv]').forEach(r=>r.onchange=refreshTotals);
}
