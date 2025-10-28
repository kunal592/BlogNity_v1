'use client'

import { signIn, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SignInPage() {
  const router = useRouter();
  const { status } = useSession();

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/home');
    }
  }, [status, router]);

  const handleSignIn = async () => {
    await signIn("google");
  };

  if (status === 'loading' || status === 'authenticated') {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <p>Loading...</p>
        </div>
      );
  }

  return (
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <h1 className="text-3xl font-bold mb-4">Sign In</h1>
        <Button onClick={handleSignIn}>Sign in with Google</Button>
      </div>
    );
}
