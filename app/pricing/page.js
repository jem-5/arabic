"use client";
import Link from "next/link";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useAuthContext, auth } from "@/context/AuthContext"; // Import your auth context and auth helper
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import React from "react";

export default function Pricing() {
  const router = useRouter();
  const { user, isPaidMember, refetchUser } = useAuthContext();
  const [annualBilling, setAnnualBilling] = React.useState(true);

  const getToken = async () => {
    if (!user) return;
    const tokenResult = await user.getIdTokenResult();
    console.log("token result", tokenResult);
  };
  getToken();
  return (
    <main className="flex flex-col items-center min-h-screen text-base-100">
      <PayPalScriptProvider
        options={{
          "client-id": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
          currency: "USD",
          disableFunding: "paylater",
          intent: "capture",
          vault: "true",
        }}
      >
        <Toaster position="top-center" />

        <h1 className="text-3xl font-bold  text-[white] p-2 text-center">
          Master Arabic sounds the smart way!
        </h1>
        <p className="text-center text-base mb-10 max-w-xl px-4 text-md">
          Choose your plan
        </p>
        <div className="flex flex-col lg:flex-row gap-5 mx-2 items-start justify-start  ">
          {/* Free Plan */}
          <div className="w-5/6 lg:w-80">
            <h3 className="opacity-0 text-md"> .</h3>

            <div className="card   bg-[white] shadow-3xl   ">
              <div className="card-body flex flex-col justify-between h-full ">
                <div>
                  <h2 className="card-title  ">Free Tier</h2>
                  <p className="text-xl font-bold  max-h-fit"> $0 </p>
                  <ul className="mt-4 mb-6 space-y-2  list-none">
                    <li>✅ Access to beginner lessons</li>
                    <li>✅ 10 Pronunciation scores per day</li>
                    <li>✅ No account required </li>
                  </ul>
                </div>
                <div className="card-actions mt-4">
                  <Link className="w-full self-end" href="/dashboard">
                    <button className="w-full font-medium text-sm h-10 flex items-center justify-center gap-2 bg-[white]   text-[#222222]  py-3 px-6 rounded  border-[black] border-2">
                      Get Started
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          {/* Paid Plan */}
          <div className="flex flex-col   items-center w-5/6  md:w-100 ">
            <div className=" text-md font-bold  badge    badge-ghost mb-1  ">
              MOST POPULAR
            </div>

            <div className="card     bg-[white]  border-accent border-4  shadow-[0_20px_50px_rgba(0,0,0,0.8)]   ">
              <div className="card-body  flex flex-col justify-between h-full">
                <div>
                  <h2 className="card-title text-base-100 flex flex-row">
                    Premium Tier
                  </h2>

                  <p className="text-xl font-bold  max-h-fit">
                    {annualBilling ? "$7.99 / month" : "$9.99 / month"}
                  </p>
                  <p className="text-sm italic">
                    {annualBilling ? "Billed annually at $95" : ""}{" "}
                  </p>
                  <fieldset className="fieldset w-fit border-base-300 rounded-box  border p-1">
                    <legend className="fieldset-legend   ">
                      Billing frequency
                    </legend>
                    <label className="label">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="toggle mr-2"
                        onClick={() => setAnnualBilling((prev) => !prev)}
                      />
                      {annualBilling
                        ? "Annual (save 20%)"
                        : "Monthly (cancel anytime)"}
                    </label>
                  </fieldset>

                  <ul className="mt-4 mb-6 space-y-2 list-none">
                    <li>
                      ✅{" "}
                      <span className="font-bold">
                        Unlock the full library of Arabic Road lessons & games
                      </span>
                    </li>
                    <li>✅ Egyptian Arabic vocabulary & pronunciation</li>
                    <li>
                      ✅ Unlimited pronunciation scores w/ phoneme-level
                      analysis & articulation tips
                    </li>
                    <li>✅ Side-by-side native comparison</li>
                    <li>✅ Access downloadable practice packs</li>
                    <li>✅ Track your learning progress</li>
                    <li>✅ All future updates included</li>
                  </ul>
                </div>
                <div>👉 Most learners choose this</div>
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
                    <div className="text-center  font-semibold">
                      🎉 You have a membership already!
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
                        tagline: false,
                        size: "small",
                      }}
                      createSubscription={(data, actions) => {
                        return actions.subscription.create({
                          plan_id: `${
                            annualBilling
                              ? "P-54X608930C9583307NFCWHVQ"
                              : "P-8M810172RV743113WNFCWIII"
                          }`,
                        });
                      }}
                      onApprove={async (data, actions) => {
                        console.log(
                          "Subscription approved:",
                          data.subscriptionID,
                          order
                        );

                        const res = await fetch("/api/paypal/verify/", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            orderId: data.subscriptionID,
                            uid: user.uid,
                          }),
                        });
                        const result = await res.json();
                        if (result.success) {
                          toast.success(
                            "Payment successful! Your membership is now active.",
                            { duration: 6000 }
                          );
                          try {
                            // Force refresh of the ID token so new custom claims are available
                            if (auth && auth.currentUser) {
                              await auth.currentUser.getIdToken(true);
                            }
                            // Refetch Firestore-backed user doc to pick up isPaidMember flag
                            if (user?.uid) {
                              await refetchUser(user.uid);
                            }
                          } catch (err) {
                            console.error(
                              "Error refreshing token or refetching user:",
                              err
                            );
                          }
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
              <p className="text-sm italic text-center mt-1">
                Cancel anytime • No hidden fees
              </p>
              <p className="text-sm italic text-center ">
                {annualBilling
                  ? "                $95 billed once per year"
                  : "$9.99 billed once per month"}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center w-5/6 lg:w-80">
            <h3 className=" text-md font-bold  badge    badge-ghost mb-1  ">
              ONE-TIME PAYMENT
            </h3>

            <div className="card    bg-[white] self-stretch ">
              <div className="card-body  flex flex-col justify-between h-full">
                <div>
                  <h2 className="card-title  flex flex-row">Lifetime Tier</h2>

                  <p className="text-xl font-bold  max-h-fit">$139</p>

                  <ul className="mt-4 mb-6 space-y-2  list-none">
                    <li>✅ Everything in Premium</li>
                    <li>✅ Lifetime access - forever</li>
                    <li>✅ Perfect for serious learners</li>

                    <li>✅ Priority feature access</li>
                    <li>✅ No subscriptions. No renewals.</li>
                  </ul>
                </div>
                <div>👉 Best long-term value</div>

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
                    <div className="text-center  font-semibold">
                      🎉 You have a membership already!
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
                        tagline: false,
                        size: "small",
                      }}
                      createOrder={(data, actions) => {
                        return actions.order.create({
                          purchase_units: [
                            {
                              amount: { value: "139", currency_code: "USD" },
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
                          try {
                            // Force refresh of the ID token so new custom claims are available
                            if (auth && auth.currentUser) {
                              await auth.currentUser.getIdToken(true);
                            }
                            // Refetch Firestore-backed user doc to pick up isPaidMember flag
                            if (user?.uid) {
                              await refetchUser(user.uid);
                            }
                          } catch (err) {
                            console.error(
                              "Error refreshing token or refetching user:",
                              err
                            );
                          }
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

              <p className="text-sm italic text-center mt-1">
                Cancel anytime • No hidden fees
              </p>
              <p className="text-sm italic text-center ">$139 billed once</p>
            </div>
          </div>
        </div>

        <hr className="mt-10 h-1 w-full bg-[white] opacity-45" />

        <div className="m-4">
          <div className="card   bg-[white] shadow-3xl w-3xl max-w-6xl mx-auto ">
            <div className="card-body flex flex-col justify-between h-full ">
              <h2 className="card-title  ">
                Arabic Road Complete Practice Pack
              </h2>
              <h3 className="italic ">
                A printable, offline reference for learners who prefer studying
                on paper or without an account.
              </h3>

              <p className="text-xl font-bold  max-h-fit"> $29 </p>
              <ul className="mt-4 mb-6 space-y-2  list-none">
                <li>✅ All vocabulary from every module</li>
                <li>✅ Arabic + Transliteration + English</li>
                <li>✅ Printable & offline</li>
                <li>✅ Lifetime access</li>

                <div className="card-actions  flex-col items-stretch mt-4  ">
                  {!user ? (
                    <div className="text-center text-red-600 font-semibold">
                      You are not logged in. Please{" "}
                      <Link href="/profile">
                        <span className="underline">log in</span>
                      </Link>{" "}
                      before purchasing a practice pack.
                    </div>
                  ) : isPaidMember ? (
                    <div className="text-center  font-semibold">
                      🎉 You have a membership already. Practice packs are
                      included in your membership. Visit your{" "}
                      <Link href="/profile">
                        <span className="underline">Account Page</span>
                      </Link>{" "}
                      to download the Complete Practice Pack.
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
                        tagline: false,
                        size: "small",
                      }}
                      createOrder={(data, actions) => {
                        return actions.order.create({
                          purchase_units: [
                            {
                              amount: { value: "29", currency_code: "USD" },
                              description: "Arabic Road Complete Practice Pack",
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
                            "Payment successful! Your product is available on your Profile page."
                          );
                          try {
                            // Force refresh of the ID token so new custom claims are available
                            if (auth && auth.currentUser) {
                              await auth.currentUser.getIdToken(true);
                            }
                            // Refetch Firestore-backed user doc to pick up isPaidMember flag
                            if (user?.uid) {
                              await refetchUser(user.uid);
                            }
                          } catch (err) {
                            console.error(
                              "Error refreshing token or refetching user:",
                              err
                            );
                          }
                        } else {
                          toast.error(
                            "Payment verification failed. Please contact support."
                          );
                        }
                      }}
                    />
                  )}
                </div>
              </ul>
              <p className="text-sm italic text-center mt-1">
                Interactive lessons, audio, and tracking available via
                subscription.
              </p>
              <p className="text-sm italic text-center ">$29 billed once</p>
            </div>
          </div>
        </div>

        {/* Extra Bonus Benefits  */}
        <div className="max-w-6xl mx-auto card  bg-base-100 opacity-80 mt-10 p-5 w-3/4">
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-3 text-sm text-neutral-200 items-center place-items-center">
            <li className="flex items-start gap-2">
              <span className="text-green-400">✔</span>
              <span>No ads. Ever.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400">✔</span>
              <span>No hidden fees or surprise charges</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400">✔</span>
              <span>Learn at your own pace</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400">✔</span>
              <span>Built by language learners, for language learners</span>
            </li>
          </ul>
        </div>

        {/* Testimonials  */}

        <div className="mt-10 max-w-6xl mx-auto w-3/4">
          <h3 className="text-center text-lg text-[white] font-semibold mb-6">
            Loved by learners just like you
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 ">
            <div className="bg-base-100 opacity-80 text-[white] border border-white/10 rounded-lg p-4">
              <p className="text-md mb-3">
                “Layout and presentation are well done. The UI is very easy to
                navigate.”
              </p>
              <p className="text-xs opacity-70">— Nesma P., heritage learner</p>
            </div>

            <div className="bg-base-100 opacity-80 text-[white]  border border-white/10 rounded-lg p-4">
              <p className="text-md mb-3">
                “Love the pronunciation scoring feature! It is something I’ve
                never seen in other apps.”
              </p>
              <p className="text-xs opacity-70">— Craig M., busy parent</p>
            </div>

            <div className="bg-base-100 opacity-80 text-[white]  border border-white/10 rounded-lg p-4">
              <p className="text-md mb-3">
                “As someone still learning to read Arabic, having the audio,
                Arabic writing, English translation & transliteration is greatly
                appreciated.”
              </p>
              <p className="text-xs opacity-70">
                — Amelia G., beginner learner
              </p>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-10 max-w-6xl mx-auto">
          <h3 className="text-center text-lg font-semibold mb-5 text-[white] ">
            Frequently asked questions
          </h3>

          <div className="space-y-4 rounded-lg mb-5">
            {[
              {
                q: "Can I cancel anytime?",
                a: "Yes. You can cancel your subscription at any time from your PayPal account. You’ll keep access until the end of your current billing period, and you won’t be charged again.",
              },
              {
                q: "What happens if I choose the lifetime plan?",
                a: "The lifetime plan is a one-time payment. You get permanent access to all current premium content, plus future updates — no renewals, no subscriptions.",
              },
              {
                q: "Are there any hidden fees or ads?",
                a: "No. There are no ads, no hidden fees, and no surprise charges. What you see on the pricing page is exactly what you pay.",
              },
              {
                q: "Do I need an account to use Arabic Road?",
                a: "You don’t need an account to try Arabic Road. Creating a free account lets you save progress, track pronunciation scores, and unlock premium features.",
              },
              {
                q: "Is this Modern Standard Arabic or Egyptian Arabic?",
                a: "Arabic Road focuses on Egyptian Arabic, with clear pronunciation, native audio, and practical vocabulary you’ll actually hear in real conversations.",
              },
            ].map((item, idx) => (
              <details
                key={idx}
                className="border border-white/10 rounded-lg bg-base-100 opacity-80 text-[white] p-4"
              >
                <summary className="cursor-pointer text-md  ">{item.q}</summary>
                <p className="mt-2 text-sm opacity-80">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </PayPalScriptProvider>
    </main>
  );
}
