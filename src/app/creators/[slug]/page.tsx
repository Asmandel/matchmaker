import { supabase } from "@/lib/supabaseClient";

type Params = {
  slug: string;
};

export default async function CreatorPage({
  params,
}: {
  params: Params;
}) {
  const { slug } = params;
  const { data: creator } = await supabase
    .from("creators")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!creator) {
    return <div className="p-8">Creator not found</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">{creator.name}</h1>
      <p className="text-gray-600">{creator.niche}</p>
      <div className="mt-4">
        <h2 className="text-lg font-semibold">Topics</h2>
        <ul className="list-disc pl-6">
          {(creator.topics || []).map((topic: string, index: number) => (
            <li key={index}>{topic}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
