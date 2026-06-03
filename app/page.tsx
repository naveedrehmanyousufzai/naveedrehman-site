import { createClient } from 'next-sanity';
import Link from 'next/link';

// Initialize Sanity Client
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-05-28',
  useCdn: false,
});

export const revalidate = 0; 

export default async function HomePage() {
  // Fetch up to 30 posts, now including the dedicated video thumbnail
  const posts = await client.fetch(`
    *[_type == "post"] | order(publishedAt desc)[0...30] {
      _id,
      title,
      "imageUrl": mainImage.asset->url,
      "videoThumbnailUrl": videoThumbnail.asset->url,
      publishedAt,
      slug,
      videoUrl,
      externalUrl,
      link
    }
  `);

  // SORTING LOGIC
  const videos = posts.filter((post: any) => post.videoUrl).slice(0, 3);
  const articles = posts.filter((post: any) => !post.videoUrl && (post.externalUrl || post.link)).slice(0, 3);
  const pictures = posts.filter((post: any) => !post.videoUrl && !post.externalUrl && !post.link && post.imageUrl).slice(0, 6);

  return (
    <main className="min-h-screen bg-white text-black pt-32 pb-20 px-6 md:px-12">
      <div className="max-w-[1400px] mx-auto">
        
        {/* HERO SECTION */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-12 mb-24 border-b-2 border-[#D4AF37]/20 pb-16">
          <div className="max-w-3xl">
            <span className="text-[#D4AF37] font-black uppercase tracking-widest text-sm block mb-4">
              Official Platform
            </span>
            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-6 leading-tight text-black">
              NAVEED <span className="text-[#D4AF37]">REHMAN</span>
            </h1>
            <p className="text-gray-600 text-lg md:text-xl font-medium max-w-2xl leading-relaxed mb-8">
              Professional Squash Athlete & Secretary of the Sindh Squash Association. Explore official tournament draws, career archives, and the latest media updates.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link 
                href="/tournaments" 
                className="bg-[#D4AF37] hover:bg-black text-white font-black uppercase tracking-widest px-8 py-4 rounded transition-colors text-sm shadow-md"
              >
                Career Archive
              </Link>
              <Link 
                href="/about" 
                className="bg-white hover:bg-gray-50 border-2 border-[#D4AF37] text-black font-bold uppercase tracking-widest px-8 py-4 rounded transition-colors text-sm shadow-sm"
              >
                Athlete Profile
              </Link>
            </div>
          </div>
        </div>

        {/* --- SECTION 1: YOUTUBE VIDEOS --- */}
        <div className="mb-20">
          <div className="flex justify-between items-end mb-8 border-b-2 border-[#D4AF37]/20 pb-4">
            <h2 className="text-2xl font-black uppercase tracking-tight text-black">
              Latest Videos
            </h2>
          </div>
          
          {videos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {videos.map((post: any) => (
                <a
                  key={post._id}
                  href={post.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block bg-white rounded-lg overflow-hidden border-2 border-[#D4AF37]/30 hover:border-[#D4AF37] hover:-translate-y-1 transition-all duration-300 shadow-lg"
                >
                  <div className="relative aspect-video overflow-hidden border-b-2 border-[#D4AF37]/20 bg-gray-100">
                    {/* Updated Image logic: Prioritizes the dedicated Video Thumbnail, falls back to Main Image */}
                    <img
                      src={post.videoThumbnailUrl || post.imageUrl || '/placeholder.jpg'}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                      <div className="w-14 h-14 rounded-full bg-[#D4AF37] text-white flex items-center justify-center scale-90 group-hover:scale-110 transition-transform shadow-lg opacity-90 font-black pl-1">
                        ▶
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-black group-hover:text-[#D4AF37] transition-colors line-clamp-2 mb-3">
                      {post.title}
                    </h3>
                    <div className="text-xs font-black uppercase tracking-widest text-gray-500 group-hover:text-[#D4AF37] transition-colors flex items-center gap-2">
                      Watch on YouTube <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          ) : (
             <div className="bg-gray-50 p-8 rounded border-2 border-dashed border-[#D4AF37]/30 text-center text-gray-500 font-medium">
               No videos published yet.
             </div>
          )}
        </div>

        {/* --- SECTION 2: NEWS ARTICLES --- */}
        <div className="mb-20">
          <div className="flex justify-between items-end mb-8 border-b-2 border-[#D4AF37]/20 pb-4">
            <h2 className="text-2xl font-black uppercase tracking-tight text-black">
              News & Articles
            </h2>
          </div>
          
          {articles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {articles.map((post: any) => {
                const articleLink = post.externalUrl || post.link || "/news";
                return (
                  <a
                    key={post._id}
                    href={articleLink}
                    target={articleLink.startsWith('http') ? "_blank" : "_self"}
                    rel={articleLink.startsWith('http') ? "noopener noreferrer" : ""}
                    className="group block bg-white rounded-lg overflow-hidden border-2 border-gray-200 hover:border-[#D4AF37] hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-lg"
                  >
                    <div className="relative h-48 overflow-hidden bg-gray-100">
                      <img
                        src={post.imageUrl || '/placeholder.jpg'}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-6">
                      <div className="text-[10px] text-[#D4AF37] font-bold uppercase tracking-widest mb-2">
                        {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : 'Recent Update'}
                      </div>
                      <h3 className="text-lg font-bold text-black group-hover:text-[#D4AF37] transition-colors line-clamp-2 mb-3">
                        {post.title}
                      </h3>
                      <div className="text-xs font-black uppercase tracking-widest text-gray-500 group-hover:text-[#D4AF37] transition-colors flex items-center gap-2">
                        Read Article <span className="group-hover:translate-x-1 transition-transform">→</span>
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>
          ) : (
             <div className="bg-gray-50 p-8 rounded border-2 border-dashed border-[#D4AF37]/30 text-center text-gray-500 font-medium">
               No articles published yet.
             </div>
          )}
        </div>

        {/* --- SECTION 3: PICTURE GALLERY --- */}
        <div>
          <div className="flex justify-between items-end mb-8 border-b-2 border-[#D4AF37]/20 pb-4">
            <h2 className="text-2xl font-black uppercase tracking-tight text-black">
              Latest Pictures
            </h2>
          </div>
          
          {pictures.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {pictures.map((post: any) => (
                <a
                  key={post._id}
                  href={post.imageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative aspect-square overflow-hidden rounded-lg bg-gray-100 shadow-sm hover:shadow-xl transition-all block border-2 border-transparent hover:border-[#D4AF37]"
                >
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <span className="text-white font-bold text-sm line-clamp-2">
                      {post.title}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          ) : (
             <div className="bg-gray-50 p-8 rounded border-2 border-dashed border-[#D4AF37]/30 text-center text-gray-500 font-medium">
               No pictures uploaded yet.
             </div>
          )}
        </div>

      </div>
    </main>
  );
}