
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Profile } from './types';

export async function fetchProfile(userId: string): Promise<Profile | null> {
  try {
    console.log("Fetching profile for user:", userId);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      throw error;
    }

    console.log("Profile fetched:", data);
    return data as Profile;
  } catch (error) {
    console.error('Erreur lors de la récupération du profil:', error);
    toast.error('Impossible de récupérer votre profil');
    return null;
  }
}

export async function updateUserProfile(userId: string, updates: Partial<Profile>): Promise<boolean> {
  try {
    console.log("Updating profile for user:", userId, updates);
    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId);

    if (error) throw error;
    
    console.log("Profile updated successfully");
    toast.success('Profil mis à jour avec succès');
    return true;
  } catch (error: any) {
    console.error('Erreur lors de la mise à jour du profil:', error);
    toast.error(error.message || 'Erreur lors de la mise à jour du profil');
    return false;
  }
}
