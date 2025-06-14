"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabaseClient";

type Creator = {
  id: string;
  name: string;
  reach: number;
  niche: string;
  topics: string[];
};

export default function CreatorsPage() {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCreators = async () => {
      const { data, error } = await supabase
        .from("creators")
        .select("*")
        .order("reach", { ascending: false });

      if (error) {
        console.error("Error fetching creators:", error.message);
      } else {
        setCreators(data || []);
      }

      setLoading(false);
    };

    fetchCreators();
  }, []);

  if (loading) return <div className="p-8">Loading creators...</div>;

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-bold">📋 All Creators</h1>
      {creators.length === 0 ? (
        <p>No creators found.</p>
      ) : (
        <ul className="space-y-4">
          {creators.map((creator) => (
            <li
              key={creator.id}
              className="border p-4 rounded shadow-sm hover:shadow-md transition"
            >
              <h2 className="text-lg font-semibold">{creator.name}</h2>
              <p>
                <strong>Niche:</strong> {creator.niche}
              </p>
              <p>
                <strong>Reach:</strong> {creator.reach.toLocaleString()}
              </p>
              <p>
                <strong>Topics:</strong>{" "}
                {creator.topics && Array.isArray(creator.topics)
                  ? creator.topics.join(", ")
                  : "N/A"}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
