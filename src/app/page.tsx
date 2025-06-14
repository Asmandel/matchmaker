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

      const topics = await extractTopics(channelId, description);

      const { error } = await supabase.from("creators").insert([
        {
          name: title,
          niche: "Auto",
          reach: parseInt(reach),
          youtube_channel_id: channelId,
          topics,
        },
      ]);

      if (error) throw error;

      setStatus("✅ Creator added successfully");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setStatus("❌ " + message);
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

      const data = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=${username}&key=${YT_API_KEY}`)
        .then((res) => res.json());

      return data.items?.[0]?.snippet?.channelId || null;
    }

    return input;
  };

  const extractTopics = async (channelId: string, description: string): Promise<string[]> => {
    try {
      const videosRes = await fetch(
        `https://www.googleapis.com/youtube/v3/search?key=${YT_API_KEY}&channelId=${channelId}&part=snippet&order=date&maxResults=10&type=video`
      );
      const videos = await videosRes.json();

      const videoData = videos.items?.map((item: { snippet: { title: string; description: string } }) => ({
        title: item.snippet.title,
        description: item.snippet.description,
      })) || [];

      const prompt = `
You are an AI that summarizes YouTube content trends.

Here is a YouTube channel description:
---
${description}
---

And here are the 10 latest video titles and descriptions:
---
${videoData.map(v => `Title: ${v.title}\nDescription: ${v.description}`).join("\n\n")}
---

Based on this info, return a JSON array of 3 to 6 relevant topics or themes this creator consistently covers. Format example: ["fitness", "nutrition", "lifestyle"]
`;

      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.5,
        }),
      });

      const result = await response.json();
      const jsonText = result.choices?.[0]?.message?.content || "[]";
      const topics = JSON.parse(jsonText);

      return Array.isArray(topics) ? topics : [];
    } catch (err) {
      console.error("OpenAI topic extraction error:", err);
      return [];
    }
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


