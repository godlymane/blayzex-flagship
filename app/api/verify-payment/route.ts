import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { db } from '@/lib/firebase'; // Ensure your firebase.ts exports 'db'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

// NOTE: For Production, you should use 'firebase-admin' with a Service Account 
// to write to Firestore from an API route with full privileges.
// Since we are in a rapid-dev environment without easy access to Service Account JSON,
// we are using the Client SDK here. In a serverless environment, this works but is less ideal 
// than Admin SDK. 

export async function POST(request: Request) {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature, 
      customer, 
      items, 
      total 
    } = await request.json();

    const secret = process.env.RAZORPAY_KEY_SECRET;

    if (!secret) {
        return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
    }

    // 1. VERIFY SIGNATURE
    const generated_signature = crypto
      .createHmac('sha256', secret)
      .update(razorpay_order_id + '|' + razorpay_payment_id)
      .digest('hex');

    if (generated_signature !== razorpay_signature) {
      return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 });
    }

    // 2. WRITE TO DB (Server-Side)
    // This prevents users from injecting fake orders via the browser console.
    const orderRef = await addDoc(collection(db, "orders"), {
        customer,
        items,
        total,
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
        createdAt: serverTimestamp(),
        status: "PAID"
    });

    return NextResponse.json({ success: true, id: orderRef.id });

  } catch (error: any) {
    console.error("Payment Verification Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}