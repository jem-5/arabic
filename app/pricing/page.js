"use client";
import Link from "next/link";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useAuthContext } from "@/context/AuthContext"; // Import your auth context
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function Pricing() {
  const router = useRouter();

  const { user, isPaidMember, refetchUser } = useAuthContext();

  // No automatic refetch here — AuthContext fetches profile on sign-in.

  return (
    <PayPalScriptProvider
      options={{
        "client-id": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
        currency: "USD",
      }}
    >
      <Toaster position="top-center" />

      <main className="flex flex-col items-center min-h-screen py-10">
        <h1 className="text-3xl font-bold mb-8 text-neutral">
          Choose Your Plan
        </h1>
        <div className="flex flex-col md:flex-row gap-8">
          {/* Free Plan */}
          <div className="card w-80 bg-base-100 shadow-xl border border-neutral ">
            <div className="card-body flex flex-col justify-between h-full ">
              <div>
                {" "}
                <h2 className="card-title text-primary">Basic Membership</h2>
                <p className="text-4xl font-bold text-primary  max-h-fit">
                  {" "}
                  $0{" "}
                </p>
                <ul className="mt-4 mb-6 space-y-2 text-primary list-none">
                  <li>
                    ✅ Access to beginner modules, games & learning resources
                  </li>
                  <li>✅ No account required to start learning</li>
                </ul>
              </div>
              <div
                className="card-actions  mt-4  
"
              >
                <Link className="w-full self-end" href="/dashboard">
                  <button className="w-full font-medium text-md h-10 flex items-center justify-center gap-2 bg-[white]   text-[#222222] shadow py-3 px-6 text-base">
                    Get Started
                  </button>
                </Link>
              </div>
            </div>
          </div>

          {/* Paid Plan */}
          <div className="card w-80 bg-base-100 shadow-xl border border-secondary ">
            <div className="card-body  flex flex-col justify-between h-full">
              <div>
                <h2 className="card-title text-primary">Premium Membership</h2>
                <p className="text-4xl font-bold text-primary max-h-fit">
                  $19.99
                </p>

                <ul className="mt-4 mb-6 space-y-2 text-primary list-none">
                  <li>✅ Unlock all modules, games & resources</li>

                  <li>✅ Track your learning progress</li>
                  <li>✅ Lifetime access with a single payment</li>
                </ul>
              </div>
              <div className="card-actions  flex-col items-stretch mt-4  ">
                {!user ? (
                  <div className="text-center text-red-600 font-semibold">
                    You are not logged in. Please{" "}
                    <Link href="/profile">
                      <span className="underline">log in</span>
                    </Link>{" "}
                    before purchasing a membership.
                  </div>
                ) : isPaidMember ? (
                  <div className="text-center text-green-600 font-semibold">
                    🎉 You have a premium membership already!
                  </div>
                ) : (
                  <PayPalButtons
                    className="m-0 p-0 flex flex-col justify-end"
                    style={{
                      layout: "horizontal",
                      color: "white",
                      shape: "rect",
                      label: "pay",
                      height: 40,
                    }}
                    createOrder={(data, actions) => {
                      return actions.order.create({
                        purchase_units: [
                          {
                            amount: { value: "19.99", currency_code: "USD" },
                            description: "Arabic Road Lifetime Membership",
                          },
                        ],
                      });
                    }}
                    onApprove={async (data, actions) => {
                      const order = await actions.order.capture();
                      console.log("sending", order.id, user.uid);

                      const res = await fetch("/api/paypal/verify/", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          orderId: order.id,
                          uid: user.uid,
                        }),
                      });
                      const result = await res.json();
                      if (result.success) {
                        toast.success(
                          "Payment successful! Your membership is now active."
                        );
                        router.push("/dashboard");
                      } else {
                        toast.error(
                          "Payment verification failed. Please contact support."
                        );
                      }
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </PayPalScriptProvider>
  );
}
