import { NextResponse } from "next/server";
import { adminDb } from "@/firebase/firebaseAdmin";
import { getAuth } from "firebase-admin/auth";

// This will check if a payment was successful before changing user status on the server / database
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

    if (
      orderData.status === "COMPLETED" &&
      orderData.purchase_units[0].description ===
        "Arabic Road Complete Practice Pack"
    ) {
      try {
        console.log("Setting boughtPracticePack claim for user:", uid);
        const auth = getAuth();
        // Check existing claims to avoid unnecessary writes
        const userRecord = await auth.getUser(uid);
        const existingClaims = userRecord.customClaims || {};
        if (!existingClaims.boughtPracticePack) {
          await auth.setCustomUserClaims(uid, {
            ...existingClaims,
            boughtPracticePack: true,
          });
          console.log(`Set boughtPracticePack custom claim for ${uid}`);
        } else {
          console.log(`User ${uid} already has boughtPracticePack claim`);
        }
      } catch (claimErr) {
        // Log errors but don't fail the whole verification; Firestore was updated
        console.error("Failed to set custom user claim:", claimErr);
      }
      // Respond with success
      return NextResponse.json({ success: true });
    } else if (orderData.status === "COMPLETED") {
      try {
        console.log("Setting isPaidMember claim for user:", uid);
        const auth = getAuth();
        // Check existing claims to avoid unnecessary writes
        const userRecord = await auth.getUser(uid);
        const existingClaims = userRecord.customClaims || {};
        if (!existingClaims.isPaidMember) {
          await auth.setCustomUserClaims(uid, {
            ...existingClaims,
            isPaidMember: true,
          });
          console.log(`Set isPaidMember custom claim for ${uid}`);
        } else {
          console.log(`User ${uid} already has isPaidMember claim`);
        }
      } catch (claimErr) {
        // Log errors but don't fail the whole verification; Firestore was updated
        console.error("Failed to set custom user claim:", claimErr);
      }
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
