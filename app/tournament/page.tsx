import Link from "next/link";
import { client } from '@/sanity/lib/client'

// Fetches tournaments from your Sanity Database and orders them by newest first
const query = `*[_type == "tournament"] | order(dateString desc)`

export default async function HomePage() {
  const tournaments = await client.fetch(query)

  return (
    <main className="min-h-screen bg-white text-black font-sans antialiased selection:bg-[#D4AF37] selection:text-white">
      
      {/* Navigation Header */}
      <header className="p-6 sm:p-10 md:p-16 lg:p-24 pb-8 flex flex-col md:flex-row items-center justify-between border-b-2 border-[#D4AF37] max-w-[1400px] mx-auto w-full gap-8 md:gap-0">
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
          <Link href="/" className="!text-[#D4AF37] text-sm md:text-base font-bold uppercase tracking-widest !no-underline border-b-2 border-[#D4AF37] pb-1">Home</Link>
          <Link href="/tournament" className="!text-black text-sm md:text-base font-bold uppercase tracking-widest !no-underline hover:!text-[#D4AF37] transition-colors duration-300">Tournament</Link>
          <Link href="/about" className="!text-black text-sm md:text-base font-bold uppercase tracking-widest !no-underline hover:!text-[#D4AF37] transition-colors duration-300">About</Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative w-full bg-black text-white py-32 md:py-48 px-6 text-center overflow-hidden border-b-[1px] border-gray-800">
        {/* Make sure your image in the public folder matches this URL name */}
        <div className="absolute inset-0 opacity-40 bg-[url('/hero-image.jpg')] bg-cover bg-center"></div>
        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
          <h1 className="text-5xl md:text-7xl font-extrabold uppercase tracking-widest mb-6">
            Naveed <span className="text-[#D4AF37]">Rehman</span>
          </h1>
          <p className="text-xl md:text-2xl font-light tracking-wide max-w-2xl text-gray-300">
            Professional Squash Player & Secretary of the Sindh Squash Association
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="p-6 sm:p-10 md:p-16 lg:p-24 max-w-[1400px] mx-auto w-full">
        
        <div className="text-center mb-16 md:mb-20">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-black uppercase">
            Latest <span className="text-[#D4AF37]">Updates</span>
          </h2>
        </div>

        {/* Tournament Grid */}
        <div className="grid gap-12 w-full max-w-5xl mx-auto">
          {tournaments.length > 0 ? (
            tournaments.map((tournament: any) => (
              <div key={tournament._id} className="border-l-4 border-[#D4AF37] pl-8 py-6 bg-gray-50 pr-8 rounded-r-xl w-full shadow-sm hover:shadow-md transition-shadow duration-300">
                <h3 className="text-3xl md:text-4xl font-bold text-black tracking-wide uppercase">{tournament.title}</h3>
                
                <div className="mt-4 flex flex-wrap gap-x-10 gap-y-3 text-base md:text-lg font-semibold tracking-wider text-gray-700 border-b border-gray-200 pb-4">
                  <p><span className="text-[#D4AF37]">Date:</span> {tournament.dateString}</p>
                  <p><span className="text-[#D4AF37]">Role:</span> {tournament.role}</p>
                </div>
                
                {tournament.resultOrDescription && (
                  <div className="mt-6">
                    {/* line-clamp-3 forces the text to stop after 3 lines */}
                    <p className="text-black text-lg md:text-xl leading-relaxed line-clamp-3">
                      {tournament.resultOrDescription}
                    </p>
                    
                    {/* The "Read More" button */}
                    <Link 
                      href="/tournament" 
                      className="inline-flex items-center mt-4 text-[#D4AF37] font-bold uppercase tracking-wider text-sm md:text-base hover:text-black transition-colors duration-300 group"
                    >
                      Read Full Article
                      <span className="ml-2 transform transition-transform duration-300 group-hover:translate-x-1">→</span>
                    </Link>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-20 border-2 border-dashed border-gray-200 rounded-xl">
              <p className="text-gray-500 text-xl font-medium">Loading updates...</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-20 border-t-2 border-[#D4AF37] pt-10 pb-10 flex justify-center items-center text-sm md:text-base font-medium text-black text-center w-full">
        <p>&copy; 2026 Naveed Rehman. All rights reserved.</p>
      </footer>

    </main>
  );
}