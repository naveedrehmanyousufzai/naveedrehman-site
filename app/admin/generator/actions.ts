'use server';

import { createClient } from 'next-sanity';

export async function saveDrawToDatabase(tournamentId: string, matches: any[]) {
  // 1. We log this to your VS Code terminal to PROVE the token is loading
  console.log("SERVER ACTION: Is the write token loaded?", !!process.env.SANITY_WRITE_TOKEN);

  // 2. We initialize the client INSIDE the function to bypass stale Next.js cache
  const serverClient = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    apiVersion: '2024-05-28',
    useCdn: false,
    token: process.env.SANITY_WRITE_TOKEN 
  });

  try {
    await serverClient
      .patch(tournamentId)
      .set({ draws: matches })
      .commit();
    return { success: true };
  } catch (error: any) {
    console.error("Sanity Write Error:", error);
    return { success: false, error: error.message };
  }
}