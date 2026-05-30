import Link from 'next/link';
import { createClient } from 'next-sanity';

// Force real-time updates when you publish changes in the dashboard
export const revalidate = 0;

export const metadata = {
  title: 'Naveed Rehman | Official Platform',
  description: 'Professional Squash Athlete & Secretary of the Sindh Squash Association.',
};

// Connect to your secure database
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-05-28',
  useCdn: false,
});

export default async function HomePage() {
  // 1. Fetch the background image from Global Settings
  const settings = await client.fetch(`*[_type == "siteSettings"][0]{ 
    "bgUrl": heroImage.asset->url,
    title,
    description
  }`);

  // 2. Fetch the 3 most recent posts for the homepage media grid
  const recentPosts = await client.fetch(`
    *[_type == "post"] | order(_createdAt desc)[0...3] {
      _id,
      title,
      postType,
      "imageUrl": mainImage.asset->url
    }
  `);

  return (
    <main className="min-h-screen bg-[#111111] text-white selection:bg-[#D4AF37] selection:text-black pb-20">
      
      {/* --- HERO SECTION --- */}
      <section className="relative pt-40 pb-32 px-6 md:px-12 flex flex-col items-center justify-center border-b border-white/10 min-h-[70vh] overflow-hidden">
        
        {/* The Faded Background Image */}
        {settings?.bgUrl && (
          <div 
            className="absolute inset-0 z-0 opacity-20" 
            style={{
              backgroundImage: `url(${settings.bgUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        )}

        {/* Gradient fades so the image blends smoothly into the dark background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#111111]/40 via-transparent to-[#111111] z-0"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-transparent z-0"></div>

        {/* Hero Text */}
        <div className="relative z-10 text-center max-w-4xl mx-auto flex flex-col items-center mt-8">
          <span className="text-[#D4AF37] font-bold tracking-[0.3em] uppercase text-sm mb-6 drop-shadow-md">
            Official Platform
          </span>
          <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter drop-shadow-2xl leading-none">
            Naveed <br className="md:hidden" /><span className="text-[#D4AF37]">Rehman</span>
          </h1>
          <p className="mt-8 text-gray-300 text-xl max-w-2xl font-light leading-relaxed">
            {settings?.description || "Professional Squash Athlete & Secretary of the Sindh Squash Association."}
          </p>

          {/* Quick Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-10">
            <Link href="/about" className="bg-[#D4AF37] text-[#111111] px-8 py-4 font-bold rounded hover:bg-white transition-colors uppercase tracking-wide text-sm">
              Athlete Profile
            </Link>
            <Link href="/tournaments" className="border border-white/30 text-white px-8 py-4 font-bold rounded hover:bg-white hover:text-[#111111] transition-colors uppercase tracking-wide text-sm">
              View Tournaments
            </Link>
          </div>
        </div>
      </section>

      {/* --- LATEST MEDIA GRID --- */}
      <section className="pt-24 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-10 border-b border-white/10 pb-4">
          <h2 className="text-3xl font-black uppercase tracking-tight">Latest <span className="text-[#D4AF37]">Updates</span></h2>
          <Link href="/news" className="text-sm font-bold text-gray-400 hover:text-[#D4AF37] uppercase tracking-wider transition-colors">
            View All →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {recentPosts.length > 0 ? (
            recentPosts.map((post: any) => (
              <div key={post._id} className="bg-[#1a1a1a] border border-white/5 rounded-lg overflow-hidden hover:border-[#D4AF37]/50 transition-colors duration-300 flex flex-col shadow-lg">
                
                {/* Image Logic */}
                {post.imageUrl ? (
                  <div className="h-48 w-full bg-[#111]">
                    <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity" />
                  </div>
                ) : (
                  <div className="h-48 w-full bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] flex items-center justify-center border-b border-white/10">
                    <span className="text-white/20 text-5xl">📰</span>
                  </div>
                )}

                <div className="p-6 flex flex-col flex-grow">
                  <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-4 inline-block bg-white/10 text-gray-300 self-start">
                    {post.postType === 'video' ? '▶ Video' : post.postType === 'photo' ? '📷 Photo' : '📰 Article'}
                  </span>
                  <h3 className="text-xl font-bold mb-6 leading-snug">
                    {post.title}
                  </h3>
                  
                  <div className="mt-auto pt-4 border-t border-white/5">
                    <Link href="/news" className="text-[#D4AF37] text-sm font-semibold hover:text-white transition-colors">
                      Open in Archive →
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
             <div className="col-span-full text-center py-12 text-gray-500 font-light border border-dashed border-white/10 rounded">
               No recent updates found. Head to the Command Center to publish news.
             </div>
          )}
        </div>
      </section>

    </main>
  );
}