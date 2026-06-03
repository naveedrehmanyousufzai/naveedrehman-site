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
  // Fetch ALL posts from the database. 
  // Added "videoThumbnailUrl" so your new custom thumbnails load perfectly here too!
  const allPosts = await client.fetch(`
    *[_type == "post"] | order(_createdAt desc) {
      _id,
      title,
      postType,
      youtubeLink,
      externalLink,
      "imageUrl": mainImage.asset->url,
      "videoThumbnailUrl": videoThumbnail.asset->url
    }
  `);

  return (
    <main className="min-h-screen bg-white text-black selection:bg-[#D4AF37] selection:text-white pb-20">
      
      {/* Page Header */}
      <section className="pt-32 pb-12 px-6 md:px-12 max-w-7xl mx-auto border-b-2 border-[#D4AF37]/20">
        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter drop-shadow-sm text-black">
          News & <span className="text-[#D4AF37]">Media</span>
        </h1>
        <p className="mt-4 text-gray-600 text-lg max-w-2xl font-medium">
          The official archive for match coverage, association press releases, and digital content.
        </p>
      </section>

      {/* The Master Media Grid */}
      <section className="pt-12 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {allPosts.length > 0 ? (
            allPosts.map((post: any) => (
              <div key={post._id} className="group bg-white border-2 border-gray-100 rounded-lg overflow-hidden hover:border-[#D4AF37] transition-all duration-300 flex flex-col shadow-sm hover:shadow-lg">
                
                {/* Image Rendering Strategy */}
                {post.imageUrl && post.postType !== 'video' && (
                  <div className="h-48 w-full bg-gray-100 border-b-2 border-transparent group-hover:border-[#D4AF37]/20 overflow-hidden">
                    <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                )}
                
                {/* Video Rendering Strategy (Now supports Thumbnails) */}
                {post.postType === 'video' && (
                  <div className="relative h-48 w-full bg-gray-100 flex items-center justify-center border-b-2 border-transparent group-hover:border-[#D4AF37]/20 overflow-hidden">
                    {(post.videoThumbnailUrl || post.imageUrl) ? (
                      <>
                        <img src={post.videoThumbnailUrl || post.imageUrl} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                          <div className="w-12 h-12 rounded-full bg-[#D4AF37] text-white flex items-center justify-center scale-90 group-hover:scale-110 transition-transform shadow-lg font-black pl-1">▶</div>
                        </div>
                      </>
                    ) : (
                      <span className="text-[#D4AF37] text-4xl group-hover:scale-110 transition-transform cursor-pointer drop-shadow-md">▶</span>
                    )}
                  </div>
                )}

                {/* Article Rendering Strategy (No Image fallback) */}
                {post.postType === 'article' && !post.imageUrl && (
                   <div className="h-48 w-full bg-gradient-to-br from-gray-50 to-gray-200 flex items-center justify-center border-b-2 border-transparent group-hover:border-[#D4AF37]/20 transition-colors">
                      <span className="text-gray-300 text-5xl group-hover:scale-110 transition-transform duration-300">📰</span>
                   </div>
                )}

                {/* Text Content */}
                <div className="p-6 flex flex-col flex-grow justify-between">
                  <div>
                    {/* Dynamic Tagging */}
                    <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded mb-4 inline-block border border-[#D4AF37]/30 bg-[#D4AF37]/5 text-[#D4AF37]">
                      {post.postType === 'video' ? '▶ Video' : post.postType === 'photo' ? '📷 Photo' : '📰 Article'}
                    </span>
                    <h3 className="text-xl font-bold mb-3 leading-snug text-black group-hover:text-[#D4AF37] transition-colors">
                      {post.title}
                    </h3>
                  </div>
                  
                  {/* Smart Link Logic */}
                  <div className="mt-6 text-xs font-black uppercase tracking-widest">
                    {post.postType === 'video' && post.youtubeLink ? (
                      <a href={post.youtubeLink} target="_blank" rel="noreferrer" className="text-gray-500 group-hover:text-[#D4AF37] transition-colors flex items-center gap-2">
                        Watch on YouTube <span className="group-hover:translate-x-1 transition-transform">→</span>
                      </a>
                    ) : post.postType === 'article' && post.externalLink ? (
                      <a href={post.externalLink} target="_blank" rel="noreferrer" className="text-gray-500 group-hover:text-[#D4AF37] transition-colors flex items-center gap-2">
                        Read Full Article <span className="group-hover:translate-x-1 transition-transform">→</span>
                      </a>
                    ) : post.postType === 'photo' ? (
                      <Link href={`/news/${post._id}`} className="text-gray-500 group-hover:text-[#D4AF37] transition-colors flex items-center gap-2">
                        View Photo <span className="group-hover:translate-x-1 transition-transform">→</span>
                      </Link>
                    ) : (
                      <Link href={`/news/${post._id}`} className="text-gray-400 group-hover:text-[#D4AF37] transition-colors flex items-center gap-2">
                        Read Details <span className="group-hover:translate-x-1 transition-transform">→</span>
                      </Link>
                    )}
                  </div>
                </div>

              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-gray-500 font-medium bg-gray-50 border-2 border-dashed border-[#D4AF37]/30 rounded-lg">
              No archive history found.
            </div>
          )}
        </div>
      </section>

    </main>
  );
}