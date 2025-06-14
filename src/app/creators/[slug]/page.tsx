import { supabase } from "@/lib/supabaseClient";

type Props = {
  params: {
    slug: string;
  };
};

export default async function CreatorPage({ params }: Props) {
  const { slug } = params;

  const { data: creator, error } = await supabase
    .from("creators")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold">Error loading creator</h1>
        <p>{error.message}</p>
      </div>
    );
  }

  if (!creator) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold">Creator not found</h1>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">{creator.name}</h1>
      <p className="mb-2">Niche: {creator.niche}</p>
      <p className="mb-2">YouTube: <a href={creator.youtube_url} className="text-blue-600 underline">{creator.youtube_url}</a></p>
      <p className="mb-2">Topics: {creator.topics?.join(", ")}</p>
    </div>
  );
}
