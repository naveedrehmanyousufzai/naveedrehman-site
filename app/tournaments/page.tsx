import { createClient } from 'next-sanity';
import Link from 'next/link';

// Initialize Sanity Client
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-05-28',
  useCdn: false,
});

export const revalidate = 0;

export default async function TournamentsIndexPage() {
  // Fetch all tournaments, sorted by date (newest first)
  const tournaments = await client.fetch(`
    *[_type == "tournament"] | order(startDate desc) {
      _id,
      title,
      slug,
      startDate,
      endDate,
      finalResult
    }
  `);

  // Get today's date in YYYY-MM-DD format to compare against tournament dates
  const today = new Date().toISOString().split('T')[0];

  // Engine to separate tournaments based on date
  const upcomingTournaments = tournaments.filter((t: any) => !t.endDate || t.endDate >= today);
  const pastTournaments = tournaments.filter((t: any) => t.endDate && t.endDate < today);

  return (
    <main className="min-h-screen bg-[#111111] text-white pt-32 pb-20 px-6 md:px-12">
      <div className="max-w-[1000px] mx-auto">
        
        {/* NEW CAREER HEADING SECTION */}
        <div className="mb-16 border-b border-white/10 pb-8">
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4 text-white">
            CAREER <span className="text-[#D4AF37]">ARCHIVE</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl leading-relaxed">
            A complete record of my professional squash career, featuring upcoming fixtures, official draws, and past tournament results.
          </p>
        </div>

        {/* UPCOMING TOURNAMENTS SECTION */}
        <div className="mb-16">
          <h2 className="text-2xl font-black uppercase tracking-widest mb-6 text-[#D4AF37] flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span>
            Upcoming & Active
          </h2>
          
          {upcomingTournaments.length > 0 ? (
            <div className="flex flex-col gap-4">
              {upcomingTournaments.map((t: any) => (
                <div key={t._id} className="bg-[#1a1a1a] border border-white/10 rounded-lg p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-lg hover:border-[#D4AF37]/50 transition-colors">
                  <div>
                    <span className="bg-[#D4AF37]/10 text-[#D4AF37] text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded border border-[#D4AF37]/30 mb-3 inline-block">
                      Upcoming
                    </span>
                    <h3 className="text-xl font-bold text-white mb-2">{t.title}</h3>
                    <div className="text-sm text-gray-400 font-medium flex items-center gap-2">
                      📅 {t.startDate} {t.endDate && `– ${t.endDate}`}
                    </div>
                  </div>
                  
                  <Link 
                    href={`/tournaments/${t.slug?.current}`}
                    className="w-full md:w-auto text-center border border-white/20 hover:border-[#D4AF37] hover:text-[#D4AF37] bg-black/50 px-6 py-3 rounded text-sm font-bold uppercase tracking-wider transition-all"
                  >
                    View Details
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-[#1a1a1a] border border-white/5 rounded-lg p-8 text-center text-gray-500 font-medium">
              No upcoming tournaments currently scheduled.
            </div>
          )}
        </div>

        {/* PAST TOURNAMENTS SECTION */}
        <div>
          <h2 className="text-2xl font-black uppercase tracking-widest mb-6 text-white border-b border-white/10 pb-4">
            Completed Tournaments
          </h2>
          
          {pastTournaments.length > 0 ? (
            <div className="flex flex-col gap-4">
              {pastTournaments.map((t: any) => (
                <div key={t._id} className="bg-[#111] border border-white/5 rounded-lg p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:bg-white/5 transition-colors">
                  <div>
                    <div className="flex gap-3 mb-3">
                      <span className="bg-white/5 text-gray-400 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded border border-white/10">
                        Completed
                      </span>
                      {t.finalResult && (
                        <span className="bg-[#D4AF37]/10 text-[#D4AF37] text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded border border-[#D4AF37]/30">
                          {t.finalResult}
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-gray-200 mb-2">{t.title}</h3>
                    <div className="text-sm text-gray-500 font-medium flex items-center gap-2">
                      📅 {t.startDate} {t.endDate && `– ${t.endDate}`}
                    </div>
                  </div>
                  
                  <Link 
                    href={`/tournaments/${t.slug?.current}`}
                    className="w-full md:w-auto text-center border border-white/10 hover:border-white text-gray-300 px-6 py-3 rounded text-sm font-bold uppercase tracking-wider transition-all"
                  >
                    View Archive
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-[#111] border border-white/5 rounded-lg p-8 text-center text-gray-500 font-medium">
              No past tournaments found.
            </div>
          )}
        </div>
        
      </div>
    </main>
  );
}