import Link from 'next/link';
import { createClient } from 'next-sanity';

// Force real-time updates
export const revalidate = 0;

export const metadata = {
  title: 'Tournaments & Events | Naveed Rehman',
};

// Database Connection
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-05-28',
  useCdn: false,
});

export default async function TournamentsPage() {
  // Fetch all tournaments, now including the 'slug' to link to the details page
  const tournaments = await client.fetch(`
    *[_type == "tournament"] | order(endDate desc) {
      _id,
      title,
      subtitle,
      startDate,
      endDate,
      location,
      "slug": slug.current
    }
  `);

  // Time-travel logic: Figure out today's date to separate Upcoming vs Completed
  const today = new Date().toISOString().split('T')[0]; // Gets YYYY-MM-DD

  const upcomingEvents = tournaments.filter((t: any) => t.endDate >= today);
  const completedEvents = tournaments.filter((t: any) => t.endDate < today);

  // Helper function to make dates look pretty (e.g., "June 8, 2026")
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC'
    });
  };

  return (
    <main className="min-h-screen bg-[#111111] text-white selection:bg-[#D4AF37] selection:text-black pb-20">
      
      {/* Page Header */}
      <section className="pt-32 pb-12 px-6 md:px-12 max-w-7xl mx-auto border-b border-white/10">
        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter drop-shadow-lg">
          Official <span className="text-[#D4AF37]">Tournaments</span>
        </h1>
        <p className="mt-4 text-gray-400 text-lg max-w-2xl font-light">
          Sanctioned events, PSA Satellite tournaments, and official championships managed by the Sindh Squash Association.
        </p>
      </section>

      {/* Tournaments Roster */}
      <section className="pt-12 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="flex flex-col gap-6">
          
          {/* UPCOMING EVENTS LOOP */}
          {upcomingEvents.map((tourney: any) => (
            <div key={tourney._id} className="bg-[#1a1a1a] border border-[#D4AF37]/50 rounded-lg p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden shadow-lg hover:bg-[#222] transition-colors">
              <div className="absolute top-0 left-0 w-2 h-full bg-[#D4AF37]"></div>
              <div>
                <span className="text-[#D4AF37] text-xs font-bold uppercase tracking-wider bg-[#D4AF37]/10 px-3 py-1 rounded-full mb-3 inline-block">
                  Upcoming Event
                </span>
                <h2 className="text-2xl font-bold mb-1">{tourney.title}</h2>
                <p className="text-gray-400 font-medium tracking-wide flex items-center gap-2 flex-wrap">
                  <span>📅 {formatDate(tourney.startDate)} – {formatDate(tourney.endDate)}</span>
                  {tourney.location && <span>| 📍 {tourney.location}</span>}
                  {tourney.subtitle && <span>| {tourney.subtitle}</span>}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                {tourney.slug ? (
                  <Link href={`/tournaments/${tourney.slug}`} className="bg-[#D4AF37] text-[#111111] px-6 py-3 font-bold rounded hover:bg-white transition-colors uppercase tracking-wide text-sm text-center">
                    Event Details
                  </Link>
                ) : (
                  <span className="text-gray-500 text-sm uppercase tracking-widest font-bold">Details Soon</span>
                )}
              </div>
            </div>
          ))}

          {/* COMPLETED EVENTS LOOP */}
          {completedEvents.map((tourney: any) => (
            <div key={tourney._id} className="bg-[#1a1a1a] border border-white/5 rounded-lg p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:border-white/20 transition-colors">
              <div>
                <span className="text-gray-400 text-xs font-bold uppercase tracking-wider bg-white/5 px-3 py-1 rounded-full mb-3 inline-block">
                  Completed
                </span>
                <h2 className="text-2xl font-bold mb-1 text-gray-200">{tourney.title}</h2>
                <p className="text-gray-500 font-medium tracking-wide flex items-center gap-2 flex-wrap">
                  <span>📅 {formatDate(tourney.startDate)} – {formatDate(tourney.endDate)}</span>
                  {tourney.location && <span>| 📍 {tourney.location}</span>}
                  {tourney.subtitle && <span>| {tourney.subtitle}</span>}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                {tourney.slug && (
                  <Link href={`/tournaments/${tourney.slug}`} className="border border-white/20 text-white px-6 py-3 font-bold rounded hover:bg-white hover:text-[#111111] transition-colors uppercase tracking-wide text-sm text-center whitespace-nowrap">
                    Report & Results
                  </Link>
                )}
              </div>
            </div>
          ))}

          {/* EMPTY STATE */}
          {tournaments.length === 0 && (
             <div className="text-center py-12 text-gray-500 font-light border border-dashed border-white/10 rounded">
                No tournaments found. Add your events in the Command Center.
             </div>
          )}

        </div>
      </section>

    </main>
  );
}