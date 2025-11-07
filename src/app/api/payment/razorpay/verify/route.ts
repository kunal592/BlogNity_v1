
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import crypto from 'crypto';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
    .update(body.toString())
    .digest('hex');

  const isAuthentic = expectedSignature === razorpay_signature;

  if (isAuthentic) {
    await db.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        hasPaidAccess: true,
      },
    });

    return NextResponse.json({ message: 'Payment verified and access granted' });
  } else {
    return new NextResponse('Invalid signature', { status: 400 });
  }
}
