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
  const [filtered, setFiltered] = useState<Creator[]>([]);
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCreators = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("creators")
        .select("*")
        .order("reach", { ascending: sortOrder === "asc" });

      if (error) {
        console.error("Error fetching creators:", error.message);
        setLoading(false);
        return;
      }

      setCreators(data || []);
      setLoading(false);
    };

    fetchCreators();
  }, [sortOrder]);

  useEffect(() => {
    const filteredList = creators.filter((c) =>
      `${c.name} ${c.niche}`.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(filteredList);
  }, [search, creators]);

  if (loading) return <div className="p-8">Loading creators...</div>;

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-bold">📋 All Creators</h1>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <input
          type="text"
          placeholder="Search by name or niche"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded p-2 w-full sm:w-1/2"
        />
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
          className="border rounded p-2"
        >
          <option value="desc">Reach: High to Low</option>
          <option value="asc">Reach: Low to High</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <p>No creators match your search.</p>
      ) : (
        <ul className="space-y-4">
          {filtered.map((creator) => (
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
                {Array.isArray(creator.topics)
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
