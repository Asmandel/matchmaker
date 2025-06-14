'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabaseClient';

type Creator = {
  id: string;
  name: string;
  slug: string;
  niche: string;
  reach: number;
  topics: string; // ← fixed type here
};

export default function HomePage() {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchCreators = async () => {
      const { data, error } = await supabase
        .from('creators')
        .select('*');

      if (error) {
        console.error('Error fetching creators:', error.message);
      } else {
        setCreators(data || []);
      }

      setLoading(false);
    };

    fetchCreators();
  }, []);

  if (loading) return <div className="p-8">Loading creators...</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Creator Directory</h1>
      <ul>
        {creators.map((creator) => (
          <li key={creator.id} className="mb-2">
            <Link href={`/creators/${creator.slug}`} className="text-blue-600 hover:underline">
              {creator.name}
            </Link>
            <p className="text-sm">Niche: {creator.niche}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export const dynamic = 'force-dynamic';
