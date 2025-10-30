'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function EditProfilePage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [image, setImage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (status === 'authenticated') {
      setName(session.user.name || '');
      setUsername(session.user.username || '');
      setBio(session.user.bio || '');
      setImage(session.user.image || '');
    } else if (status === 'unauthenticated') {
      router.push('/signin');
    }
  }, [session, status, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Here you would typically call an API to update the user profile.
    // For this example, we'll simulate an API call and use the session's update function.
    try {
        // const res = await fetch('/api/profile', { 
        //     method: 'PUT', 
        //     body: JSON.stringify({ name, username, bio, image })
        // });
        // const updatedUser = await res.json();

        // For demonstration, we directly update the session
        await update({
            ...session,
            user: {
                ...session?.user,
                name,
                username,
                bio,
                image,
            }
        })
        toast({ title: 'Profile updated successfully!' });
        router.push('/profile');
    } catch (error) {
        toast({ title: 'Failed to update profile', variant: 'destructive' });
    } finally {
        setIsSubmitting(false);
    }
  };

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Edit Profile</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
                <div className="flex flex-col items-center space-y-4">
                    <Avatar className="w-32 h-32 border-4 border-background shadow-md">
                        {image && <AvatarImage src={image} alt={name} />}
                        <AvatarFallback className="text-4xl">{name ? name.charAt(0) : 'U'}</AvatarFallback>
                    </Avatar>
                    <Input type="file" onChange={e => { 
                        const file = e.target.files?.[0];
                        if(file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                                setImage(reader.result as string);
                            };
                            reader.readAsDataURL(file);
                        }
                     }} className="max-w-xs"/>
                </div>
                <div className="space-y-2">
                    <label htmlFor="name">Name</label>
                    <Input id="name" value={name} onChange={e => setName(e.target.value)} />
                </div>
                <div className="space-y-2">
                    <label htmlFor="username">Username</label>
                    <Input id="username" value={username} onChange={e => setUsername(e.target.value)} />
                </div>
                <div className="space-y-2">
                    <label htmlFor="bio">Bio</label>
                    <Textarea id="bio" value={bio} onChange={e => setBio(e.target.value)} />
                </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
                <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Save'}</Button>
            </CardFooter>
        </form>
      </Card>
    </div>
  );
}
