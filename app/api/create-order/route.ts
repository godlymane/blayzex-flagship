import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

export async function POST(request: Request) {
  try {
    // 1. Check for keys inside the handler (prevents build-time crashes)
    if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      console.error("Razorpay keys are missing in environment variables.");
      return NextResponse.json({ error: "Server configuration error: Missing Payment Keys" }, { status: 500 });
    }

    // 2. Initialize Razorpay only when needed
    const razorpay = new Razorpay({
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const { amount } = await request.json();

    if (!amount) {
      return NextResponse.json({ error: "Amount is required" }, { status: 400 });
    }

    const order = await razorpay.orders.create({
      amount: amount * 100, 
      currency: "INR",
      receipt: "receipt_" + Math.random().toString(36).substring(7),
    });

    return NextResponse.json({ orderId: order.id });
  } catch (error: any) {
    console.error("Razorpay Error:", error);
    return NextResponse.json(
      { error: error.message || "Error creating order" }, 
      { status: 500 }
    );
  }
}