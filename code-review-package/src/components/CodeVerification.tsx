import React, { useState } from "react";
import { useRouter } from "next/router";

export default function CodeVerification() {
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<null | "invalid" | "used" | "ok">(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function verify() {
    setLoading(true);
    setStatus(null);
    try {
      const email = sessionStorage.getItem("onboard_email") || "";
      const creatorId = (email || "creator_" + Date.now()).split("@")[0];
      const res = await fetch("/api/mock/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, creatorId, email })
      });
      const json = await res.json();
      if (json.ok) {
        setStatus("ok");
        router.push("/profile/setup");
      } else {
        setStatus(json.reason === "used" ? "used" : "invalid");
      }
    } catch (err) {
      setStatus("invalid");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Enter your verification code</h2>
      <input
        className="w-full border p-2 rounded mb-2"
        placeholder="F50A12"
        value={code}
        onChange={(e) => setCode(e.target.value.trim())}
      />
      {status === "invalid" && <div className="text-red-600 mb-2">Invalid code. Try again.</div>}
      {status === "used" && <div className="text-yellow-700 mb-2">Code already activated.</div>}
      <button className="btn-primary" onClick={verify} disabled={loading}>
        {loading ? "Verifying…" : "Verify"}
      </button>
    </div>
  );
}
