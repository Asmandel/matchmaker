"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function Home() {
  const [creators, setCreators] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [youtubeUrl, setYoutubeUrl] = useState("");

  useEffect(() => {
    const fetchCreators = async () => {
      const { data, error } = await supabase.from("creators").select("*");
      if (!error) setCreators(data || []);
      setLoading(false);
    };

    fetchCreators();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!youtubeUrl) return;

    const channelId = youtubeUrl.split("/").pop()?.split("?")[0] || "";

    // 1. Get channel details
    const channelRes = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelId}&key=${process.env.NEXT_PUBLIC_YOUTUBE_API_KEY}`
    );
    const channelJson = await channelRes.json();
    const channel = channelJson.items?.[0];

    if (!channel) {
      alert("Channel not found.");
      return;
    }

    const name = channel.snippet.title;
    const description = channel.snippet.description;
    const reach = channel.statistics.subscriberCount;

    // 2. Get recent videos
    const uploadsPlaylistId = channel.contentDetails?.relatedPlaylists?.uploads;
    let videoTitles = "";

    if (uploadsPlaylistId) {
      const videosRes = await fetch(
        `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=10&playlistId=${uploadsPlaylistId}&key=${process.env.NEXT_PUBLIC_YOUTUBE_API_KEY}`
      );
      const videosJson = await videosRes.json();
      const titles = videosJson.items?.map((v: any) => v.snippet.title) || [];
      videoTitles = titles.join(", ");
    }

    // 3. Ask OpenAI for topics
    const openaiRes = await fetch("/api/topics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ description, videoTitles }),
    });

    const { topics } = await openaiRes.json();

    // 4. Save to Supabase
    const { error } = await supabase.from("creators").insert([
      {
        name,
        reach,
        youtube: youtubeUrl,
        description,
        topics,
      },
    ]);

    if (!error) {
      setYoutubeUrl("");
      const { data } = await supabase.from("creators").select("*");
      setCreators(data || []);
    } else {
      alert("Failed to save creator.");
    }
  };

  if (loading) return <div className="p-8">Loading creators...</div>;

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🎥 Creators</h1>

      <form onSubmit={handleSubmit} className="mb-6">
        <input
          type="text"
          placeholder="Paste YouTube channel URL"
          value={youtubeUrl}
          onChange={(e) => setYoutubeUrl(e.target.value)}
          className="border p-2 w-full rounded mb-2"
        />
        <button type="submit" className="bg-black text-white px-4 py-2 rounded">
          Submit
        </button>
      </form>

      {creators.length === 0 ? (
        <p>No creators found.</p>
      ) : (
        <ul className="list-disc pl-6">
          {creators.map((c) => (
            <li key={c.id}>
              <strong>{c.name}</strong> — {c.topics}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
