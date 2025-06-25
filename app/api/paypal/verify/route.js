import { NextResponse } from "next/server";
// import { doc, updateDoc } from "firebase/firestore";
import { adminDb } from "@/firebase/firebaseAdmin";

export async function POST(req) {
  try {
    const { orderId, uid } = await req.json();
    if (!orderId || !uid) {
      console.log("Missing orderId or uid");

      return NextResponse.json(
        { success: false, error: "Missing orderId or uid" },
        { status: 400 }
      );
    }
    // 1. Verify the order with PayPal
    const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
    const PAYPAL_SECRET = process.env.NEXT_PUBLIC_PAYPAL_SECRET;
    const basicAuth = Buffer.from(
      `${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`
    ).toString("base64");

    // Get PayPal access token
    const tokenRes = await fetch("https://api-m.paypal.com/v1/oauth2/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${basicAuth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    });
    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;

    // Get order details
    const orderRes = await fetch(
      `https://api-m.paypal.com/v2/checkout/orders/${orderId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    const orderData = await orderRes.json();
    console.log("PayPal orderData:", orderData);

    if (orderData.status === "COMPLETED") {
      // 2. Update your database to mark the user as paid
      // Example with Firestore:
      // await updateDoc(doc(db, "users", uid), { isPaidMember: true });
      await adminDb.collection("users").doc(uid).update({ isPaidMember: true });
      // Respond with success
      return NextResponse.json({ success: true });
    } else {
      console.log("Order not completed:", orderData.status);

      return NextResponse.json(
        { success: false, error: "Order not completed" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("API error:", error);

    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
