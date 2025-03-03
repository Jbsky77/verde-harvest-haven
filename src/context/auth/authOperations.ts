
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { fetchProfile } from './profileOperations';

export async function signInUser(email: string, password: string) {
  console.log("Attempting to sign in user:", email);
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  
  if (error) throw error;
  
  console.log("Sign in successful, session:", !!data.session);
  return data;
}

export async function signUpUser(email: string, password: string, username: string) {
  console.log("Attempting to sign up user:", email);
  const { data, error } = await supabase.auth.signUp({ 
    email, 
    password,
    options: {
      data: {
        username
      }
    }
  });
  
  if (error) throw error;
  
  console.log("Sign up successful:", !!data.user);
  toast.success('Inscription réussie! Veuillez vérifier votre email.');
  return data;
}

export async function signOutUser() {
  console.log("Signing out user");
  const { error } = await supabase.auth.signOut();
  
  if (error) throw error;
  
  console.log("Sign out successful");
  toast.success('Déconnexion réussie');
  return true;
}

export async function initializeAuthSession() {
  const { data: { session } } = await supabase.auth.getSession();
  console.log("Initial session loaded:", !!session);
  
  if (session?.user) {
    const profile = await fetchProfile(session.user.id);
    return { session, profile };
  }
  
  return { session: null, profile: null };
}

export function setupAuthStateChangeListener(callback: (session: any, profile: any) => void) {
  console.log("Setting up auth state change listener");
  
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    async (event, session) => {
      console.log("Auth state changed:", event, "Session:", !!session);
      
      if (session?.user) {
        const profile = await fetchProfile(session.user.id);
        callback(session, profile);
      } else {
        callback(null, null);
      }
    }
  );
  
  return subscription;
}
