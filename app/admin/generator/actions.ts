'use server';

import { createClient } from 'next-sanity';

// Secure server-side client initialized dynamically inside actions
function getServerClient() {
  return createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    apiVersion: '2024-05-28',
    useCdn: false,
    token: process.env.SANITY_WRITE_TOKEN 
  });
}

// Action 1: Saves a freshly generated bracket layout
export async function saveDrawToDatabase(tournamentId: string, matches: any[]) {
  console.log("SERVER ACTION: Executing fresh draw generation...");
  const serverClient = getServerClient();

  try {
    await serverClient
      .patch(tournamentId)
      .set({ draws: matches })
      .commit();
    return { success: true };
  } catch (error: any) {
    console.error("Sanity Draw Write Error:", error);
    return { success: false, error: error.message };
  }
}

// Action 2: Saves game score and moves winner into the next bracket slot
export async function updateMatchScoreAndAdvance(
  tournamentId: string, 
  currentMatches: any[], 
  matchKey: string, 
  scoreString: string, 
  winnerName: string
) {
  console.log(`SERVER ACTION: Updating score for match ${matchKey}...`);
  const serverClient = getServerClient();

  try {
    const updatedMatches = [...currentMatches];
    const matchIndex = updatedMatches.findIndex(m => m._key === matchKey);
    
    if (matchIndex === -1) return { success: false, error: "Match not found." };
    
    // Log the current match result
    updatedMatches[matchIndex].score = scoreString;
    updatedMatches[matchIndex].winner = winnerName;

    const currentMatchNum = updatedMatches[matchIndex].matchNumber;
    
    // Auto-Advancement logic for knockout progression
    const firstRoundName = updatedMatches[0].round;
    const totalFirstRoundMatches = updatedMatches.filter(m => m.round === firstRoundName).length;
    
    // Only advance if there are future rounds (it's not the final)
    if (currentMatches.length > totalFirstRoundMatches) {
      const nextMatchNum = totalFirstRoundMatches + Math.ceil(currentMatchNum / 2);
      const nextMatchIndex = updatedMatches.findIndex(m => m.matchNumber === nextMatchNum);
      
      if (nextMatchIndex !== -1) {
        // Odd match numbers populate Player 1 slot, Even populate Player 2 slot
        if (currentMatchNum % 2 !== 0) {
          updatedMatches[nextMatchIndex].player1 = winnerName;
        } else {
          updatedMatches[nextMatchIndex].player2 = winnerName;
        }
      }
    }

    await serverClient
      .patch(tournamentId)
      .set({ draws: updatedMatches })
      .commit();

    return { success: true, updatedMatches };
  } catch (error: any) {
    console.error("Score Update Error:", error);
    return { success: false, error: error.message };
  }
}