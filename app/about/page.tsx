import Link from 'next/link';
import { createClient } from 'next-sanity';

// Force real-time updates when you publish changes
export const revalidate = 0;

export const metadata = {
  title: 'About Naveed Rehman | Athlete & Administrator',
};

// Connect to the database
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-05-28',
  useCdn: false,
});

export default async function AboutPage() {
  // Fetch the profile data. We use [0] because there is only one About page.
  const data = await client.fetch(`*[_type == "aboutProfile"][0]`);

  // Fallback text just in case you haven't published anything yet
  const heroTitle = data?.heroTitle || "The Drive Behind the Game";
  const heroSubtitle = data?.heroSubtitle || "Competing at the highest levels of the PSA World Tour while laying the foundation for the next generation of squash champions.";
  
  const athleteBio = data?.athleteBio || "Professional PSA squash athlete representing Pakistan on the global stage.";
  const worldRanking = data?.worldRanking || "203";
  const topMedal = data?.topMedal || "GOLD - Sindh Games";

  const adminBio = data?.adminBio || "Secretary of the Sindh Squash Association. Focused on structured tournaments and junior development.";
  const initiatives = data?.initiatives || [
    "Expanding the National Junior Series.",
    "Mandating transparent prize distribution.",
    "Managing academy development."
  ];

  return (
    <main className="min-h-screen bg-[#111111] text-white selection:bg-[#D4AF37] selection:text-black pb-20">
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-6 md:px-12 max-w-7xl mx-auto text-center border-b border-white/10 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#D4AF37] opacity-[0.02] rounded-full blur-3xl pointer-events-none"></div>
        <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter drop-shadow-lg relative z-10">
          {heroTitle}
        </h1>
        <p className="mt-6 text-gray-400 text-xl max-w-3xl mx-auto font-light leading-relaxed relative z-10">
          {heroSubtitle}
        </p>
      </section>

      {/* The Dual-Identity Split */}
      <section className="pt-16 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
          
          {/* THE ATHLETE */}
          <div className="flex flex-col gap-6">
            <div className="border-b-2 border-[#D4AF37] pb-4 inline-block self-start">
              <span className="text-sm font-bold tracking-[0.2em] uppercase text-[#D4AF37]">01. The Competitor</span>
              <h2 className="text-4xl font-black uppercase tracking-tight mt-2">Professional <br/>Athlete</h2>
            </div>
            
            <p className="text-gray-300 text-lg leading-relaxed font-light whitespace-pre-line">
              {athleteBio}
            </p>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="bg-[#1a1a1a] p-6 rounded border border-white/5 text-center flex flex-col justify-center">
                <span className="text-4xl font-black text-white">{worldRanking}</span>
                <span className="text-xs uppercase tracking-widest text-gray-500 mt-2 font-bold">Career High PSA</span>
              </div>
              <div className="bg-[#1a1a1a] p-6 rounded border border-[#D4AF37]/30 text-center flex flex-col justify-center">
                <span className="text-xl font-black text-[#D4AF37] leading-tight">{topMedal}</span>
                <span className="text-xs uppercase tracking-widest text-[#D4AF37]/80 mt-2 font-bold">Top Achievement</span>
              </div>
            </div>
          </div>

          {/* THE ADMINISTRATOR */}
          <div className="flex flex-col gap-6 mt-12 lg:mt-0">
            <div className="border-b-2 border-white/30 pb-4 inline-block self-start">
              <span className="text-sm font-bold tracking-[0.2em] uppercase text-gray-400">02. The Builder</span>
              <h2 className="text-4xl font-black uppercase tracking-tight mt-2 text-gray-200">Association <br/>Secretary</h2>
            </div>
            
            <p className="text-gray-300 text-lg leading-relaxed font-light whitespace-pre-line">
              {adminBio}
            </p>

            <div className="bg-[#1a1a1a] p-6 md:p-8 rounded border border-white/5 mt-4">
              <h3 className="text-xl font-bold mb-4 uppercase tracking-wide">Key Initiatives</h3>
              <ul className="space-y-4">
                {initiatives.map((item: string, index: number) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-[#D4AF37] mt-1">✦</span>
                    <span className="text-gray-400">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="mt-24 px-6 md:px-12 max-w-5xl mx-auto">
        <div className="bg-gradient-to-r from-[#D4AF37] to-[#b5952f] rounded-lg p-10 md:p-16 text-center text-[#111111] shadow-2xl">
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-4">Connect With The Court</h2>
          <p className="text-lg md:text-xl font-medium mb-8 max-w-2xl mx-auto">
            Whether for press inquiries, sponsorship, or association matters, my team is ready to connect.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/news" className="bg-[#111111] text-white px-8 py-4 font-bold rounded hover:bg-white hover:text-[#111111] transition-colors uppercase tracking-wide">
              View Latest News
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}