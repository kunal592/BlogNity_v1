'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Check } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

declare global {
    interface Window {
        Razorpay: any;
    }
}

export default function MembershipPage() {
    const { data: session } = useSession();
    const router = useRouter();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        document.body.appendChild(script);
    }, []);

    const handlePayment = async () => {
        setLoading(true);
        try {
            const orderResponse = await fetch("/api/payment/razorpay", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ amount: 1000 }), // Example amount: 1000 INR
            });

            if (!orderResponse.ok) {
                throw new Error("Failed to create order");
            }

            const order = await orderResponse.json();

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: order.amount,
                currency: order.currency,
                name: "Blogging Platform Membership",
                description: "Access to all exclusive content",
                order_id: order.id,
                handler: async function (response: any) {
                    const verificationResponse = await fetch("/api/payment/razorpay/verify", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(response),
                    });

                    if (verificationResponse.ok) {
                        toast({ title: "Payment successful!" });
                        router.push("/exclusive");
                    } else {
                        toast({ title: "Payment verification failed", variant: "destructive" });
                    }
                },
                prefill: {
                    name: session?.user?.name || "",
                    email: session?.user?.email || "",
                },
                theme: {
                    color: "#3b82f6",
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (error) {
            console.error("Payment failed:", error);
            toast({ title: "Payment failed", description: "An unexpected error occurred.", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)]">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <CardTitle className="text-3xl font-bold">Unlock Exclusive Content</CardTitle>
                    <CardDescription>Become a member to access all our exclusive blog posts.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <ul className="space-y-2">
                        <li className="flex items-center gap-2">
                            <Check className="h-5 w-5 text-green-500" />
                            <span>Read all exclusive posts</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <Check className="h-5 w-5 text-green-500" />
                            <span>Support our work</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <Check className="h-5 w-5 text-green-500" />
                            <span>Join the community</span>
                        </li>
                    </ul>
                </CardContent>
                <CardFooter>
                    <Button className="w-full" onClick={handlePayment} disabled={loading}>
                        {loading ? "Processing..." : "Become a Member"}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
