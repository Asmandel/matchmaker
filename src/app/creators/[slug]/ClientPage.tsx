'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabaseClient';

type Creator = {
  id: string;
  name: string;
  slug: string;
  niche: string;
  reach: number;
  topics: string;
};

export default function CreatorClientPage({ slug }: { slug: string }) {
  const [creator, setCreator] = useState<Creator | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchCreator = async () => {
      const { data, error } = await supabase
        .from('creators')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) {
        console.error('Error fetching creator:', error.message);
      } else {
        setCreator(data);
      }

      setLoading(false);
    };

    fetchCreator();
  }, [slug, supabase]);

  if (loading) return <div className="p-8">Loading creator...</div>;
  if (!creator) return <div className="p-8">Creator not found.</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-2">{creator.name}</h1>
      <p className="mb-2">Niche: {creator.niche}</p>
      <p className="mb-2">Reach: {creator.reach}</p>
      <p>Topics: {creator.topics}</p>
    </div>
  );
}
