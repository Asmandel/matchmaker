import { supabase } from "@/lib/supabaseClient";

type Props = {
  params: {
    slug: string;
  };
};

export default async function CreatorPage({ params }: Props) {
  const { slug } = params;

  const { data, error } = await supabase
    .from("creators")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !data) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Creator Not Found</h1>
        <p>{error?.message ?? "No data available."}</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">{data.name}</h1>
      <p className="mb-2">Niche: {data.niche}</p>
      <p>Topics: {data.topics}</p>
    </div>
  );
}
