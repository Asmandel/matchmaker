"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";

const YT_API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;

export default function Home() {
  const [channelInput, setChannelInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const fetchChannelInfo = async () => {
    setLoading(true);
    setStatus("");

    try {
      const channelId = await resolveChannelId(channelInput);
      if (!channelId) throw new Error("Channel not found");

      const channelData = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelId}&key=${YT_API_KEY}`)
        .then((res) => res.json());

      const channel = channelData.items?.[0];
      if (!channel) throw new Error("Unable to fetch channel details");

      const { title, description } = channel.snippet;
      const reach = channel.statistics.subscriberCount;

      // Auto-generate topics (very basic, upgrade later)
      const topics = extractTopics(description);

      // Insert into Supabase
      const { error } = await supabase.from("creators").insert([
        {
          name: title,
          niche: "Auto", // Can refine with AI later
          reach: parseInt(reach),
          youtube_channel_id: channelId,
          topics,
        },
      ]);

      if (error) throw error;

      setStatus("✅ Creator added successfully");
    } catch (err: any) {
      setStatus("❌ " + err.message);
    }

    setLoading(false);
  };

  const resolveChannelId = async (input: string): Promise<string | null> => {
    const isUrl = input.includes("youtube.com");

    if (isUrl) {
      const url = new URL(input);
      const path = url.pathname.split("/");
      const username = path[path.length - 1];

      if (url.pathname.includes("/channel/")) return username;

      // If it's /c/ or /user/, resolve to channel ID
      const data = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=${username}&key=${YT_API_KEY}`)
        .then((res) => res.json());

      return data.items?.[0]?.snippet?.channelId || null;
    }

    // If plain text, treat as username or ID
    return input;
  };

  const extractTopics = (desc: string): string[] => {
    const words = desc.toLowerCase().split(/\W+/);
    const topicWords = words.filter((w) =>
      ["travel", "comedy", "tech", "fitness", "music", "gaming", "lifestyle", "food", "fashion"].includes(w)
    );
    return [...new Set(topicWords)];
  };

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-bold">🔍 Add Creator from YouTube</h1>
      <input
        type="text"
        placeholder="Paste YouTube Channel URL or Username"
        value={channelInput}
        onChange={(e) => setChannelInput(e.target.value)}
        className="w-full border rounded p-2"
      />
      <button
        onClick={fetchChannelInfo}
        disabled={loading}
        className="bg-black text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? "Processing..." : "Fetch & Add Creator"}
      </button>

      {status && <p>{status}</p>}
    </div>
  );
}

