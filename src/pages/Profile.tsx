
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/auth/AuthContext';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Loader2, User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

const profileSchema = z.object({
  username: z.string().min(3, { message: 'Le nom d\'utilisateur doit comporter au moins 3 caractères' }),
  full_name: z.string().optional(),
  avatar_url: z.string().url({ message: 'URL invalide' }).optional().or(z.literal('')),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function Profile() {
  const { profile, updateProfile, signOut, loading } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);

  if (!profile) {
    navigate('/auth');
    return null;
  }

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: profile.username || '',
      full_name: profile.full_name || '',
      avatar_url: profile.avatar_url || '',
    },
  });

  const onSubmit = async (values: ProfileFormValues) => {
    try {
      await updateProfile({
        username: values.username,
        full_name: values.full_name || null,
        avatar_url: values.avatar_url || null,
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const getInitials = () => {
    if (profile.full_name) {
      return profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase();
    }
    return profile.username.substring(0, 2).toUpperCase();
  };

  return (
    <div className="container max-w-4xl py-10">
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={profile.avatar_url || undefined} alt={profile.username} />
              <AvatarFallback className="text-xl">{getInitials()}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">Profil Utilisateur</CardTitle>
              <CardDescription>
                Gérez vos informations personnelles et votre compte
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom d'utilisateur</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="full_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom complet</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="avatar_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL de l'avatar</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex space-x-2">
                  <Button type="submit" disabled={loading}>
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Sauvegarder
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                    Annuler
                  </Button>
                </div>
              </form>
            </Form>
          ) : (
            <div className="space-y-6">
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">Nom d'utilisateur</p>
                <p className="text-sm text-muted-foreground">{profile.username}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">Nom complet</p>
                <p className="text-sm text-muted-foreground">{profile.full_name || "-"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">Email</p>
                <p className="text-sm text-muted-foreground">{profile.id}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">URL de l'avatar</p>
                <p className="text-sm text-muted-foreground">{profile.avatar_url || "-"}</p>
              </div>
              <Button onClick={() => setIsEditing(true)}>
                Modifier le profil
              </Button>
            </div>
          )}
          
          <Separator className="my-6" />
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium">Actions du compte</h3>
              <p className="text-sm text-muted-foreground">
                Options supplémentaires pour gérer votre compte
              </p>
            </div>
            <Button variant="destructive" onClick={handleSignOut}>
              Se déconnecter
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
