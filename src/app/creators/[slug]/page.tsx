export const dynamic = "force-dynamic";

import { supabase } from "../../../../lib/supabaseClient";
import { notFound } from "next/navigation";

type Creator = {
  id: string;
  name: string;
  reach: number;
  niche: string;
  topics: string[];
  youtube_channel_id: string;
};

function slugify(name: string): string {
  return name.toLowerCase().replace(/[^\w]+/g, "-").replace(/(^-|-$)/g, "");
}

type Params = {
  params: {
    slug: string;
  };
};

export default async function Page({ params }: Params) {
  const { slug } = params;

  const { data, error } = await supabase.from("creators").select("*");
  if (error || !data) return notFound();

  const match = data.find((c: Creator) => slugify(c.name) === slug);
  if (!match) return notFound();

  return (
    <div className="p-8 space-y-4">
      <h1 className="text-3xl font-bold">{match.name}</h1>
      <p><strong>Niche:</strong> {match.niche}</p>
      <p><strong>Reach:</strong> {match.reach.toLocaleString()}</p>
      <p><strong>Topics:</strong> {match.topics.join(", ")}</p>
      <a
        href={`https://youtube.com/channel/${match.youtube_channel_id}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 underline"
      >
        Visit YouTube Channel →
      </a>
    </div>
  );
}
