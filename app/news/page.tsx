import Link from 'next/link';
import { createClient } from 'next-sanity';

// Force real-time updates
export const revalidate = 0;

export const metadata = {
  title: 'News & Media | Naveed Rehman',
};

// Database Connection
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-05-28',
  useCdn: false,
});

export default async function NewsArchivePage() {
  // Fetch ALL posts from the database, ordered by newest first
  const allPosts = await client.fetch(`
    *[_type == "post"] | order(_createdAt desc) {
      _id,
      title,
      postType,
      youtubeLink,
      externalLink,
      "imageUrl": mainImage.asset->url
    }
  `);

  return (
    <main className="min-h-screen bg-[#111111] text-white selection:bg-[#D4AF37] selection:text-black pb-20">
      
      {/* Page Header */}
      <section className="pt-24 pb-12 px-6 md:px-12 max-w-7xl mx-auto border-b border-white/10">
        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter drop-shadow-lg">
          News & <span className="text-[#D4AF37]">Media</span>
        </h1>
        <p className="mt-4 text-gray-400 text-lg max-w-2xl font-light">
          The official archive for match coverage, association press releases, and digital content.
        </p>
      </section>

      {/* The Master Media Grid */}
      <section className="pt-12 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {allPosts.length > 0 ? (
            allPosts.map((post: any) => (
              <div key={post._id} className="bg-[#1a1a1a] border border-white/5 rounded-lg overflow-hidden hover:border-[#D4AF37]/50 transition-colors duration-300 flex flex-col shadow-lg">
                
                {/* Image Rendering Strategy */}
                {post.imageUrl && post.postType !== 'video' && (
                  <div className="h-48 w-full bg-[#111]">
                    <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity" />
                  </div>
                )}
                {post.postType === 'video' && (
                  <div className="h-48 w-full bg-black flex items-center justify-center border-b border-white/10">
                     <span className="text-[#D4AF37] text-4xl hover:scale-110 transition-transform cursor-pointer">▶</span>
                  </div>
                )}
                {post.postType === 'article' && !post.imageUrl && (
                   <div className="h-48 w-full bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] flex items-center justify-center border-b border-white/10">
                      <span className="text-white/20 text-5xl">📰</span>
                   </div>
                )}

                <div className="p-6 flex flex-col flex-grow justify-between">
                  <div>
                    {/* Dynamic Tagging */}
                    <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-4 inline-block bg-white/10 text-gray-300">
                      {post.postType === 'video' ? '▶ Video' : post.postType === 'photo' ? '📷 Photo' : '📰 Article'}
                    </span>
                    <h3 className="text-xl font-bold mb-3 leading-snug">
                      {post.title}
                    </h3>
                  </div>
                  
                  {/* Smart Link Logic */}
                  <div className="mt-6">
                    {post.postType === 'video' && post.youtubeLink ? (
                      <a href={post.youtubeLink} target="_blank" rel="noreferrer" className="text-[#D4AF37] font-semibold hover:text-white transition-colors flex items-center gap-2">
                        Watch on YouTube →
                      </a>
                    ) : post.postType === 'article' && post.externalLink ? (
                      <a href={post.externalLink} target="_blank" rel="noreferrer" className="text-[#D4AF37] font-semibold hover:text-white transition-colors flex items-center gap-2">
                        Read Full Article →
                      </a>
                    ) : post.postType === 'photo' ? (
                      <Link href={`/news/${post._id}`} className="text-[#D4AF37] font-semibold hover:text-white transition-colors">
                        View Photo →
                      </Link>
                    ) : (
                      <Link href={`/news/${post._id}`} className="text-gray-400 font-semibold hover:text-white transition-colors">
                        Read Details →
                      </Link>
                    )}
                  </div>
                </div>

              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-gray-500 font-light border border-dashed border-white/10 rounded">
              No archive history found.
            </div>
          )}
        </div>
      </section>

    </main>
  );
}