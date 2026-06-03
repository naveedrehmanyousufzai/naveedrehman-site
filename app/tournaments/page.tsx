"use client";

import { useState } from 'react';

// Define the structure of our tournament data
type Tournament = {
  id: number;
  title: string;
  date: string;
  type: string;
  location: string;
  status: string;
  lastOpponent: string;
  finalStanding: string;
  draws: string;
  gallery: string[];
};

export default function TournamentsPage() {
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);

  // Expanded tournament data including your requested detailed fields
  const tournaments: Tournament[] = [
    {
      id: 1,
      title: "Sindh Squash Challenger 1",
      date: "August 26 - 30, 2026",
      type: "Upcoming Event",
      location: "Karachi, Pakistan",
      status: "Scheduled",
      lastOpponent: "TBD",
      finalStanding: "Draw Pending",
      draws: "Official draws and seeding will be published by the Sindh Squash Association on August 20th, 2026.",
      gallery: []
    },
    {
      id: 2,
      title: "2nd Public School Hyderabad National Junior & PSA Satellite",
      date: "May 1 - 5, 2026",
      type: "PSA Satellite",
      location: "Hyderabad, Pakistan",
      status: "Completed",
      lastOpponent: "Ali Hassan",
      finalStanding: "Quarter-Finalist",
      draws: "Round 1: Won (3-0) vs M. Tariq\nRound 2: Won (3-1) vs Z. Khan\nQuarter-Finals: Lost (1-3) vs Ali Hassan",
      gallery: ["/placeholder.jpg", "/placeholder.jpg"] 
    },
    {
      id: 3,
      title: "4th Sindh Ramadan Team Championship 2026",
      date: "March 2026",
      type: "Team Championship",
      location: "Venus JK Squash Academy",
      status: "Completed",
      lastOpponent: "Team K-Electric",
      finalStanding: "Runners-Up",
      draws: "Group Stages: Undefeated (3-0)\nSemi-Finals: Won (2-1) vs Navy\nFinals: Lost (1-2) vs Team K-Electric",
      gallery: ["/placeholder.jpg"]
    }
  ];

  // Function to trigger the browser's print dialog
  const handlePrint = () => {
    window.print();
  };

  return (
    <main className="min-h-screen bg-white text-black selection:bg-[#D4AF37] selection:text-white pb-20">
      
      {/* 
        PRINT SPECIFIC CSS: 
        This specifically tells the browser that when printing, it should hide EVERYTHING on the screen 
        except the specific modal box we want on the paper. 
      */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body * { visibility: hidden; }
          #printable-dossier, #printable-dossier * { visibility: visible; }
          #printable-dossier { 
            position: absolute; 
            left: 0; 
            top: 0; 
            width: 100%; 
            box-shadow: none;
            border: none;
          }
          /* Hide the print/close buttons on the actual printed paper */
          .no-print { display: none !important; }
        }
      `}} />

      {/* Page Header */}
      <section className="pt-32 pb-12 px-6 md:px-12 max-w-7xl mx-auto border-b-2 border-[#D4AF37]/20">
        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter drop-shadow-sm text-black">
          Career <span className="text-[#D4AF37]">Archive</span>
        </h1>
        <p className="mt-4 text-gray-600 text-lg max-w-2xl font-medium">
          Official tournament history, upcoming draws, and match records on the professional circuit.
        </p>
      </section>

      {/* The Tournaments List */}
      <section className="pt-12 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="flex flex-col gap-6">
          {tournaments.map((tourney) => (
            <div 
              key={tourney.id} 
              onClick={() => setSelectedTournament(tourney)}
              className="cursor-pointer group bg-white border-2 border-gray-100 rounded-lg p-6 md:p-8 hover:border-[#D4AF37] transition-all duration-300 shadow-sm hover:shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded mb-4 inline-block border border-[#D4AF37]/30 bg-[#D4AF37]/5 text-[#D4AF37]">
                  {tourney.type}
                </span>
                <h3 className="text-xl md:text-2xl font-black text-black mb-2 group-hover:text-[#D4AF37] transition-colors">
                  {tourney.title}
                </h3>
                <div className="flex flex-wrap items-center gap-3 md:gap-4 text-xs md:text-sm font-bold uppercase tracking-widest text-gray-500">
                  <span>{tourney.date}</span>
                  <span className="hidden md:block w-1 h-1 bg-[#D4AF37] rounded-full"></span>
                  <span>{tourney.location}</span>
                </div>
              </div>
              
              <div className="shrink-0 mt-4 md:mt-0 flex items-center gap-4">
                <span className={`text-xs font-black uppercase tracking-widest px-4 py-2 rounded-full border-2 ${
                  tourney.status === 'Scheduled' 
                    ? 'bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/30' 
                    : 'bg-gray-50 text-gray-400 border-gray-100'
                }`}>
                  {tourney.status}
                </span>
                <span className="text-[#D4AF37] font-bold text-xl group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* POP-UP MODAL (Printable Dossier) */}
      {selectedTournament && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 md:p-6 overflow-y-auto">
          
          <div 
            id="printable-dossier" 
            className="bg-white w-full max-w-4xl rounded-xl shadow-2xl relative my-auto border-2 border-[#D4AF37]/50"
          >
            {/* Modal Actions (Hidden when printing) */}
            <div className="no-print absolute top-4 right-4 flex items-center gap-3">
              <button 
                onClick={handlePrint}
                className="bg-gray-100 hover:bg-[#D4AF37] hover:text-white text-gray-600 p-2 rounded transition-colors"
                title="Print A4 Format"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
              </button>
              <button 
                onClick={() => setSelectedTournament(null)}
                className="bg-gray-100 hover:bg-red-500 hover:text-white text-gray-600 p-2 rounded transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {/* Printable Content Structure */}
            <div className="p-8 md:p-12">
              
              {/* Header */}
              <div className="border-b-2 border-[#D4AF37]/30 pb-6 mb-8 text-center md:text-left">
                <p className="text-[#D4AF37] font-black uppercase tracking-widest text-xs mb-2">
                  Official Tournament Record
                </p>
                <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-black mb-2">
                  {selectedTournament.title}
                </h2>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm font-bold uppercase tracking-widest text-gray-500">
                  <span>{selectedTournament.date}</span>
                  <span className="w-1 h-1 bg-[#D4AF37] rounded-full"></span>
                  <span>{selectedTournament.location}</span>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                <div className="bg-gray-50 border-2 border-gray-100 p-6 rounded-lg">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Final Standing</p>
                  <p className="text-2xl font-black text-[#D4AF37]">{selectedTournament.finalStanding}</p>
                </div>
                <div className="bg-gray-50 border-2 border-gray-100 p-6 rounded-lg">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Final Opponent</p>
                  <p className="text-2xl font-black text-black">{selectedTournament.lastOpponent}</p>
                </div>
              </div>

              {/* Draws & Results */}
              <div className="mb-10">
                <h3 className="text-lg font-black uppercase tracking-widest text-black mb-4 border-l-4 border-[#D4AF37] pl-3">
                  Match Draws & Results
                </h3>
                <div className="bg-white border-2 border-gray-100 p-6 rounded-lg whitespace-pre-line font-medium text-gray-600 leading-relaxed">
                  {selectedTournament.draws}
                </div>
              </div>

              {/* Media Gallery */}
              {selectedTournament.gallery && selectedTournament.gallery.length > 0 && (
                <div>
                  <h3 className="text-lg font-black uppercase tracking-widest text-black mb-4 border-l-4 border-[#D4AF37] pl-3">
                    Media Gallery
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {selectedTournament.gallery.map((img, idx) => (
                      <div key={idx} className="aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-100">
                        <img src={img} alt="Tournament action" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Print Footer Watermark */}
              <div className="hidden print:block text-center mt-12 pt-8 border-t-2 border-gray-100 text-xs font-bold uppercase tracking-widest text-gray-400">
                Generated from the Official Platform of Naveed Rehman
              </div>

            </div>
          </div>
        </div>
      )}

    </main>
  );
}