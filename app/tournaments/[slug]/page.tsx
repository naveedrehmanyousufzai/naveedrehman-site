import { createClient } from 'next-sanity';
import { notFound } from 'next/navigation';

// Initialize Sanity Client
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-05-28',
  useCdn: false, // Forces fresh data
});

// CRITICAL: Tells Next.js not to cache this page so live scores update instantly
export const revalidate = 0; 

export default async function TournamentBracketPage({ params }: { params: { slug: string } }) {
  const { slug } = params;

  // Fetch the tournament data
  const tournament = await client.fetch(
    `*[_type == "tournament" && slug.current == $slug][0]`,
    { slug }
  );

  if (!tournament) {
    notFound();
  }

  // 1. ENGINE: Group Registered Players by Category
  const groupedPlayers: { [key: string]: any[] } = {};
  if (tournament.playerList && tournament.playerList.length > 0) {
    tournament.playerList.forEach((player: any) => {
      // Default to 'General' if you forgot to assign a category to a player
      const category = player.category || 'General';
      if (!groupedPlayers[category]) {
        groupedPlayers[category] = [];
      }
      groupedPlayers[category].push(player);
    });
  }

  // 2. ENGINE: Group the linear match array into columns by round for the Bracket
  const rounds: { [key: string]: any[] } = {};
  const roundNames: string[] = [];

  if (tournament.draws) {
    tournament.draws.forEach((match: any) => {
      if (!rounds[match.round]) {
        rounds[match.round] = [];
        roundNames.push(match.round);
      }
      rounds[match.round].push(match);
    });
  }

  return (
    <main className="min-h-screen bg-[#111111] text-white pt-32 pb-20 px-6 md:px-12">
      <div className="max-w-[1400px] mx-auto">
        
        {/* TOURNAMENT HEADER */}
        <div className="mb-12 border-b border-white/10 pb-8">
          <span className="text-[#D4AF37] font-black uppercase tracking-widest text-sm block mb-2">
            Official Live Tournament
          </span>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4">
            {tournament.title}
          </h1>
          <div className="flex gap-4 text-sm text-gray-400 font-bold uppercase tracking-wider">
            {tournament.startDate && <span>Starts: {tournament.startDate}</span>}
            {tournament.endDate && <span>Ends: {tournament.endDate}</span>}
          </div>
        </div>

        {/* NEW: REGISTERED PLAYERS CATEGORY ACCORDION */}
        <div className="mb-20">
          <h2 className="text-2xl font-black uppercase tracking-tight mb-6 border-b border-white/10 pb-4">
            Registered Players
          </h2>
          
          {Object.keys(groupedPlayers).length > 0 ? (
            <div className="flex flex-col gap-4">
              {Object.entries(groupedPlayers).map(([category, players]) => (
                <details key={category} className="group bg-[#1a1a1a] border border-white/10 rounded-lg overflow-hidden [&_summary::-webkit-details-marker]:hidden shadow-lg">
                  <summary className="cursor-pointer p-6 flex justify-between items-center hover:bg-white/5 transition-colors font-black uppercase tracking-widest text-[#D4AF37]">
                    <div className="flex items-center gap-3">
                      <span>{category}</span>
                      <span className="bg-[#D4AF37]/10 text-[#D4AF37] text-xs px-2 py-0.5 rounded border border-[#D4AF37]/20">
                        {players.length} Athletes
                      </span>
                    </div>
                    {/* Expand/Collapse Arrow */}
                    <span className="text-white group-open:rotate-180 transition-transform duration-300">▼</span>
                  </summary>
                  
                  {/* Expanded List View */}
                  <div className="p-6 border-t border-white/5 bg-black/40 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {players
                      // Sort players alphabetically (or by seed if you prefer)
                      .sort((a: any, b: any) => (a.playerName || '').localeCompare(b.playerName || ''))
                      .map((p: any, i: number) => (
                      <div key={i} className="flex justify-between items-center bg-[#111] p-3 rounded border border-white/5 shadow-sm">
                        <span className="font-medium text-gray-200">{p.playerName}</span>
                        {p.seed && (
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-[#D4AF37] text-black px-2 py-1 rounded">
                            Seed {p.seed}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </details>
              ))}
            </div>
          ) : (
             <div className="bg-[#1a1a1a] p-8 rounded-lg border border-white/10 text-center">
               <p className="text-gray-500 font-medium">Player registrations have not been publicly published yet.</p>
             </div>
          )}
        </div>

        {/* BRACKET RENDERER */}
        <div>
          <h2 className="text-2xl font-black uppercase tracking-tight mb-6 border-b border-white/10 pb-4">
            Official Draw
          </h2>
          
          {tournament.draws && tournament.draws.length > 0 ? (
            <div className="flex gap-10 overflow-x-auto pb-10 custom-scrollbar relative">
              {roundNames.map((roundName, roundIdx) => {
                const matchesInRound = rounds[roundName];
                
                return (
                  <div key={roundIdx} className="min-w-[320px] flex flex-col gap-6">
                    {/* Round Header */}
                    <h3 className="text-center bg-[#D4AF37] text-black font-black uppercase tracking-widest py-2.5 rounded shadow-lg sticky top-0 z-20">
                      {roundName}
                    </h3>

                    {/* Matches Column */}
                    <div className="flex flex-col gap-6 justify-around h-full">
                      {matchesInRound.map((match: any, idx: number) => (
                        <div key={idx} className="flex flex-col bg-[#1a1a1a] border border-white/10 rounded-lg overflow-hidden shadow-lg hover:border-[#D4AF37]/50 transition-colors relative">
                          
                          {/* Match Number Badge */}
                          <div className="absolute top-1/2 -translate-y-1/2 -left-3 bg-[#D4AF37] text-black text-[10px] font-black w-6 h-6 flex items-center justify-center rounded-full border-2 border-[#1a1a1a] z-10 shadow-lg">
                            {match.matchNumber || '-'}
                          </div>

                          {/* Scheduling Metadata Bar (Date, Time, Court) */}
                          {(match.date || match.time || match.court) && (
                            <div className="bg-black/50 text-gray-400 text-[10px] font-bold uppercase tracking-wider px-4 py-2 border-b border-white/5 flex gap-3 flex-wrap pl-6">
                              {match.date && <span>📅 {match.date}</span>}
                              {match.time && <span>⏰ {match.time}</span>}
                              {match.court && <span className="text-[#D4AF37]">📍 {match.court}</span>}
                            </div>
                          )}

                          {/* Player 1 Row */}
                          <div className={`px-4 py-3 pl-6 flex justify-between items-center border-b border-white/5 ${match.winner === match.player1 && match.winner !== 'TBD' ? 'bg-white/5' : ''}`}>
                            <span className={`font-medium ${match.winner === match.player1 && match.winner !== 'TBD' ? 'text-white font-bold' : 'text-gray-300'}`}>
                              {match.player1 || 'TBD'}
                            </span>
                            {match.score && match.winner === match.player1 && (
                              <span className="text-[#D4AF37] text-xs font-bold bg-[#D4AF37]/10 px-2.5 py-1 rounded tracking-wide border border-[#D4AF37]/20">
                                {match.score}
                              </span>
                            )}
                          </div>

                          {/* Player 2 Row */}
                          <div className={`px-4 py-3 pl-6 flex justify-between items-center ${match.winner === match.player2 && match.winner !== 'TBD' ? 'bg-white/5' : ''}`}>
                            <span className={`font-medium ${match.winner === match.player2 && match.winner !== 'TBD' ? 'text-white font-bold' : 'text-gray-300'}`}>
                              {match.player2 || 'TBD'}
                            </span>
                            {match.score && match.winner === match.player2 && (
                              <span className="text-[#D4AF37] text-xs font-bold bg-[#D4AF37]/10 px-2.5 py-1 rounded tracking-wide border border-[#D4AF37]/20">
                                {match.score}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-32 bg-[#1a1a1a] border border-white/10 rounded-lg">
              <span className="text-[#D4AF37] text-4xl block mb-4">⚙️</span>
              <h3 className="text-xl font-black uppercase tracking-widest mb-2">Bracket Pending</h3>
              <p className="text-gray-500 font-medium">The official draw for this tournament has not been generated yet.</p>
            </div>
          )}
        </div>
        
      </div>
    </main>
  );
}