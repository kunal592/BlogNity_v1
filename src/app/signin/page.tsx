'use client'

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const { toast } = useToast();
  const router = useRouter();

  const handleSignIn = async () => {
    const result = await signIn("google", { redirect: false, callbackUrl: "/" });

    if (result?.ok && !result.error) {
      toast({
        title: "Login Successful",
        description: "You have been successfully logged in.",
      });
      router.push("/");
    } else {
      toast({
        title: "Login Failed",
        description: result?.error || "An unknown error occurred.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-3xl font-bold mb-4">Sign In</h1>
      <Button onClick={handleSignIn}>Sign in with Google</Button>
    </div>
  );
}
