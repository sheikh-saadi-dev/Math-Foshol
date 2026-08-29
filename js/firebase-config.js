/* ============================================
   আপনার ফায়ারবেজ প্রজেক্টের কনফিগ এখানে বসান
   Firebase Console → Project Settings → My apps → Web app
============================================ */

// আপনার ফায়ারবেজ কনফিগারেশন (Compat CDN ভার্সনের জন্য)
const firebaseConfig = {
  apiKey: "AIzaSyAdoEzUMtk7F3_fsHWHWclpxOCy2dXTQnA",
  authDomain: "math-foshol.firebaseapp.com",
  projectId: "math-foshol",
  storageBucket: "math-foshol.firebasestorage.app",
  messagingSenderId: "728364290370",
  appId: "1:728364290370:web:01372da03a13a6164638db"
};

// Firebase ইনিশিয়ালাইজ (আমাদের HTML-এ থাকা compat script এর জন্য)
firebase.initializeApp(firebaseConfig);

// ডেটাবেস, অথেনটিকেশন ও স্টোরেজ রেডি করা
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();
