import { supabase } from "@/lib/supabaseClient";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const { data: creators } = await supabase.from("creators").select("slug");
  return creators?.map((c) => ({ slug: c.slug })) || [];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function CreatorPage({ params }: any) {
  const { slug } = params;

  const { data: creator, error } = await supabase
    .from("creators")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!creator || error) return notFound();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-2">{creator.name}</h1>
      <p className="mb-4 text-gray-600">Niche: {creator.niche}</p>
      <p>{creator.description}</p>
    </div>
  );
}
