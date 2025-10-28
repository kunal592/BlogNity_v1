'use client';

import type { Post, User } from '@/lib/types';
import { useAuth } from '@/context/AuthContext';
import BlogList from '@/app/(main)/home/BlogList';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Gem, Lock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ExclusivePageClientProps {
    initialPosts: (Post & { author?: User })[];
}

export default function ExclusivePageClient({ initialPosts }: ExclusivePageClientProps) {
  const { user } = useAuth();
  const { toast } = useToast();

  const handleUnlock = () => {
    toast({
        title: "Feature Coming Soon!",
        description: "The payment processing feature is not yet implemented."
    })
  }
  
  if (!user || !user.hasPaidAccess) {
    return (
        <div className="container mx-auto">
             <h1 className="text-3xl font-bold mb-6">Exclusive Content</h1>
            <Card className="mt-8 text-center">
                <CardHeader>
                    <div className="mx-auto bg-primary/10 text-primary p-3 rounded-full w-fit">
                        <Gem className="h-8 w-8" />
                    </div>
                    <CardTitle className="mt-4 text-2xl">Unlock Exclusive Content</CardTitle>
                </CardHeader>
                <CardContent className="p-8 pt-0 flex flex-col items-center justify-center">
                    <p className="text-muted-foreground max-w-md mx-auto mb-6">
                    Get unlimited access to our premium articles, deep-dives, and tutorials from top authors.
                    </p>
                    <Button size="lg" onClick={handleUnlock}>
                        <Lock className="mr-2 h-4 w-4" />
                        Unlock Now for $9.99/mo
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
  }

  return (
    <div className="container mx-auto">
        <BlogList posts={initialPosts} listTitle="Exclusive Content" />
    </div>
  );
}
