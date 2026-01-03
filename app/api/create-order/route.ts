import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

// Ensure environment variables are loaded
if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  console.error("Razorpay keys are missing in environment variables.");
}

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(request: Request) {
  try {
    const { amount } = await request.json();

    if (!amount) {
      return NextResponse.json({ error: "Amount is required" }, { status: 400 });
    }

    const order = await razorpay.orders.create({
      amount: amount * 100, // Razorpay takes amount in paisa (₹1 = 100 paisa)
      currency: "INR",
      receipt: "receipt_" + Math.random().toString(36).substring(7),
    });

    return NextResponse.json({ orderId: order.id });
  } catch (error: any) {
    console.error("Razorpay Error:", error);
    // Return more specific error message if available
    return NextResponse.json(
      { error: error.message || "Error creating order" }, 
      { status: 500 }
    );
  }
}