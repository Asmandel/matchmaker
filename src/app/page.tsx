"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";

type Creator = {
  id: string;
  name: string;
  niche: string | null;
};

export default function Home() {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: "",
    niche: "",
    reach: "",
    topics: "",
    youtube_channel_id: "",
  });

  useEffect(() => {
    const fetchCreators = async () => {
      const { data, error } = await supabase.from("creators").select("*");

      if (!error && data !== null) {
        setCreators(data as Creator[]);
      }

      setLoading(false);
    };

    fetchCreators();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { name, niche, reach, topics, youtube_channel_id } = form;
    const topicArray = topics.split(",").map((t) => t.trim());

    const { data, error } = await supabase.from("creators").insert([
      {
        name,
        niche,
        reach: Number(reach),
        topics: topicArray,
        youtube_channel_id,
      },
    ]);

    if (error) {
      alert("Failed to add creator: " + error.message);
    } else {
      setForm({ name: "", niche: "", reach: "", topics: "", youtube_channel_id: "" });

      if (data !== null) {
        setCreators([...creators, ...data]);
      }
    }
  };

  return (
    <div className="p-8 space-y-10">
      <h1 className="text-2xl font-bold">🎥 Creators</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="name" placeholder="Name" value={form.name} onChange={handleChange} required className="block w-full border rounded p-2" />
        <input type="text" name="niche" placeholder="Niche" value={form.niche} onChange={handleChange} required className="block w-full border rounded p-2" />
        <input type="number" name="reach" placeholder="Reach" value={form.reach} onChange={handleChange} required className="block w-full border rounded p-2" />
        <input type="text" name="topics" placeholder="Topics (comma-separated)" value={form.topics} onChange={handleChange} required className="block w-full border rounded p-2" />
        <input type="text" name="youtube_channel_id" placeholder="YouTube Channel ID" value={form.youtube_channel_id} onChange={handleChange} required className="block w-full border rounded p-2" />
        <button type="submit" className="bg-black text-white px-4 py-2 rounded">Submit Creator</button>
      </form>

      <hr />

      {loading ? (
        <p>Loading creators...</p>
      ) : creators.length === 0 ? (
        <p>No creators found.</p>
      ) : (
        <ul className="list-disc pl-6">
          {creators.map((c) => (
            <li key={c.id}>{c.name} — {c.niche}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

