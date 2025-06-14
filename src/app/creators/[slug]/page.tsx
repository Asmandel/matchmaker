export const dynamic = "force-dynamic";

import { supabase } from "@/lib/supabaseClient";
import { notFound } from "next/navigation";
import { Metadata } from "next";

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

// ✅ This matches Next.js's expected PageProps type exactly
interface PageProps {
  params: {
    slug: string;
  };
}

// Optional metadata
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  return {
    title: `${params.slug} | Creator`,
  };
}

// ✅ No Promises used in wrong places, clean async page
export default async function Page({ params }: PageProps) {
  const { slug } = params;

  const { data, error } = await supabase.from("creators").select("*");
  if (error || !data) return notFound();

  const creator = data.find((c) => slugify(c.name) === slug) as Creator;
  if (!creator) return notFound();

  return (
    <div className="p-8 space-y-4">
      <h1 className="text-3xl font-bold">{creator.name}</h1>
      <p><strong>Niche:</strong> {creator.niche}</p>
      <p><strong>Reach:</strong> {creator.reach.toLocaleString()}</p>
      <p><strong>Topics:</strong> {creator.topics.join(", ")}</p>
      <a
        href={`https://youtube.com/channel/${creator.youtube_channel_id}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 underline"
      >
        Visit YouTube Channel →
      </a>
    </div>
  );
}
