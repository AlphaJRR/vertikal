import React, { useState } from "react";
import { useRouter } from "next/router";

export default function ProfileCompletion() {
  const [name, setName] = useState("");
  const [handle, setHandle] = useState("");
  const [bio, setBio] = useState("");
  const [tags, setTags] = useState("");
  const router = useRouter();

  async function onSave() {
    const email = sessionStorage.getItem("onboard_email") || "";
    const creatorId = handle || (email ? email.split("@")[0] : "creator_" + Date.now());
    const payload = { id: creatorId, name, handle: creatorId, bio, tags: tags.split(",").map(t => t.trim()) };
    await fetch("/api/mock/saveProfile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    router.push("/");
  }

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Complete your profile</h2>
      <input className="w-full border p-2 rounded mb-2" placeholder="Full name" value={name} onChange={e => setName(e.target.value)} />
      <input className="w-full border p-2 rounded mb-2" placeholder="Public handle (optional)" value={handle} onChange={e => setHandle(e.target.value)} />
      <textarea className="w-full border p-2 rounded mb-2" placeholder="Short bio" value={bio} onChange={e => setBio(e.target.value)} />
      <input className="w-full border p-2 rounded mb-2" placeholder="Tags (comma separated)" value={tags} onChange={e => setTags(e.target.value)} />
      <button className="btn-primary" onClick={onSave}>Save profile</button>
    </div>
  );
}
