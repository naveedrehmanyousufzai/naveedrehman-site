import { createClient } from 'next-sanity';
import Link from 'next/link';

export const revalidate = 0;

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-05-28',
  useCdn: false,
});

export default async function TournamentDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const tournament = await client.fetch(`
    *[_type == "tournament" && slug.current == $slug][0]{
      ...,
      "galleryUrls": finalDayPics[].asset->url,
      playerList,
      draws
    }
  `, { slug });

  if (!tournament) {
    return (
      <div className="min-h-screen bg-[#111111] flex flex-col items-center justify-center pt-20">
        <h1 className="text-white text-2xl font-bold mb-4">Tournament not found.</h1>
        <Link href="/tournaments" className="text-[#D4AF37] hover:text-white transition-colors uppercase tracking-widest text-sm font-bold">
          ← Back to Schedule
        </Link>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC'
    });
  };

  const hasOfficials = tournament.tournamentSecretary || 
                       tournament.tournamentReferee || 
                       (tournament.otherReferees && tournament.otherReferees.length > 0) || 
                       tournament.officials;

  // Supports both Knockout progression and Round Robin Pools
  const allRounds = ['Pool A', 'Pool B', 'Pool C', 'Pool D', 'Round of 64', 'Round of 32', 'Round of 16', 'Quarter-Final', 'Semi-Final', 'Final'];

  return (
    <main className="min-h-screen bg-[#111111] text-white pt-32 pb-20 px-6 md:px-12">
      <div className="max-w-[1400px] mx-auto">
        
        {/* Header Section */}
        <Link href="/tournaments" className="text-gray-400 hover:text-[#D4AF37] text-sm font-bold uppercase tracking-widest mb-8 inline-block transition-colors">
          ← Back to Schedule
        </Link>
        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-[#D4AF37] mb-6 drop-shadow-lg">
          {tournament.title}
        </h1>
        <div className="flex flex-wrap gap-6 text-gray-300 font-medium border-b border-white/10 pb-8 mb-12">
          <span>📅 {formatDate(tournament.startDate)} {tournament.endDate && `– ${formatDate(tournament.endDate)}`}</span>
          {tournament.location && <span>📍 {tournament.location}</span>}
          {tournament.subtitle && <span className="text-gray-500">| {tournament.subtitle}</span>}
        </div>

        {/* --- TOURNAMENT DRAW & BRACKET SECTION --- */}
        <div className="mb-20">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4 border-b border-white/10 pb-4">
            <h3 className="text-3xl font-black uppercase tracking-widest border-l-4 border-[#D4AF37] pl-4">Tournament Draw</h3>
            {/* The insecure generator controls have been permanently removed from the public frontend */}
          </div>

          {!tournament.draws || tournament.draws.length === 0 ? (
            <div className="bg-[#1a1a1a] border border-dashed border-white/20 rounded-xl p-12 text-center">
              <p className="text-gray-500 font-medium">Draw has not been published yet.</p>
            </div>
          ) : (
            <div className="bg-[#0a0a0a] border border-white/10 rounded-xl p-6 overflow-x-auto shadow-2xl">
              <div className="min-w-max flex gap-12">
                
                {/* Dynamically Map the Correct Columns */}
                {allRounds.map((roundName) => {
                  const matchesInRound = tournament.draws.filter((m: any) => m.round === roundName);
                  if (matchesInRound.length === 0) return null;

                  return (
                    <div key={roundName} className="flex flex-col gap-6 justify-around min-w-[280px]">
                      <div className="text-center text-[#D4AF37] font-black uppercase tracking-widest text-sm mb-4 bg-white/5 py-2 rounded">
                        {roundName}
                      </div>
                      
                      {matchesInRound.map((match: any, idx: number) => (
                        <div key={idx} className="flex flex-col bg-[#1a1a1a] border border-white/10 rounded-lg overflow-hidden shadow-lg hover:border-[#D4AF37]/50 transition-colors relative">
                          <div className="absolute top-1/2 -translate-y-1/2 -left-3 bg-[#D4AF37] text-black text-[10px] font-black w-6 h-6 flex items-center justify-center rounded-full border-2 border-[#1a1a1a] z-10">
                            {match.matchNumber || '-'}
                          </div>
                          <div className={`px-5 py-3 flex justify-between items-center border-b border-white/5 ${match.winner === match.player1 ? 'bg-white/5' : ''}`}>
                            <span className={`font-medium ${match.winner === match.player1 ? 'text-white' : 'text-gray-400'}`}>
                              {match.player1 || 'TBD'}
                            </span>
                            {match.score && match.winner === match.player1 && (
                              <span className="text-[#D4AF37] text-xs font-bold bg-[#D4AF37]/10 px-2 py-1 rounded">{match.score}</span>
                            )}
                          </div>
                          <div className={`px-5 py-3 flex justify-between items-center ${match.winner === match.player2 ? 'bg-white/5' : ''}`}>
                            <span className={`font-medium ${match.winner === match.player2 ? 'text-white' : 'text-gray-400'}`}>
                              {match.player2 || 'TBD'}
                            </span>
                            {match.score && match.winner === match.player2 && (
                              <span className="text-[#D4AF37] text-xs font-bold bg-[#D4AF37]/10 px-2 py-1 rounded">{match.score}</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })}

              </div>
            </div>
          )}
        </div>

        {/* --- PLAYER LIST (ENTRIES) SECTION --- */}
        {tournament.playerList && tournament.playerList.length > 0 && (
          <div className="mb-16">
            <h3 className="text-2xl font-black uppercase tracking-widest border-l-4 border-[#D4AF37] pl-4 mb-6">Registered Players</h3>
            <div className="bg-[#1a1a1a] border border-white/5 rounded-lg overflow-hidden shadow-lg">
              <table className="w-full text-left text-sm font-medium">
                <thead className="bg-black/50 text-[#D4AF37] uppercase tracking-wider text-xs">
                  <tr>
                    <th className="px-6 py-4">Seed</th>
                    <th className="px-6 py-4">Player Name</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4 text-right">Region / Club</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-gray-300">
                  {tournament.playerList
                    .sort((a: any, b: any) => (a.seed || 999) - (b.seed || 999))
                    .map((player: any, idx: number) => (
                    <tr key={idx} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 font-bold text-white">
                        {player.seed ? `[${player.seed}]` : '-'}
                      </td>
                      <td className="px-6 py-4">{player.playerName}</td>
                      <td className="px-6 py-4 text-gray-500">{player.category}</td>
                      <td className="px-6 py-4 text-right">{player.region}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* --- MATCH REPORT SECTION --- */}
        {tournament.article && (
          <div className="mb-16">
            <h3 className="text-2xl font-black uppercase tracking-widest border-l-4 border-[#D4AF37] pl-4 mb-6">Tournament Report</h3>
            <p className="whitespace-pre-wrap text-gray-300 leading-relaxed font-light text-lg">
              {tournament.article}
            </p>
          </div>
        )}

        {/* --- CATEGORY WINNERS SECTION --- */}
        {tournament.winners && tournament.winners.length > 0 && (
          <div className="mb-16">
            <h3 className="text-2xl font-black uppercase tracking-widest border-l-4 border-[#D4AF37] pl-4 mb-6">Category Winners</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {tournament.winners.map((win: any, idx: number) => (
                <div key={idx} className="bg-[#1a1a1a] p-6 border border-white/5 rounded-lg hover:border-[#D4AF37]/30 transition-colors">
                  <div className="text-[#D4AF37] font-black uppercase tracking-wide text-lg mb-3">{win.category}</div>
                  <div className="text-white font-bold text-xl mb-1">🏆 {win.winner}</div>
                  {win.runnerUp && <div className="text-gray-400 font-medium mt-2 pt-2 border-t border-white/5">🥈 Runner Up: {win.runnerUp}</div>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- ADVANCED OFFICIALS SECTION --- */}
        {hasOfficials && (
          <div className="mb-16">
            <h3 className="text-2xl font-black uppercase tracking-widest border-l-4 border-[#D4AF37] pl-4 mb-6">Tournament Officials</h3>
            <div className="bg-[#1a1a1a] p-8 border border-white/5 rounded-lg grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 shadow-lg">
              {tournament.tournamentSecretary && (
                <div>
                  <h4 className="text-[#D4AF37] font-black uppercase tracking-widest text-sm mb-3">Tournament Secretary</h4>
                  <p className="text-gray-300 font-medium">{tournament.tournamentSecretary}</p>
                </div>
              )}
              {tournament.tournamentReferee && (
                <div>
                  <h4 className="text-[#D4AF37] font-black uppercase tracking-widest text-sm mb-3">Tournament Referee</h4>
                  <p className="text-gray-300 font-medium">{tournament.tournamentReferee}</p>
                </div>
              )}
              {tournament.otherReferees && tournament.otherReferees.length > 0 && (
                <div>
                  <h4 className="text-[#D4AF37] font-black uppercase tracking-widest text-sm mb-3">Referees</h4>
                  <ul className="text-gray-300 font-medium flex flex-col gap-1">
                    {tournament.otherReferees.map((ref: string, idx: number) => (
                      <li key={idx}>• {ref}</li>
                    ))}
                  </ul>
                </div>
              )}
              {tournament.officials && Array.isArray(tournament.officials) && tournament.officials.length > 0 && (
                <>
                  {tournament.officials.map((official: any, idx: number) => (
                    <div key={`official-${idx}`}>
                      <h4 className="text-[#D4AF37] font-black uppercase tracking-widest text-sm mb-3">{official.role || 'Official'}</h4>
                      <p className="text-gray-300 font-medium">{official.name}</p>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        )}

        {/* --- IMAGE GALLERY SECTION --- */}
        {tournament.galleryUrls && tournament.galleryUrls.length > 0 && (
          <div>
            <h3 className="text-2xl font-black uppercase tracking-widest border-l-4 border-[#D4AF37] pl-4 mb-6">Event Gallery</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {tournament.galleryUrls.map((url: string, idx: number) => (
                <div key={idx} className="aspect-square bg-black border border-white/10 rounded-lg overflow-hidden relative group">
                  <img src={url} alt={`Gallery image ${idx + 1}`} className="w-full h-full object-cover group-hover:scale-110 group-hover:opacity-80 transition-all duration-500" />
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </main>
  );
}