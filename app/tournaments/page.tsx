import { createClient } from 'next-sanity';
import Link from 'next/link';

// Initialize Sanity Client
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-05-28',
  useCdn: false, // Ensures the homepage always shows the newest content
});

export const revalidate = 0; 

export default async function HomePage() {
  // Fetch the 3 most recent posts/media updates, making sure to grab external link fields
  const posts = await client.fetch(`
    *[_type == "post"] | order(publishedAt desc)[0...3] {
      _id,
      title,
      "imageUrl": mainImage.asset->url,
      publishedAt,
      slug,
      videoUrl,
      externalUrl,
      link
    }
  `);

  return (
    <main className="min-h-screen bg-[#111111] text-white pt-32 pb-20 px-6 md:px-12">
      <div className="max-w-[1400px] mx-auto">
        
        {/* HERO SECTION */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-12 mb-24 border-b border-white/10 pb-16">
          <div className="max-w-3xl">
            <span className="text-[#D4AF37] font-black uppercase tracking-widest text-sm block mb-4">
              Official Platform
            </span>
            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-6 leading-tight">
              NAVEED <span className="text-[#D4AF37]">REHMAN</span>
            </h1>
            <p className="text-gray-400 text-lg md:text-xl font-medium max-w-2xl leading-relaxed mb-8">
              Professional Squash Athlete & Secretary of the Sindh Squash Association. Explore official tournament draws, career archives, and the latest media updates.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link 
                href="/tournaments" 
                className="bg-[#D4AF37] hover:bg-white text-black font-black uppercase tracking-widest px-8 py-4 rounded transition-colors text-sm"
              >
                Career Archive
              </Link>
              <Link 
                href="/about" 
                className="bg-[#1a1a1a] hover:bg-white/10 border border-white/20 text-white font-bold uppercase tracking-widest px-8 py-4 rounded transition-colors text-sm"
              >
                Athlete Profile
              </Link>
            </div>
          </div>
        </div>

        {/* LATEST UPDATES / MEDIA SECTION */}
        <div>
          <div className="flex justify-between items-end mb-8 border-b border-white/10 pb-4">
            <h2 className="text-2xl font-black uppercase tracking-tight">
              Latest Updates
            </h2>
          </div>
          
          {posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {posts.map((post: any) => {
                // Determine the direct link (checks multiple possible Sanity field names)
                const directLink = post.videoUrl || post.externalUrl || post.link || `/media/${post.slug?.current}`;
                
                // If it starts with http, it's external (like YouTube)
                const isExternal = directLink.startsWith('http');

                return (
                  // The ENTIRE card is wrapped in an <a> tag
                  <a
                    key={post._id}
                    href={directLink}
                    target={isExternal ? "_blank" : "_self"}
                    rel={isExternal ? "noopener noreferrer" : ""}
                    className="group block bg-[#1a1a1a] rounded-lg overflow-hidden border border-white/10 hover:border-[#D4AF37] hover:-translate-y-1 transition-all duration-300 shadow-lg cursor-pointer"
                  >
                    
                    {/* Image Box */}
                    <div className="relative aspect-video overflow-hidden border-b border-white/10 bg-black">
                      <img
                        src={post.imageUrl || '/placeholder.jpg'} // Fallback if no image is uploaded
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                      />
                      
                      {/* Play Button Overlay */}
                      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/0 transition-colors flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-[#D4AF37] text-black flex items-center justify-center scale-90 group-hover:scale-110 transition-transform shadow-lg opacity-0 group-hover:opacity-100 font-black pl-1">
                          ▶
                        </div>
                      </div>
                    </div>

                    {/* Text Box */}
                    <div className="p-6 flex flex-col justify-between h-[180px]">
                      <div>
                        <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-2">
                          {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : 'Recent'}
                        </div>
                        <h3 className="text-lg font-bold text-white group-hover:text-[#D4AF37] transition-colors line-clamp-2">
                          {post.title}
                        </h3>
                      </div>
                      
                      {/* Visual Call to Action */}
                      <div className="mt-4 text-xs font-black uppercase tracking-widest text-gray-400 group-hover:text-[#D4AF37] transition-colors flex items-center gap-2">
                        {isExternal ? 'Watch Video' : 'Read More'} <span className="group-hover:translate-x-1 transition-transform">→</span>
                      </div>
                    </div>
                    
                  </a>
                );
              })}
            </div>
          ) : (
            <div className="bg-[#1a1a1a] p-12 rounded-lg border border-white/10 text-center text-gray-500 font-medium">
              No recent updates published yet.
            </div>
          )}
        </div>

      </div>
    </main>
  );
}