import { createClient } from 'next-sanity';
import { notFound } from 'next/navigation';

// Initialize Sanity Client
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-05-28',
  useCdn: false,
});

export const revalidate = 0;

export default async function CareerTournamentPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;

  if (!slug) notFound();

  // GROQ Query to fetch tournament details AND resolve the actual file URLs
  const tournament = await client.fetch(
    `*[_type == "tournament" && slug.current == $slug][0]{
      title,
      startDate,
      endDate,
      finalResult,
      lastOpponent,
      "entryListUrl": entryListFile.asset->url,
      "drawFileUrl": drawFile.asset->url,
      "galleryUrls": gallery[].asset->url
    }`,
    { slug }
  );

  if (!tournament) notFound();

  return (
    <main className="min-h-screen bg-[#111111] text-white pt-32 pb-20 px-6 md:px-12">
      <div className="max-w-[1200px] mx-auto">
        
        {/* TOURNAMENT HEADER */}
        <div className="mb-12 border-b border-white/10 pb-8 text-center md:text-left">
          <span className="text-[#D4AF37] font-black uppercase tracking-widest text-sm block mb-2">
            Career Archive
          </span>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4">
            {tournament.title}
          </h1>
          <div className="flex flex-col md:flex-row gap-4 text-sm text-gray-400 font-bold uppercase tracking-wider justify-center md:justify-start">
            {tournament.startDate && <span>Starts: {tournament.startDate}</span>}
            {tournament.endDate && <span>Ends: {tournament.endDate}</span>}
          </div>
        </div>

        {/* PERFORMANCE OVERVIEW */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-[#1a1a1a] border border-[#D4AF37]/30 rounded-lg p-8 shadow-lg flex flex-col justify-center items-center text-center">
            <span className="text-gray-400 font-bold uppercase tracking-widest text-xs mb-2">Final Result</span>
            <span className="text-3xl md:text-4xl font-black text-[#D4AF37] uppercase tracking-tight">
              {tournament.finalResult || 'Pending'}
            </span>
          </div>

          <div className="bg-[#1a1a1a] border border-white/10 rounded-lg p-8 shadow-lg flex flex-col justify-center items-center text-center">
            <span className="text-gray-400 font-bold uppercase tracking-widest text-xs mb-2">Last Opponent</span>
            <span className="text-2xl md:text-3xl font-bold text-white uppercase tracking-tight">
              {tournament.lastOpponent || 'TBD'}
            </span>
          </div>
        </div>

        {/* DOCUMENTS & ATTACHMENTS */}
        {(tournament.entryListUrl || tournament.drawFileUrl) && (
          <div className="mb-16">
            <h2 className="text-2xl font-black uppercase tracking-tight mb-6 border-b border-white/10 pb-4">
              Official Documents
            </h2>
            <div className="flex flex-wrap gap-6">
              {tournament.entryListUrl && (
                <a 
                  href={tournament.entryListUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-[#1a1a1a] border border-white/20 hover:border-[#D4AF37] hover:bg-white/5 transition-all px-8 py-4 rounded-lg shadow-lg"
                >
                  <span className="text-2xl">📋</span>
                  <div>
                    <span className="block font-bold text-white uppercase tracking-wider">View Entry List</span>
                    <span className="text-xs text-gray-500 uppercase tracking-widest">Click to Open File</span>
                  </div>
                </a>
              )}

              {tournament.drawFileUrl && (
                <a 
                  href={tournament.drawFileUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-[#1a1a1a] border border-white/20 hover:border-[#D4AF37] hover:bg-white/5 transition-all px-8 py-4 rounded-lg shadow-lg"
                >
                  <span className="text-2xl">🏆</span>
                  <div>
                    <span className="block font-bold text-white uppercase tracking-wider">View Official Draw</span>
                    <span className="text-xs text-gray-500 uppercase tracking-widest">Click to Open File</span>
                  </div>
                </a>
              )}
            </div>
          </div>
        )}

        {/* PHOTO GALLERY */}
        {tournament.galleryUrls && tournament.galleryUrls.length > 0 && (
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tight mb-6 border-b border-white/10 pb-4">
              Tournament Gallery
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {tournament.galleryUrls.map((url: string, index: number) => (
                <div key={index} className="aspect-square bg-[#1a1a1a] border border-white/10 rounded-lg overflow-hidden group">
                  <img 
                    src={url} 
                    alt={`${tournament.title} gallery image ${index + 1}`} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </main>
  );
}