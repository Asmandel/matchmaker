"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [authed, setAuthed] = useState(false);
  const [input, setInput] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("authed");
    if (stored === "true") setAuthed(true);
  }, []);

  const handleLogin = () => {
    if (input === process.env.NEXT_PUBLIC_APP_PASSWORD) {
      localStorage.setItem("authed", "true");
      setAuthed(true);
    } else {
      alert("Incorrect password");
    }
  };

  if (!authed) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-8 gap-4">
        <h1 className="text-xl font-bold">Enter Password</h1>
        <input
          type="password"
          className="border p-2 rounded w-full max-w-sm"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          className="bg-black text-white px-4 py-2 rounded hover:opacity-80"
          onClick={handleLogin}
        >
          Submit
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <h1 className="text-2xl">🔥 You’re in! Site is protected.</h1>
    </div>
  );
}
