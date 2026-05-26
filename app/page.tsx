import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-black p-8 md:p-24 max-w-5xl mx-auto selection:bg-[#D4AF37] selection:text-white flex flex-col font-sans antialiased">
      
      {/* Navigation Header with GOLDEN bottom line */}
      <header className="mb-16 flex items-center justify-between border-b-2 border-[#D4AF37] pb-6">
        <div>
          <img 
            src="/logo.svg" 
            alt="Naveed Rehman Logo" 
            className="h-14 w-auto" 
          />
        </div>
        <nav className="flex items-center gap-8">
          {/* Forced black text and no-underline, forced golden hover using Tailwind's ! modifier */}
          <Link href="/" className="!text-black text-sm font-bold uppercase tracking-widest !no-underline hover:!text-[#D4AF37] transition-colors duration-300">Home</Link>
          <Link href="/tournament" className="!text-black text-sm font-bold uppercase tracking-widest !no-underline hover:!text-[#D4AF37] transition-colors duration-300">Tournament</Link>
          <Link href="/about" className="!text-black text-sm font-bold uppercase tracking-widest !no-underline hover:!text-[#D4AF37] transition-colors duration-300">About</Link>
        </nav>
      </header>

      {/* Main Content Area */}
      <div className="flex-grow">
        {/* Hero Section */}
        <section className="mt-10 flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1 text-left">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-black uppercase">
              Naveed <br />
              <span className="text-[#D4AF37]">Rehman</span>
            </h1>
            <h2 className="text-xl font-medium mt-6 text-black tracking-widest uppercase">
              Professional Squash Player
            </h2>
            <p className="text-lg italic mt-6 text-[#D4AF37] font-semibold">
              &quot;The dream is still alive&quot;
            </p>
          </div>
          
          <div className="flex-1 w-full flex justify-center md:justify-end">
            <Image
              src="/hero-image.jpeg" 
              alt="Naveed Rehman on the squash court"
              width={450}
              height={600}
              className="object-cover shadow-2xl shadow-black/10 grayscale hover:grayscale-0 transition-all duration-700 border-2 border-[#D4AF37] rounded-sm"
              priority
            />
          </div>
        </section>

        {/* Brief Bio Section */}
        <section className="mt-32 max-w-2xl">
          <p className="text-black leading-loose text-lg font-medium">
            As a professional squash athlete and the Secretary of the Sindh Squash Association, 
            I am dedicated to elevating the sport through elite-level competition and 
            strategic infrastructure development.
          </p>
          <div className="mt-10">
            <Link href="/about" className="text-sm font-bold uppercase tracking-widest text-black border-b-2 border-[#D4AF37] pb-1 hover:!text-[#D4AF37] transition-colors duration-300 inline-flex items-center gap-2">
              <span>Discover the Journey</span>
              <span className="text-lg text-[#D4AF37]">→</span>
            </Link>
          </div>
        </section>

        {/* Upcoming Event Section */}
        <section className="mt-32 pt-16">
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#D4AF37] mb-8">Upcoming Event</h3>
          <div className="space-y-3">
            <h4 className="text-3xl font-bold text-black tracking-wide uppercase">Sanctioned Tournament</h4>
            <p className="text-black font-medium text-lg tracking-wider">June 8–12, 2026</p>
            <div className="pt-6">
              <Link href="/tournament" className="text-sm font-bold uppercase tracking-widest text-[#D4AF37] !no-underline hover:!text-black transition-colors duration-300 border-b-2 border-[#D4AF37] pb-1 hover:border-black">
                View Details
              </Link>
            </div>
          </div>
        </section>
      </div>

      {/* Footer Section with GOLDEN top line */}
      <footer className="mt-32 border-t-2 border-[#D4AF37] pt-8 flex justify-center items-center text-sm font-medium text-black">
        <p>&copy; 2026 Naveed Rehman. All rights reserved.</p>
      </footer>

    </main>
  );
}