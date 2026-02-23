import { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, createUserWithEmailAndPassword, 
  signOut, onAuthStateChanged, signInWithPopup, GoogleAuthProvider 
} from 'firebase/auth';
import { auth } from '../firebase';

const AuthContext = createContext(null);

const isDemoMode = !import.meta.env.VITE_FIREBASE_PROJECT_ID || 
  import.meta.env.VITE_FIREBASE_PROJECT_ID === 'your-project-id';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isDemoMode) {
      const demoUser = localStorage.getItem('flow_demo_user');
      setUser(demoUser ? JSON.parse(demoUser) : null);
      setLoading(false);
      return;
    }
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsub;
  }, []);

  const login = (email, password) => signInWithEmailAndPassword(auth, email, password);
  const signup = (email, password) => createUserWithEmailAndPassword(auth, email, password);
  const logout = () => signOut(auth);
  const loginWithGoogle = () => signInWithPopup(auth, new GoogleAuthProvider());

  const demoLogin = (email, password) => {
    const demoUser = { uid: 'demo_' + Date.now(), email, displayName: email.split('@')[0] };
    localStorage.setItem('flow_demo_user', JSON.stringify(demoUser));
    setUser(demoUser);
  };

  const demoSignup = (email, password) => demoLogin(email, password);

  const demoLogout = () => {
    localStorage.removeItem('flow_demo_user');
    setUser(null);
  };

  const value = {
    user,
    loading,
    login: isDemoMode ? demoLogin : login,
    signup: isDemoMode ? demoSignup : signup,
    logout: isDemoMode ? demoLogout : logout,
    loginWithGoogle: isDemoMode ? null : loginWithGoogle,
    isDemoMode,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
