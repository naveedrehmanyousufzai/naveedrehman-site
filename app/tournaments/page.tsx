import type { Metadata } from 'next';
import { createClient } from 'next-sanity';
import Link from 'next/link';
import Image from 'next/image';
import { urlFor } from '@/lib/img';

export const metadata: Metadata = {
  title: 'Career Archive',
  description:
    "Official tournament records, match reports, and draws from Naveed Rehman's professional squash circuit and Sindh Squash Association events.",
  alternates: { canonical: '/tournaments' },
};

// Initialize Sanity Client
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-05-28',
  useCdn: false,
});

export const revalidate = 0;

export default async function TournamentsPage() {
  // Structured career tournament records, newest first
  const tournaments = await client.fetch(`
    *[_type == "tournament"] | order(date desc) {
      _id,
      tournament,
      date,
      city,
      tier,
      result,
      opponent,
      score,
      "imageUrl": image.asset->url,
      "imageBlur": image.asset->metadata.lqip,
      sourceUrl
    }
  `);

  return (
    <main className="min-h-screen bg-[#F8F9FA] text-black pt-32 pb-20 px-6 md:px-12">
      <div className="max-w-[1000px] mx-auto">
        
        {/* PAGE HEADER */}
        <div className="mb-16">
          <Link href="/" className="text-sm font-bold text-gray-400 hover:text-[#D4AF37] uppercase tracking-widest mb-6 inline-block transition-colors">
            ← Back to Home
          </Link>
          <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter mb-4 text-black">
            Career <span className="text-[#D4AF37]">Archive</span>
          </h1>
          <div className="w-24 h-2 bg-[#D4AF37] mb-6"></div>
          <p className="text-lg text-gray-600 max-w-2xl">
            Official tournament records, match reports, and draws from the professional squash circuit and Sindh Squash Association events.
          </p>
        </div>

        {/* TIMELINE LIST */}
        <div className="space-y-6">
          {tournaments.length > 0 ? (
            tournaments.map((t: any) => (
              <div
                key={t._id}
                className="bg-white p-6 md:p-8 rounded-lg shadow-sm border border-gray-100 border-l-4 border-l-[#D4AF37] hover:shadow-md transition-shadow flex flex-col md:flex-row gap-8 items-start md:items-center"
              >
                {t.imageUrl && (
                  <div className="relative w-full md:w-48 h-32 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                    <Image
                      src={urlFor(t.imageUrl).width(640).fit('max').auto('format').url()}
                      alt={t.tournament}
                      fill
                      sizes="(max-width: 768px) 100vw, 192px"
                      placeholder={t.imageBlur ? 'blur' : 'empty'}
                      blurDataURL={t.imageBlur || undefined}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="flex-grow">
                  <div className="text-xs font-black text-[#D4AF37] uppercase tracking-widest mb-2">
                    {new Date(t.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </div>
                  <h2 className="text-2xl font-bold text-black mb-2 leading-tight">
                    {t.tournament}
                  </h2>
                  <div className="text-sm font-medium text-gray-500 mb-3">
                    {[t.tier, t.city].filter(Boolean).join(' • ')}
                  </div>

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mb-4">
                    <span className="inline-block text-sm font-bold bg-[#D4AF37]/10 text-[#b5952f] px-3 py-1 rounded">
                      {t.result}
                    </span>
                    {t.opponent && (
                      <span className="text-sm text-gray-600 font-medium">
                        vs {t.opponent}{t.score ? ` — ${t.score}` : ''}
                      </span>
                    )}
                  </div>

                  {t.sourceUrl && (
                    <a
                      href={t.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-bold bg-black text-white px-4 py-2 rounded hover:bg-[#D4AF37] transition-colors"
                    >
                      View Official Draw / Report →
                    </a>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white p-12 rounded border-2 border-dashed border-gray-200 text-center text-gray-500 font-medium">
              No tournament records found in the archive.
            </div>
          )}
        </div>

      </div>
    </main>
  );
}