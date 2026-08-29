auth.onAuthStateChanged(u=>{if(u)location.replace('admin/');});

const ERR={
 'auth/invalid-credential':'ইমেইল বা পাসওয়ার্ড ভুল',
 'auth/user-not-found':'এই ইমেইলে কোনো অ্যাকাউন্ট নেই',
 'auth/wrong-password':'পাসওয়ার্ড ভুল',
 'auth/invalid-email':'ইমেইল ঠিকানাটি সঠিক নয়',
 'auth/too-many-requests':'অনেকবার ভেষ্ট চেষ্টা হয়েছে, একটু পরে চেষ্টা করুন'
};

$('#loginForm').onsubmit=async e=>{
 e.preventDefault();
 const btn=$('#lgBtn');btn.disabled=true;btn.textContent='লগইন হচ্ছে…';
 $('#lgErr').style.display='none';
 try{
  await auth.signInWithEmailAndPassword($('#lg-email').value.trim(),$('#lg-pw').value);
  location.href='admin/';
 }catch(err){
  $('#lgErr').textContent=ERR[err.code]||'লগইন করা যায়নি ('+err.code+')';
  $('#lgErr').style.display='block';
  btn.disabled=false;btn.textContent='লগইন করুন';
 }
};
