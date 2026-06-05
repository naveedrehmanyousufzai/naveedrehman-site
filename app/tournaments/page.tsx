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

export default async function TournamentsPage() {
  // Fetching posts to display as a timeline
  const posts = await client.fetch(`
    *[_type == "post"] | order(publishedAt desc) {
      _id,
      title,
      "imageUrl": mainImage.asset->url,
      publishedAt,
      externalLink,
      postType
    }
  `);

  return (
    <main className="min-h-screen bg-[#F8F9FA] text-black pt-32 pb-20 px-6 md:px-12">
      <div className="max-w-[1000px] mx-auto">
        
        {/* PAGE HEADER */}
        <div className="mb-16">
          <Link href="/" className="text-sm font-bold text-gray-400 hover:text-[#D4AF37] uppercase tracking-widest mb-6 inline-block transition-colors">
            ← Back to Home
          </Link>
          <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter mb-4 text-black">
            Career <span className="text-[#D4AF37]">Archive</span>
          </h1>
          <div className="w-24 h-2 bg-[#D4AF37] mb-6"></div>
          <p className="text-lg text-gray-600 max-w-2xl">
            Official tournament records, match reports, and draws from the professional squash circuit and Sindh Squash Association events.
          </p>
        </div>

        {/* TIMELINE LIST */}
        <div className="space-y-6">
          {posts.length > 0 ? (
            posts.map((post: any) => (
              <div 
                key={post._id} 
                className="bg-white p-6 md:p-8 rounded-lg shadow-sm border border-gray-100 border-l-4 border-l-[#D4AF37] hover:shadow-md transition-shadow flex flex-col md:flex-row gap-8 items-start md:items-center"
              >
                {post.imageUrl && (
                  <div className="w-full md:w-48 h-32 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                    <img 
                      src={post.imageUrl} 
                      alt={post.title} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                )}
                
                <div className="flex-grow">
                  <div className="text-xs font-black text-[#D4AF37] uppercase tracking-widest mb-2">
                    {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Official Record'}
                  </div>
                  <h2 className="text-2xl font-bold text-black mb-3 leading-tight">
                    {post.title}
                  </h2>
                  
                  {post.externalLink && (
                    <a 
                      href={post.externalLink} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="inline-flex items-center gap-2 text-sm font-bold bg-black text-white px-4 py-2 rounded hover:bg-[#D4AF37] transition-colors"
                    >
                      View Official Draw / Report →
                    </a>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white p-12 rounded border-2 border-dashed border-gray-200 text-center text-gray-500 font-medium">
              No tournament records found in the archive.
            </div>
          )}
        </div>

      </div>
    </main>
  );
}