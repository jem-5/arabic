import MyButton from "./Button";

export default function CancelSubscriptionButton({ user }) {
  const handleCancel = async () => {
    const confirm = window.confirm(
      "Are you sure you want to cancel your subscription?"
    );
    if (!confirm) return;

    const res = await fetch("/api/paypal/cancel/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ uid: user.uid }),
    });
    const data = await res.json();
    console.log("data", data);

    if (res.ok) {
      alert("Subscription cancelled successfully.");
      window.location.reload();
    } else {
      alert(data.error || "Failed to cancel subscription.");
    }
  };
  return <MyButton func={handleCancel} text={"Cancel Subscription"} />;
}
