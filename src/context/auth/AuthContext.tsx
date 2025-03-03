
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { toast } from 'sonner';
import { AuthContextType, Profile } from './types';
import { 
  signInUser, 
  signUpUser, 
  signOutUser, 
  initializeAuthSession,
  setupAuthStateChangeListener
} from './authOperations';
import { fetchProfile, updateUserProfile } from './profileOperations';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("AuthProvider initializing");
    
    // Initialize auth session
    const initAuth = async () => {
      try {
        console.log("Initializing auth session...");
        const { session, profile } = await initializeAuthSession();
        console.log("Session loaded:", !!session, "Profile loaded:", !!profile);
        setSession(session);
        setUser(session?.user ?? null);
        setProfile(profile);
      } catch (error) {
        console.error("Error initializing auth:", error);
      } finally {
        console.log("Auth initialization complete, setting loading to false");
        setLoading(false);
      }
    };
    
    initAuth();
    
    // Set up auth state change listener
    const subscription = setupAuthStateChangeListener((newSession, newProfile) => {
      console.log("Auth state changed. New session:", !!newSession, "New profile:", !!newProfile);
      setSession(newSession);
      setUser(newSession?.user ?? null);
      setProfile(newProfile);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => {
      console.log("Cleaning up auth subscription");
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { session: newSession, user: newUser } = await signInUser(email, password);
      
      if (newSession) {
        setSession(newSession);
        setUser(newUser);
        if (newUser) {
          const userProfile = await fetchProfile(newUser.id);
          setProfile(userProfile);
        }
      }
    } catch (error: any) {
      console.error('Erreur de connexion:', error);
      toast.error(error.message || 'Erreur de connexion');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, username: string) => {
    try {
      setLoading(true);
      await signUpUser(email, password, username);
    } catch (error: any) {
      console.error('Erreur d\'inscription:', error);
      toast.error(error.message || 'Erreur d\'inscription');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      await signOutUser();
      setSession(null);
      setUser(null);
      setProfile(null);
    } catch (error: any) {
      console.error('Erreur de déconnexion:', error);
      toast.error(error.message || 'Erreur de déconnexion');
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    try {
      setLoading(true);
      if (!user) throw new Error('Utilisateur non connecté');

      const success = await updateUserProfile(user.id, updates);
      if (success) {
        // Update local profile state
        setProfile(prev => prev ? { ...prev, ...updates } : null);
      }
    } catch (error: any) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      toast.error(error.message || 'Erreur lors de la mise à jour du profil');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        profile,
        loading,
        signIn,
        signUp,
        signOut,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth doit être utilisé à l\'intérieur d\'un AuthProvider');
  }
  return context;
};
