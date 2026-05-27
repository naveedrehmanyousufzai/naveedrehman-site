import Image from "next/image";
import Link from "next/link";
import { client } from '@/sanity/lib/client'

const query = `*[_type == "tournament"]`

export default async function Home() {
  const tournaments = await client.fetch(query)

  return (
    <main className="min-h-screen bg-white text-black p-6 sm:p-10 md:p-16 lg:p-24 max-w-[1400px] w-full mx-auto selection:bg-[#D4AF37] selection:text-white font-sans antialiased overflow-hidden">
      
      {/* Navigation Header - Strict Flex Split */}
      <header className="mb-16 md:mb-24 flex flex-col md:flex-row items-center justify-between border-b-2 border-[#D4AF37] pb-8 gap-8 md:gap-0">
        <div>
          <img 
            src="/logo.svg" 
            alt="Naveed Rehman Logo" 
            className="h-16 md:h-24 w-auto" 
          />
        </div>
        <nav className="flex items-center justify-center gap-8 md:gap-12">
          <Link href="/" className="!text-black text-sm md:text-base font-bold uppercase tracking-widest !no-underline hover:!text-[#D4AF37] transition-colors duration-300">Home</Link>
          <Link href="/tournament" className="!text-black text-sm md:text-base font-bold uppercase tracking-widest !no-underline hover:!text-[#D4AF37] transition-colors duration-300">Tournament</Link>
          <Link href="/about" className="!text-black text-sm md:text-base font-bold uppercase tracking-widest !no-underline hover:!text-[#D4AF37] transition-colors duration-300">About</Link>
        </nav>
      </header>

      {/* Main Content Area */}
      <div className="w-full">
        
        {/* Hero Section - STRICT CSS GRID - Wider Gap */}
        <section className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center text-center lg:text-left w-full">
          
          {/* Left Column: Text & Bio */}
          <div className="w-full">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-black uppercase leading-none">
              Naveed <br className="hidden lg:block" />
              <span className="text-[#D4AF37]">Rehman</span>
            </h1>
            <h2 className="text-xl md:text-3xl font-bold mt-8 text-black tracking-widest uppercase">
              Professional Squash Player
            </h2>
            <p className="text-lg md:text-2xl italic mt-6 text-[#D4AF37] font-semibold">
              &quot;The dream is still alive&quot;
            </p>
            
            <p className="mt-10 md:mt-14 text-black leading-relaxed text-base md:text-xl font-medium mx-auto lg:mx-0 max-w-2xl">
              As a professional squash athlete and the Secretary of the Sindh Squash Association, 
              I am dedicated to elevating the sport through elite-level competition and 
              strategic infrastructure development.
            </p>
            
            <div className="mt-12 flex justify-center lg:justify-start">
              <Link href="/about" className="text-sm md:text-base font-bold uppercase tracking-widest text-black border-b-2 border-[#D4AF37] pb-2 hover:text-[#D4AF37] transition-colors duration-300 inline-flex items-center gap-3">
                <span>Discover the Journey</span>
                <span className="text-2xl text-[#D4AF37]">→</span>
              </Link>
            </div>
          </div>
          
          {/* Right Column: Image */}
          <div className="w-full flex justify-center lg:justify-end">
            <Image
              src="/hero-image.jpeg" 
              alt="Naveed Rehman on the squash court"
              width={650}
              height={900}
              className="w-full max-w-[400px] lg:max-w-[600px] h-auto object-cover shadow-2xl shadow-black/20 border-2 border-[#D4AF37] rounded-sm grayscale hover:grayscale-0 transition-all duration-700"
              priority
            />
          </div>
        </section>

        {/* Dynamic Sanity Section */}
        <section className="mt-32 md:mt-40 pt-16 md:pt-20 text-center lg:text-left border-t border-gray-200 w-full">
          <h3 className="text-sm md:text-base font-bold uppercase tracking-[0.2em] text-[#D4AF37] mb-12">Career & Events</h3>
          
          <div className="grid gap-10 w-full">
            {tournaments.length > 0 ? (
              tournaments.map((tournament: any) => (
                <div key={tournament._id} className="border-l-4 border-[#D4AF37] pl-8 py-4 bg-gray-50/50 pr-8 rounded-r-xl w-full">
                  <h4 className="text-2xl md:text-3xl font-bold text-black tracking-wide uppercase">{tournament.title}</h4>
                  
                  <div className="mt-4 flex flex-col md:flex-row md:gap-10 text-sm md:text-lg font-semibold tracking-wider text-gray-700">
                    <p><span className="text-[#D4AF37]">Date:</span> {tournament.dateString}</p>
                    <p><span className="text-[#D4AF37]">Role:</span> {tournament.role}</p>
                    {tournament.category && <p><span className="text-[#D4AF37]">Category:</span> {tournament.category}</p>}
                  </div>
                  
                  {tournament.resultOrDescription && (
                    <p className="mt-6 text-black text-base md:text-xl leading-relaxed max-w-5xl">
                      {tournament.resultOrDescription}
                    </p>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-500 italic text-lg">Loading tournament data...</p>
            )}
          </div>
          
          <div className="pt-12 flex justify-center lg:justify-start">
            <Link href="/tournament" className="text-sm md:text-base font-bold uppercase tracking-widest text-[#D4AF37] !no-underline hover:!text-black transition-colors duration-300 border-b-2 border-[#D4AF37] pb-2 hover:border-black">
              View All Tournaments
            </Link>
          </div>
        </section>
      </div>

      {/* Footer Section */}
      <footer className="mt-32 md:mt-40 border-t-2 border-[#D4AF37] pt-10 flex justify-center items-center text-sm md:text-base font-medium text-black text-center w-full">
        <p>&copy; 2026 Naveed Rehman. All rights reserved.</p>
      </footer>

    </main>
  );
}