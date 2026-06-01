'use server';

import { createClient } from 'next-sanity';

function getServerClient() {
  return createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    apiVersion: '2024-05-28',
    useCdn: false,
    token: process.env.SANITY_WRITE_TOKEN 
  });
}

export async function saveDrawToDatabase(tournamentId: string, matches: any[]) {
  const serverClient = getServerClient();
  try {
    await serverClient.patch(tournamentId).set({ draws: matches }).commit();
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// UPGRADED: Now accepts a full data payload (Date, Time, Court, Score, Winner)
export async function updateMatchDetailsAndAdvance(
  tournamentId: string, 
  currentMatches: any[], 
  matchKey: string, 
  matchData: { score: string, winner: string, date: string, time: string, court: string }
) {
  const serverClient = getServerClient();

  try {
    const updatedMatches = [...currentMatches];
    const matchIndex = updatedMatches.findIndex(m => m._key === matchKey);
    
    if (matchIndex === -1) return { success: false, error: "Match not found." };
    
    // 1. Inject all new scheduling and result data
    updatedMatches[matchIndex].score = matchData.score;
    updatedMatches[matchIndex].winner = matchData.winner;
    updatedMatches[matchIndex].date = matchData.date;
    updatedMatches[matchIndex].time = matchData.time;
    updatedMatches[matchIndex].court = matchData.court;

    const currentMatchNum = updatedMatches[matchIndex].matchNumber;
    
    // 2. Auto-Advancement logic for knockout progression
    const firstRoundName = updatedMatches[0].round;
    const totalFirstRoundMatches = updatedMatches.filter(m => m.round === firstRoundName).length;
    
    if (currentMatches.length > totalFirstRoundMatches) {
      const nextMatchNum = totalFirstRoundMatches + Math.ceil(currentMatchNum / 2);
      const nextMatchIndex = updatedMatches.findIndex(m => m.matchNumber === nextMatchNum);
      
      if (nextMatchIndex !== -1) {
        if (currentMatchNum % 2 !== 0) {
          updatedMatches[nextMatchIndex].player1 = matchData.winner;
        } else {
          updatedMatches[nextMatchIndex].player2 = matchData.winner;
        }
      }
    }

    await serverClient.patch(tournamentId).set({ draws: updatedMatches }).commit();
    return { success: true, updatedMatches };
    
  } catch (error: any) {
    console.error("Data Update Error:", error);
    return { success: false, error: error.message };
  }
}