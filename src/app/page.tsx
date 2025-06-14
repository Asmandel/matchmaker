"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

type Creator = {
  id: string;
  name: string;
  niche: string | null;
};

export default function Home() {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCreators = async () => {
      const { data, error } = await supabase.from("creators").select("*");

      if (error) {
        console.error("Error fetching creators:", error.message);
      } else {
        setCreators((data as Creator[]) || []);
      }

      setLoading(false);
    };

    fetchCreators();
  }, []);

  if (loading) return <div className="p-8">Loading creators...</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">🎥 Creators</h1>
      {creators.length === 0 ? (
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

