let ALL=[],curCat='সব',q='',sortBy='pop';

(async()=>{
 const params=new URLSearchParams(location.search);
 curCat=params.get('cat')||'সব';
 q=(params.get('q')||'').toLowerCase();
 $('#q').value=q;
 try{ALL=await getAllProducts();}
 catch(e){$('#grid').innerHTML='<p class="loading" style="color:var(--red)">পণ্য লোড করা যায়নি — কনফিগ চেক করুন</p>';return;}
 renderChips();renderGrid();
})();

function renderChips(){
 const cats=['সব',...new Set(ALL.map(p=>p.cat))];
 $('#chips').innerHTML=cats.map(c=>`<button class="chip ${c===curCat?'on':''}" data-cat="${esc(c)}">${c==='সব'?'🌾 সব':catEmoji(c)+' '+esc(c)}</button>`).join('');
 $$('#chips .chip').forEach(b=>b.onclick=()=>{curCat=b.dataset.cat;renderChips();renderGrid();});
}

function renderGrid(){
 let list=ALL.filter(p=>(curCat==='সব'||p.cat===curCat)&&(!q||(p.name+p.desc+p.cat).toLowerCase().includes(q)));
 if(sortBy==='low')list.sort((a,b)=>a.price-b.price);
 else if(sortBy==='high')list.sort((a,b)=>b.price-a.price);
 else list.sort((a,b)=>(b.rating||0)-(a.rating||0));
 $('#emptyMsg').style.display=list.length?'none':'block';
 $('#grid').innerHTML=list.map((p,i)=>productCard(p,i)).join('');
}

$('#q').oninput=e=>{q=e.target.value.trim().toLowerCase();renderGrid();};
$('#sort').onchange=e=>{sortBy=e.target.value;renderGrid();};
