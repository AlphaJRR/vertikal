import React, { useState } from "react";
import { useRouter } from "next/router";

export default function EmailEntry() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  function validateEmail(e: string) {
    return /\S+@\S+\.\S+/.test(e);
  }

  function onNext() {
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    // Save to sessionStorage for mock flow
    sessionStorage.setItem("onboard_email", email);
    router.push("/verify");
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Enter your email</h2>
      <input
        className="w-full border p-2 rounded mb-2"
        placeholder="you@domain.com"
        value={email}
        onChange={(e) => { setEmail(e.target.value); setError(null); }}
      />
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <button className="btn-primary" onClick={onNext}>Continue</button>
    </div>
  );
}
