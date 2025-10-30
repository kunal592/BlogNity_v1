
import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import Razorpay from 'razorpay';
import { db } from '@/lib/db';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const { amount, currency = 'INR' } = await req.json();

  const options = {
    amount: amount * 100, // Amount in paise
    currency,
    receipt: `receipt_order_${new Date().getTime()}`,
  };

  try {
    const order = await razorpay.orders.create(options);
    return NextResponse.json(order);
  } catch (error) {
    console.error('[RAZORPAY_ORDER_CREATE]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}
