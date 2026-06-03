import Link from 'next/link';

export const metadata = {
  title: 'Career Archive | Naveed Rehman',
};

export default function TournamentsPage() {
  // Your pre-filled tournament data
  const tournaments = [
    {
      id: 1,
      title: "Sindh Squash Challenger 1",
      date: "August 26 - 30, 2026",
      type: "Upcoming Event",
      location: "Karachi, Pakistan",
      status: "Scheduled"
    },
    {
      id: 2,
      title: "2nd Public School Hyderabad National Junior & PSA Satellite",
      date: "May 1 - 5, 2026",
      type: "PSA Satellite",
      location: "Hyderabad, Pakistan",
      status: "Completed"
    },
    {
      id: 3,
      title: "4th Sindh Ramadan Team Championship 2026",
      date: "March 2026",
      type: "Team Championship",
      location: "Venus JK Squash Academy",
      status: "Completed"
    }
  ];

  return (
    <main className="min-h-screen bg-white text-black selection:bg-[#D4AF37] selection:text-white pb-20">
      
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
            <div key={tourney.id} className="group bg-white border-2 border-gray-100 rounded-lg p-6 md:p-8 hover:border-[#D4AF37] transition-all duration-300 shadow-sm hover:shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              
              {/* Event Details */}
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
              
              {/* Status Badge */}
              <div className="shrink-0 mt-4 md:mt-0">
                <span className={`text-xs font-black uppercase tracking-widest px-4 py-2 rounded-full border-2 ${
                  tourney.status === 'Scheduled' 
                    ? 'bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/30' 
                    : 'bg-gray-50 text-gray-400 border-gray-100'
                }`}>
                  {tourney.status}
                </span>
              </div>

            </div>
          ))}
        </div>
      </section>

    </main>
  );
}