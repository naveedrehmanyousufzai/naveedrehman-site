import type { Metadata } from 'next';
import { createClient } from 'next-sanity';
import Image from 'next/image';
import { urlFor } from '@/lib/img';

export const metadata: Metadata = {
  title: 'News & Media',
  description:
    "Latest announcements, tournament reports, press releases, and featured videos from Naveed Rehman's professional squash career and the Sindh Squash Association.",
  alternates: { canonical: '/news' },
};

// Initialize Sanity Client
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-05-28',
  useCdn: false,
});

export const revalidate = 0; 

export default async function NewsPage() {
  // Fetch only posts that are Articles or Videos (ignoring the standalone photo gallery)
  const posts = await client.fetch(`
    *[_type == "post" && (postType in ["article", "video"] || defined(externalLink) || defined(youtubeLink))] | order(publishedAt desc) {
      _id,
      title,
      "imageUrl": mainImage.asset->url,
      "imageBlur": mainImage.asset->metadata.lqip,
      "videoThumbnailUrl": videoThumbnail.asset->url,
      "videoThumbnailBlur": videoThumbnail.asset->metadata.lqip,
      postType,
      youtubeLink,
      externalLink,
      publishedAt
    }
  `);

  return (
    <main className="min-h-screen bg-white text-black pt-32 pb-20 px-6 md:px-12">
      <div className="max-w-[1400px] mx-auto">
        
        {/* NEWS PAGE HEADER */}
        <div className="border-b-2 border-[#D4AF37]/20 pb-8 mb-12">
          <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter text-black drop-shadow-sm">
            News & <span className="text-[#D4AF37]">Media</span>
          </h1>
          <p className="text-gray-600 font-medium mt-4 max-w-2xl text-lg">
            Latest announcements, tournament reports, and featured videos from the professional tour.
          </p>
        </div>

        {/* NEWS & MEDIA GRID */}
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post: any) => {
              // Determine if it is a video to show the play button
              const isVideo = post.postType === 'video' || post.youtubeLink;
              const link = isVideo ? post.youtubeLink : (post.externalLink || '#');
              const imageSource = post.videoThumbnailUrl || post.imageUrl;
              const imageBlur = post.videoThumbnailUrl ? post.videoThumbnailBlur : post.imageBlur;
              const image = imageSource
                ? urlFor(imageSource).width(900).fit('max').auto('format').url()
                : '/placeholder.jpg'; // Fallback to placeholder if no image

              return (
                <a
                  key={post._id}
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col bg-white rounded-lg overflow-hidden border-2 border-gray-200 hover:border-[#D4AF37] hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-xl"
                >
                  <div className="relative aspect-video overflow-hidden bg-gray-100 border-b-2 border-transparent group-hover:border-[#D4AF37]/20 transition-colors">
                    <Image
                      src={image}
                      alt={post.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      placeholder={imageBlur ? 'blur' : 'empty'}
                      blurDataURL={imageBlur || undefined}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Play Button Overlay for Videos */}
                    {isVideo && (
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                        <div className="w-14 h-14 rounded-full bg-[#D4AF37] text-white flex items-center justify-center scale-90 group-hover:scale-110 transition-transform shadow-lg opacity-90 font-black pl-1">
                          ▶
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="text-[10px] text-[#D4AF37] font-bold uppercase tracking-widest mb-3 flex items-center justify-between">
                      <span>{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : 'Recent Update'}</span>
                      <span>{isVideo ? 'Video' : 'Article'}</span>
                    </div>
                    <h3 className="text-xl font-bold text-black group-hover:text-[#D4AF37] transition-colors line-clamp-3 mb-4">
                      {post.title}
                    </h3>
                    <div className="mt-auto text-xs font-black uppercase tracking-widest text-gray-500 group-hover:text-[#D4AF37] transition-colors flex items-center gap-2">
                      {isVideo ? 'Watch Video' : 'Read Article'} <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        ) : (
          <div className="bg-gray-50 p-12 rounded-lg border-2 border-dashed border-[#D4AF37]/30 text-center text-gray-500 font-medium">
            No news or media published yet. Check back soon.
          </div>
        )}

      </div>
    </main>
  );
}