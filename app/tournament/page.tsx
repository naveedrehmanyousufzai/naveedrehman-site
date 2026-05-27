import Link from "next/link";
import { client } from '@/sanity/lib/client'

// Fetches tournaments and orders them (you can adjust the ordering later)
const query = `*[_type == "tournament"]`

export default async function TournamentPage() {
  const tournaments = await client.fetch(query)

  return (
    <main className="min-h-screen bg-white text-black p-6 sm:p-10 md:p-16 lg:p-24 max-w-[1400px] w-full mx-auto selection:bg-[#D4AF37] selection:text-white font-sans antialiased overflow-hidden">
      
      {/* Navigation Header */}
      <header className="mb-16 md:mb-24 flex flex-col md:flex-row items-center justify-between border-b-2 border-[#D4AF37] pb-8 gap-8 md:gap-0">
        <div>
          <Link href="/">
            <img 
              src="/logo.svg" 
              alt="Naveed Rehman Logo" 
              className="h-16 md:h-24 w-auto cursor-pointer" 
            />
          </Link>
        </div>
        <nav className="flex items-center justify-center gap-8 md:gap-12">
          <Link href="/" className="!text-black text-sm md:text-base font-bold uppercase tracking-widest !no-underline hover:!text-[#D4AF37] transition-colors duration-300">Home</Link>
          <Link href="/tournament" className="!text-[#D4AF37] text-sm md:text-base font-bold uppercase tracking-widest !no-underline border-b-2 border-[#D4AF37] pb-1">Tournament</Link>
          <Link href="/about" className="!text-black text-sm md:text-base font-bold uppercase tracking-widest !no-underline hover:!text-[#D4AF37] transition-colors duration-300">About</Link>
        </nav>
      </header>

      {/* Main Content Area */}
      <div className="w-full max-w-5xl mx-auto">
        
        <div className="text-center mb-16 md:mb-20">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-black uppercase">
            Career <span className="text-[#D4AF37]">Record</span>
          </h1>
          <p className="mt-6 text-lg md:text-xl font-medium text-gray-600 max-w-2xl mx-auto">
            A comprehensive overview of sanctioned matches, provincial championships, and organizational milestones.
          </p>
        </div>

        {/* Tournament Grid */}
        <div className="grid gap-12 w-full">
          {tournaments.length > 0 ? (
            tournaments.map((tournament: any) => (
              <div key={tournament._id} className="border-l-4 border-[#D4AF37] pl-8 py-6 bg-gray-50 pr-8 rounded-r-xl w-full shadow-sm hover:shadow-md transition-shadow duration-300">
                <h2 className="text-3xl md:text-4xl font-bold text-black tracking-wide uppercase">{tournament.title}</h2>
                
                <div className="mt-4 flex flex-wrap gap-x-10 gap-y-3 text-base md:text-lg font-semibold tracking-wider text-gray-700 border-b border-gray-200 pb-4">
                  <p><span className="text-[#D4AF37]">Date:</span> {tournament.dateString}</p>
                  <p><span className="text-[#D4AF37]">Role:</span> {tournament.role}</p>
                  {tournament.category && <p><span className="text-[#D4AF37]">Category:</span> {tournament.category}</p>}
                </div>
                
                {tournament.resultOrDescription && (
                  <p className="mt-6 text-black text-lg md:text-xl leading-relaxed">
                    {tournament.resultOrDescription}
                  </p>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-20 border-2 border-dashed border-gray-200 rounded-xl">
              <p className="text-gray-500 text-xl font-medium">No tournament records found.</p>
              <p className="text-gray-400 mt-2">Add entries via the Sanity Studio.</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer Section */}
      <footer className="mt-32 md:mt-40 border-t-2 border-[#D4AF37] pt-10 flex justify-center items-center text-sm md:text-base font-medium text-black text-center w-full">
        <p>&copy; 2026 Naveed Rehman. All rights reserved.</p>
      </footer>

    </main>
  );
}