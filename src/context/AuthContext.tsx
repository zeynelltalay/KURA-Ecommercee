import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  User,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, setDoc, getDoc, getDocs, collection } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

interface AuthContextType {
  currentUser: User | null;
  isAdmin: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, userData: any) => Promise<void>;
  logout: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('Auth state changed:', user?.email);
      setCurrentUser(user);
      setIsAuthenticated(!!user);
      if (user) {
        await checkUserRole(user);
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const register = async (email: string, password: string, userData: any): Promise<void> => {
    try {
      console.log('Registering user:', email);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      console.log('User registered successfully:', user.email);
      
      // İlk kullanıcıyı admin olarak ayarla (sadece test için, gerçek uygulamada bu şekilde yapmayın)
      const isFirstUser = (await getDocs(collection(db, 'users'))).size === 0;
      
      // Kullanıcı dokümanını oluştur
      await setDoc(doc(db, 'users', user.uid), {
        ...userData,
        uid: user.uid,
        email: user.email,
        role: isFirstUser ? 'admin' : 'user', // İlk kullanıcıyı admin yap
        createdAt: new Date().toISOString()
      });
      
      console.log('User data saved to Firestore');
    } catch (error: any) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const login = async (email: string, password: string): Promise<void> => {
    try {
      console.log('Attempting login:', email);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('Login successful:', userCredential.user.email);
      await checkUserRole(userCredential.user);
      navigate('/profile');
    } catch (error: any) {
      console.error('Login error:', error);
      if (error.code === 'auth/user-not-found') {
        throw new Error('Bu e-posta adresi ile kayıtlı kullanıcı bulunamadı');
      } else if (error.code === 'auth/wrong-password') {
        throw new Error('Geçersiz şifre');
      } else {
        throw new Error('Giriş yapılırken bir hata oluştu');
      }
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await signOut(auth);
      setIsAdmin(false);
      setIsAuthenticated(false);
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const signInWithGoogle = async (): Promise<void> => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Firestore'a kullanıcı bilgilerini kaydet
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        lastLogin: new Date().toISOString(),
        provider: 'google'
      }, { merge: true }); // merge: true ile mevcut verileri koruyoruz

      await checkUserRole(user);
      navigate('/profile');
    } catch (error: any) {
      console.error('Google sign in error:', error);
      throw new Error('Google ile giriş yapılırken bir hata oluştu');
    }
  };

  const resetPassword = async (email: string): Promise<void> => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
      console.error('Password reset error:', error);
      if (error.code === 'auth/user-not-found') {
        throw new Error('Bu e-posta adresi ile kayıtlı kullanıcı bulunamadı');
      } else {
        throw new Error('Şifre sıfırlama işlemi sırasında bir hata oluştu');
      }
    }
  };

  // Kullanıcının admin olup olmadığını kontrol et
  async function checkUserRole(user: User) {
    try {
      console.log('Checking user role for:', user.uid); // Debug için
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        console.log('User data:', userData); // Debug için
        const isUserAdmin = userData.role === 'admin';
        console.log('Is admin:', isUserAdmin); // Debug için
        setIsAdmin(isUserAdmin);
      } else {
        console.log('User document does not exist'); // Debug için
        setIsAdmin(false);
      }
    } catch (error) {
      console.error('Error checking user role:', error); // Debug için
      setIsAdmin(false);
    }
  }

  const value = {
    currentUser,
    isAdmin,
    isAuthenticated,
    login,
    register,
    logout,
    signInWithGoogle,
    resetPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 