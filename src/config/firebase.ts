import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Firebase yapılandırma bilgileri
// Bu bilgileri Firebase Console'dan almalısınız:
// 1. https://console.firebase.google.com/ adresine gidin
// 2. Projenizi seçin veya yeni bir proje oluşturun
// 3. Proje ayarlarına gidin (⚙️ simgesi)
// 4. "Genel" sekmesinde aşağı kaydırın ve "Firebase SDK snippet" bölümünü bulun
// 5. "Config" seçeneğini seçin ve aşağıdaki bilgileri kopyalayın
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Firebase uygulamasını başlat
const app = initializeApp(firebaseConfig);

// Auth servisini dışa aktar
export const auth = getAuth(app); 