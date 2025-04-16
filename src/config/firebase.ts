import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase yapılandırma bilgileri
// Bu bilgileri Firebase Console'dan almalısınız:
// 1. https://console.firebase.google.com/ adresine gidin
// 2. Projenizi seçin veya yeni bir proje oluşturun
// 3. Proje ayarlarına gidin (⚙️ simgesi)
// 4. "Genel" sekmesinde aşağı kaydırın ve "Firebase SDK snippet" bölümünü bulun
// 5. "Config" seçeneğini seçin ve aşağıdaki bilgileri kopyalayın
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA_7MPpyLzWJyE-QX7n2yr7DbNKeVXQxCI",
  authDomain: "kura-474c0.firebaseapp.com",
  projectId: "kura-474c0",
  storageBucket: "kura-474c0.firebasestorage.app",
  messagingSenderId: "961321257372",
  appId: "1:961321257372:web:9bce8d1a92ae09ac71e059",
  measurementId: "G-P3GJVVQTN3"
};

// Firebase uygulamasını başlat
const app = initializeApp(firebaseConfig);

// Auth ve Firestore servislerini dışa aktar
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app); 