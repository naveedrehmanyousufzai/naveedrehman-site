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
  // 1. Fetching the exact fields from your Smart Schema
  const posts = await client.fetch(`
    *[_type == "post"] | order(publishedAt desc)[0...30] {
      _id,
      title,
      "imageUrl": mainImage.asset->url,
      "videoThumbnailUrl": videoThumbnail.asset->url,
      postType,
      youtubeLink,
      externalLink,
      publishedAt
    }
  `);

  // 2. SORTING LOGIC (Using your postType radio buttons)
  const videos = posts.filter((post: any) => post.postType === 'video' || post.youtubeLink).slice(0, 3);
  const articles = posts.filter((post: any) => post.postType === 'article' || (!post.postType && post.externalLink)).slice(0, 3);
  const pictures = posts.filter((post: any) => post.postType === 'photo' || (!post.postType && !post.youtubeLink && !post.externalLink && post.imageUrl)).slice(0, 6);

  return (
    <main className="min-h-screen bg-white text-black pt-32 pb-20 px-6 md:px-12">
      <div className="max-w-[1400px] mx-auto">
        
        {/* HERO SECTION */}
        {/* z-0 ensures this entire block sits on top of the white background */}
        <div className="relative z-0 flex flex-col md:flex-row items-start md:items-center justify-between gap-12 mb-24 border-b-2 border-[#D4AF37]/20 pb-16 pt-8">
          
          {/* BACKGROUND IMAGE CONTAINER */}
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <img 
              src="/hero.png" /* <--- Perfectly matches your GitHub repository */
              alt="Squash Court Background" 
              className="w-full h-full object-cover opacity-100" 
            />
            {/* Gradient fades the bottom of the image smoothly into the white page */}
            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent"></div>
            {/* Adds a slight golden glow behind the text */}
            <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[600px] h-[300px] bg-[#D4AF37] opacity-[0.05] rounded-full blur-3xl"></div>
          </div>

          {/* TEXT CONTAINER */}
          {/* z-10 ensures your text stays clearly readable on top of the image */}
          <div className="max-w-3xl relative z-10">
            <span className="text-[#D4AF37] font-black uppercase tracking-widest text-sm block mb-4">
              Official Platform
            </span>
            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-6 leading-tight text-black drop-shadow-md">
              NAVEED <span className="text-[#D4AF37]">REHMAN</span>
            </h1>
            <p className="text-gray-800 text-lg md:text-xl font-medium max-w-2xl leading-relaxed mb-8 drop-shadow-sm bg-white/40 backdrop-blur-sm p-4 rounded-lg">
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
                  href={post.youtubeLink || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block bg-white rounded-lg overflow-hidden border-2 border-[#D4AF37]/30 hover:border-[#D4AF37] hover:-translate-y-1 transition-all duration-300 shadow-lg"
                >
                  <div className="relative aspect-video overflow-hidden border-b-2 border-[#D4AF37]/20 bg-gray-100">
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
                const articleLink = post.externalLink || "/news";
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