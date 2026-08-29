/* ফিচার্ড পণ্য + ক্যাটাগরি (ফায়ারস্টোর থেকে) */
(async function(){
 const grid=$('#featGrid');
 try{
  const prods=await getAllProducts();
  const feat=[...prods].sort((a,b)=>(b.rating||0)-(a.rating||0)).slice(0,4);
  grid.innerHTML=feat.length?feat.map((p,i)=>productCard(p,i)).join('')
   :'<p class="loading">এখনো কোনো পণ্য যোগ হয়নি — অ্যাডমিন প্যানেল থেকে পণ্য যোগ করুন 🌱</p>';
  const cats=[...new Set(prods.map(p=>p.cat))];
  $('#catStrip').innerHTML=cats.map(c=>`<a class="cat-pill" href="shop.html?cat=${encodeURIComponent(c)}">${catEmoji(c)} ${esc(c)}</a>`).join('');
 }catch(e){
  grid.innerHTML='<p class="loading" style="color:var(--red)">পণ্য লোড করা যায়নি — ফায়ারবেজ কনফিগ চেক করুন</p>';
 }
})();

/* কাউন্টার অ্যানিমেশন */
(function(){
 $$('.hstat .num').forEach(el=>{
  const target=+el.dataset.n,suf=el.dataset.suf||'',t0=performance.now(),dur=1400;
  (function step(t){const p=Math.min((t-t0)/dur,1),v=Math.round(target*(1-Math.pow(1-p,3)));
   el.textContent=bn(v.toLocaleString('en-IN'))+suf;
   if(p<1)requestAnimationFrame(step);})(t0);
 });
})();

/* মতামত */
const QUOTES=[
 ['★★★★★','টমেটো বীজের ফলন দেখে পাড়া-প্রতিবেশীও আমার কাছ থেকে বীজ নিতে এসেছে!','রফিকুল ইসলাম','বগুড়া'],
 ['★★★★★','স্ট্রবেরি বীজ গজানোর হার সত্যিই অসাধারণ, ৯০ ভাগের বেশি চারা উঠেছে।','শারমিন আক্তার','সিলেট'],
 ['★★★★☆','বিগ বস কুমড়া একেকটা ৮–১০ কেজি ওজন হয়েছে। বাজারে বিক্রি করে লাভবান হচ্ছি।','আব্দুল কুদ্দুস','যশোর'],
 ['★★★★★','ডেলিভারি দ্রুত, প্যাকেজিং সুন্দর, বপনের পরামর্শও দেন।','মাহমুদা বেগম','কুমিল্লা'],
 ['★★★★★','বাঁশ লাউ বীজ থেকে এবার ছাদ বাগানে ৩০টারও বেশি লাউ পেয়েছি!','তানভীর হোসেন','ঢাকা']
];
const tmHtml=QUOTES.map(q=>`<div class="tq"><div class="stars">${q[0]}</div><p>“${q[1]}”</p><b>${q[2]}</b><small>📍 ${q[3]}</small></div>`).join('');
$('#tm1').innerHTML=tmHtml; $('#tm2').innerHTML=tmHtml;
