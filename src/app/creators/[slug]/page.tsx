import { supabase } from "@/lib/supabaseClient";

export default async function CreatorPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const { data: creators } = await supabase
    .from("creators")
    .select("*")
    .eq("slug", slug)
    .limit(1);

  const creator = creators?.[0];

  if (!creator) {
    return <div className="p-8">Creator not found.</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-2">{creator.name}</h1>
      <p className="mb-1"><strong>Niche:</strong> {creator.niche}</p>
      <p className="mb-1"><strong>YouTube:</strong> {creator.youtube}</p>
      <p className="mb-1"><strong>Topics:</strong> {creator.topics}</p>
    </div>
  );
}
