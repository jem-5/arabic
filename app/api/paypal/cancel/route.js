import { NextResponse } from "next/server";
import { getAuth } from "firebase-admin/auth";

// This will handle PayPal subscription cancellations
export async function POST(req) {
  try {
    const { uid } = await req.json();
    console.log("uid", uid);
    if (!uid) {
      return NextResponse.json({ error: "Missing uid" }, { status: 400 });
    }

    const auth = getAuth();
    const user = await auth.getUser(uid);
    console.log("user", user);

    const subscriptionId = user.customClaims?.paypalSubscriptionId;
    if (!subscriptionId) {
      return NextResponse.json(
        { error: "No subscription found for user" },
        { status: 400 }
      );
    }

    const basicAuth = Buffer.from(
      `${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}:${process.env.NEXT_PUBLIC_PAYPAL_SECRET}`
    ).toString("base64");

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

    const cancelRes = await fetch(
      `https://api-m.paypal.com/v1/billing/subscriptions/${subscriptionId}/cancel`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reason: "User requested cancellation",
        }),
      }
    );

    if (!cancelRes.ok) {
      const err = await cancelRes.text();
      console.log("Failed to cancel subscription:", err);
      return NextResponse.json(
        { error: "Failed to cancel subscription" },
        { status: 500 }
      );
    }

    await auth.setCustomUserClaims(uid, {
      ...user.customClaims,
      isPaidMember: false,
      membershipType: null,
      paypalSubscriptionId: null,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.log("Error cancelling subscription:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
