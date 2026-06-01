'use client';

import { useState, useEffect } from 'react';
import { createClient } from 'next-sanity';
import { saveDrawToDatabase, updateMatchDetailsAndAdvance } from './actions';

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-05-28',
  useCdn: false,
});

export default function SecureGeneratorPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [tournaments, setTournaments] = useState<any[]>([]);
  const [selectedTournament, setSelectedTournament] = useState('');
  const [drawSize, setDrawSize] = useState('16');
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const [activeMatches, setActiveMatches] = useState<any[]>([]);
  const [updatingKey, setUpdatingKey] = useState<string | null>(null);

  const MASTER_PASSWORD = 'squashadmin2026';

  useEffect(() => {
    async function loadTournaments() {
      const data = await client.fetch(`*[_type == "tournament"] | order(startDate desc) { _id, title }`);
      setTournaments(data);
    }
    loadTournaments();
  }, []);

  useEffect(() => {
    if (!selectedTournament) { setActiveMatches([]); return; }
    async function fetchCurrentDraw() {
      const data = await client.fetch(`*[_type == "tournament" && _id == $id][0]{ draws }`, { id: selectedTournament });
      if (data && data.draws) setActiveMatches(data.draws);
      else setActiveMatches([]);
    }
    fetchCurrentDraw();
  }, [selectedTournament, status]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === MASTER_PASSWORD) setIsAuthenticated(true);
    else alert('Incorrect Password.');
  };

  // UPGRADED: Gathers all scheduling data and sends it to the engine
  const handleUpdateMatch = async (matchKey: string) => {
    const dateVal = (document.getElementById(`date-${matchKey}`) as HTMLInputElement).value;
    const timeVal = (document.getElementById(`time-${matchKey}`) as HTMLInputElement).value;
    const courtVal = (document.getElementById(`court-${matchKey}`) as HTMLInputElement).value;
    const scoreVal = (document.getElementById(`score-${matchKey}`) as HTMLInputElement).value;
    const winnerVal = (document.getElementById(`winner-${matchKey}`) as HTMLSelectElement).value;

    const matchData = { date: dateVal, time: timeVal, court: courtVal, score: scoreVal, winner: winnerVal };

    setUpdatingKey(matchKey);
    const res = await updateMatchDetailsAndAdvance(selectedTournament, activeMatches, matchKey, matchData);
    
    if (res.success && res.updatedMatches) {
      setActiveMatches(res.updatedMatches);
      setStatus(`Match #${matchKey} scheduled/scored successfully.`);
    } else {
      alert("Database Synchronization Failure: " + res.error);
    }
    setUpdatingKey(null);
  };

  const generateBracket = async () => {
    if (!selectedTournament) { setStatus('Please select a tournament.'); return; }
    setIsLoading(true);
    setStatus('Fetching player configurations...');

    try {
      const tournament = await client.fetch(`*[_type == "tournament" && _id == $id][0]`, { id: selectedTournament });
      if (!tournament.playerList || tournament.playerList.length === 0) {
        setStatus('Error: Player configuration registry is blank.');
        setIsLoading(false);
        return;
      }

      setStatus('Executing Seeding Distribution Grid...');
      const players = [...tournament.playerList].sort((a, b) => (a.seed || 999) - (b.seed || 999));
      let matches = [];

      // Unified base match object with empty schedule fields
      const createMatchObj = (matchNum: number, roundName: string, p1: string, p2: string) => ({
        _key: `match-${matchNum}`,
        round: roundName,
        matchNumber: matchNum,
        player1: p1,
        player2: p2,
        score: '', winner: '', date: '', time: '', court: ''
      });

      if (drawSize === 'rr') {
        const numPools = players.length <= 8 ? 2 : 4;
        const poolNames = ['Pool A', 'Pool B', 'Pool C', 'Pool D'];
        const pools = Array.from({ length: numPools }, () => [] as any[]);

        players.forEach((p, i) => {
           const rev = Math.floor(i / numPools) % 2 !== 0;
           const poolIndex = rev ? (numPools - 1) - (i % numPools) : (i % numPools);
           pools[poolIndex].push(p);
        });

        let matchNumber = 1;
        pools.forEach((pool, pIdx) => {
           for(let i=0; i<pool.length; i++){
              for(let j=i+1; j<pool.length; j++){
                 const p1Str = pool[i].seed ? `[${pool[i].seed}] ${pool[i].playerName}` : pool[i].playerName;
                 const p2Str = pool[j].seed ? `[${pool[j].seed}] ${pool[j].playerName}` : pool[j].playerName;
                 matches.push(createMatchObj(matchNumber, poolNames[pIdx], p1Str, p2Str));
                 matchNumber++;
              }
           }
        });
      } else {
        const totalMatches = parseInt(drawSize);
        const lines = Array(totalMatches).fill(null);
        const seededPlayers = players.filter(p => p.seed);
        const shuffleArray = (arr: any[]) => {
            const newArr = [...arr];
            for (let i = newArr.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
            }
            return newArr;
        };

        const getPlayersBySeed = (min: number, max: number) => seededPlayers.filter(p => p.seed >= min && p.seed <= max);
        const slots: any = {
          8: { s1: [0], s2: [7], s3_4: [3, 4] },
          16: { s1: [0], s2: [15], s3_4: [7, 8], s5_8: [3, 4, 11, 12] },
          32: { s1: [0], s2: [31], s3_4: [15, 16], s5_8: [7, 8, 23, 24], s9_16: [3, 4, 11, 12, 19, 20, 27, 28] },
          64: { s1: [0], s2: [63], s3_4: [31, 32], s5_8: [15, 16, 47, 48], s9_16: [7, 8, 23, 24, 39, 40, 55, 56], s17_32: [3, 4, 11, 12, 19, 20, 27, 28, 35, 36, 43, 44, 51, 52, 59, 60] }
        };

        const targetSlots = slots[totalMatches];
        if (targetSlots.s1) { const p = getPlayersBySeed(1, 1)[0]; if(p) lines[targetSlots.s1[0]] = p; }
        if (targetSlots.s2) { const p = getPlayersBySeed(2, 2)[0]; if(p) lines[targetSlots.s2[0]] = p; }
        if (targetSlots.s3_4) {
            const p34 = shuffleArray(getPlayersBySeed(3, 4));
            targetSlots.s3_4.forEach((slot: number, i: number) => { if(p34[i]) lines[slot] = p34[i]; });
        }
        if (targetSlots.s5_8) {
            const p58 = shuffleArray(getPlayersBySeed(5, 8));
            targetSlots.s5_8.forEach((slot: number, i: number) => { if(p58[i]) lines[slot] = p58[i]; });
        }
        if (targetSlots.s9_16) {
            const p916 = shuffleArray(getPlayersBySeed(9, 16));
            targetSlots.s9_16.forEach((slot: number, i: number) => { if(p916[i]) lines[slot] = p916[i]; });
        }

        const placedPlayers = lines.filter(p => p !== null);
        let remainingPlayers = players.filter(p => !placedPlayers.includes(p));
        remainingPlayers = shuffleArray(remainingPlayers);

        for (let i = 0; i < lines.length; i++) {
            if (lines[i] === null && remainingPlayers.length > 0) lines[i] = remainingPlayers.shift();
        }

        let matchNumber = 1;
        const firstRoundName = totalMatches === 8 ? 'Quarter-Final' : `Round of ${totalMatches}`;
        
        for (let i = 0; i < totalMatches; i += 2) {
            const p1 = lines[i] ? (lines[i].seed ? `[${lines[i].seed}] ${lines[i].playerName}` : lines[i].playerName) : 'BYE';
            const p2 = lines[i+1] ? (lines[i+1].seed ? `[${lines[i+1].seed}] ${lines[i+1].playerName}` : lines[i+1].playerName) : 'BYE';
            matches.push(createMatchObj(matchNumber, firstRoundName, p1, p2));
            matchNumber++;
        }

        const numRounds = Math.log2(totalMatches);
        for (let r = 1; r < numRounds; r++) {
            const roundSize = totalMatches / Math.pow(2, r + 1);
            let currentRoundName = '';
            if (roundSize === 4) currentRoundName = 'Quarter-Final';
            else if (roundSize === 2) currentRoundName = 'Semi-Final';
            else if (roundSize === 1) currentRoundName = 'Final';
            else currentRoundName = `Round of ${roundSize * 2}`;

            for (let i = 0; i < roundSize; i++) {
              matches.push(createMatchObj(matchNumber, currentRoundName, 'TBD', 'TBD'));
              matchNumber++;
            }
        }
      }

      setStatus('Saving configurations to server secure core...');
      const response = await saveDrawToDatabase(selectedTournament, matches);
      if (response.success) setStatus('Success! Official bracket has been published.');
      else setStatus(`Database Error: ${response.error}`);
    } catch (error) {
      console.error(error);
      setStatus('An error occurred while generating the bracket.');
    }
    setIsLoading(false);
  };

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-[#111111] flex flex-col items-center justify-center p-6 text-white">
        <div className="bg-[#1a1a1a] p-10 rounded-lg shadow-2xl border border-[#D4AF37]/30 max-w-md w-full">
          <div className="text-center mb-8">
            <span className="text-[#D4AF37] font-black uppercase tracking-widest text-sm block mb-2">Restricted Area</span>
            <h1 className="text-3xl font-black uppercase tracking-tight">Draw Engine Login</h1>
          </div>
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <input type="password" placeholder="Enter Master Password" value={password} onChange={(e) => setPassword(e.target.value)} className="bg-black border border-white/20 text-white p-4 rounded outline-none focus:border-[#D4AF37]" />
            <button type="submit" className="bg-[#D4AF37] text-black font-bold uppercase tracking-widest p-4 rounded hover:bg-white transition-colors">Access Engine</button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#111111] text-white pt-32 pb-20 px-6 md:px-12">
      <div className="max-w-3xl mx-auto bg-[#1a1a1a] border border-[#D4AF37]/50 rounded-lg p-10 shadow-2xl">
        <div className="flex justify-between items-start border-b border-white/10 pb-6 mb-8">
          <div>
            <span className="text-[#D4AF37] font-black uppercase tracking-widest text-sm block mb-1">Authenticated</span>
            <h1 className="text-3xl font-black uppercase tracking-tighter">WSF Draw Generator</h1>
          </div>
          <button onClick={() => setIsAuthenticated(false)} className="text-gray-500 hover:text-white text-sm font-bold uppercase tracking-widest transition-colors">Lock System</button>
        </div>

        <div className="flex flex-col gap-8">
          <div>
            <label className="text-[#D4AF37] font-bold uppercase tracking-wider text-xs block mb-3">1. Select Tournament</label>
            <select value={selectedTournament} onChange={(e) => setSelectedTournament(e.target.value)} className="w-full bg-black border border-white/20 text-white p-4 rounded outline-none focus:border-[#D4AF37]">
              <option value="">-- Choose a Tournament --</option>
              {tournaments.map((t) => (<option key={t._id} value={t._id}>{t.title}</option>))}
            </select>
          </div>

          <div>
            <label className="text-[#D4AF37] font-bold uppercase tracking-wider text-xs block mb-3">2. Select Draw Format</label>
            <select value={drawSize} onChange={(e) => setDrawSize(e.target.value)} className="w-full bg-black border border-white/20 text-white p-4 rounded outline-none focus:border-[#D4AF37]">
              <option value="8">8-Player Bracket</option>
              <option value="16">16-Player Bracket</option>
              <option value="32">32-Player Bracket</option>
              <option value="64">64-Player Bracket</option>
              <option value="rr">Round Robin (Serpentine)</option>
            </select>
          </div>

          {status && (<div className="p-4 rounded border font-medium bg-blue-500/10 border-blue-500/50 text-blue-400">{status}</div>)}

          <button onClick={generateBracket} disabled={isLoading || !selectedTournament} className={`w-full font-black uppercase tracking-widest p-5 rounded transition-all duration-300 ${isLoading || !selectedTournament ? 'bg-gray-800 text-gray-500 cursor-not-allowed' : 'bg-[#D4AF37] text-black hover:bg-white hover:shadow-[0_0_20px_rgba(212,175,55,0.4)]'}`}>
            {isLoading ? 'Generating Bracket...' : 'Execute Draw Automation'}
          </button>
        </div>
      </div>

      {/* EXPANDED LIVE SCHEDULER & DASHBOARD */}
      {selectedTournament && activeMatches.length > 0 && (
        <div className="max-w-[1000px] mx-auto bg-[#1a1a1a] border border-[#D4AF37]/30 rounded-lg p-10 shadow-2xl mt-8">
          <div className="border-b border-white/10 pb-4 mb-6">
            <span className="text-[#D4AF37] font-black uppercase tracking-widest text-xs block mb-1">Live Interface</span>
            <h2 className="text-2xl font-black uppercase tracking-tight">Master Schedule & Scoreboard</h2>
          </div>

          <div className="flex flex-col gap-6 max-h-[800px] overflow-y-auto pr-2">
            {activeMatches.map((match) => {
              if (match.player1 === 'TBD' && match.player2 === 'TBD') return null;

              return (
                <div key={match._key} className="bg-black border border-white/10 rounded-lg p-5 shadow-lg">
                  
                  {/* Header: Match Info & Players */}
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 pb-4 border-b border-white/5">
                    <span className="text-[#D4AF37] font-black uppercase text-[11px] tracking-widest mb-2 md:mb-0">
                      {match.round} | Match #{match.matchNumber}
                    </span>
                    <div className="text-lg font-bold">
                      <span className={match.winner === match.player1 ? "text-white" : "text-gray-400"}>{match.player1}</span>
                      <span className="text-gray-600 mx-3 text-sm font-normal italic">vs</span>
                      <span className={match.winner === match.player2 ? "text-white" : "text-gray-400"}>{match.player2}</span>
                    </div>
                  </div>

                  {/* Input Grid: Scheduling & Scoring */}
                  <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                    <input type="date" id={`date-${match._key}`} defaultValue={match.date || ''} className="bg-[#111] border border-white/10 text-gray-400 p-2.5 rounded text-xs outline-none focus:border-[#D4AF37] focus:text-white" />
                    <input type="time" id={`time-${match._key}`} defaultValue={match.time || ''} className="bg-[#111] border border-white/10 text-gray-400 p-2.5 rounded text-xs outline-none focus:border-[#D4AF37] focus:text-white" />
                    <input type="text" id={`court-${match._key}`} placeholder="Court (e.g., Court 1)" defaultValue={match.court || ''} className="bg-[#111] border border-white/10 text-white p-2.5 rounded text-xs outline-none focus:border-[#D4AF37]" />
                    <input type="text" id={`score-${match._key}`} placeholder="Score (11-5, 11-7)" defaultValue={match.score || ''} className="bg-[#111] border border-white/10 text-white p-2.5 rounded text-xs outline-none focus:border-[#D4AF37]" />
                    
                    <select id={`winner-${match._key}`} defaultValue={match.winner || ''} className="bg-[#111] border border-white/10 text-[#D4AF37] font-bold p-2.5 rounded text-xs outline-none focus:border-[#D4AF37]">
                      <option value="">-- No Winner Yet --</option>
                      <option value={match.player1}>{match.player1}</option>
                      <option value={match.player2}>{match.player2}</option>
                    </select>

                    <button disabled={updatingKey === match._key} onClick={() => handleUpdateMatch(match._key)} className="bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/50 hover:bg-[#D4AF37] hover:text-black font-black uppercase tracking-wider text-[10px] p-2.5 rounded transition-colors w-full">
                      {updatingKey === match._key ? 'Saving...' : 'Save Match'}
                    </button>
                  </div>
                  
                </div>
              );
            })}
          </div>
        </div>
      )}
    </main>
  );
}