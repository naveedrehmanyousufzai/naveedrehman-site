import Link from 'next/link';
import { createClient } from 'next-sanity';

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-05-28',
  useCdn: false,
});

export default async function Footer() {
  const settings = await client.fetch(`*[_type == "siteSettings"][0]`);

  return (
    <footer className="bg-white border-t-2 border-[#D4AF37]/20 text-black pt-16 pb-8 px-6 md:px-12 mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
        
        {/* Brand & Description Column */}
        <div className="flex flex-col gap-4">
          <span className="text-3xl font-black tracking-tighter text-black">
            {settings?.title ? settings.title : <>N<span className="text-[#D4AF37]">R</span></>}
          </span>
          <p className="text-gray-600 font-medium leading-relaxed">
            {settings?.description || "Professional Squash Athlete & Secretary of the Sindh Squash Association."}
          </p>
        </div>

        {/* Quick Links Column */}
        <div className="flex flex-col gap-4">
          <h3 className="text-[#D4AF37] font-black uppercase tracking-widest text-sm">Platform</h3>
          <Link href="/tournaments" className="text-gray-600 font-bold hover:text-[#D4AF37] transition-colors">Tournaments</Link>
          <Link href="/news" className="text-gray-600 font-bold hover:text-[#D4AF37] transition-colors">News & Media</Link>
          <Link href="/about" className="text-gray-600 font-bold hover:text-[#D4AF37] transition-colors">Athlete Profile</Link>
        </div>

        {/* Contact & Social Column */}
        <div className="flex flex-col gap-5">
          <h3 className="text-[#D4AF37] font-black uppercase tracking-widest text-sm">Connect</h3>
          
          <div className="flex flex-col gap-4 mt-1">
            
            {/* Email */}
            {settings?.email && (
              <a href={`mailto:${settings.email}`} className="flex items-center gap-3 text-gray-600 hover:text-[#D4AF37] transition-colors font-bold group">
                <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5 group-hover:scale-110 transition-transform">
                  <path d="M0 3v18h24v-18h-24zm21.518 2l-9.518 7.713-9.518-7.713h19.036zm-19.518 14v-11.817l10 8.104 10-8.104v11.817h-20z"/>
                </svg>
                <span>{settings.email}</span>
              </a>
            )}

            {/* Instagram */}
            {settings?.instagram && (
              <a href={settings.instagram} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-gray-600 hover:text-[#D4AF37] transition-colors font-bold group">
                <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5 group-hover:scale-110 transition-transform">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                <span>Instagram</span>
              </a>
            )}

            {/* Facebook */}
            {settings?.facebook && (
              <a href={settings.facebook} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-gray-600 hover:text-[#D4AF37] transition-colors font-bold group">
                <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5 group-hover:scale-110 transition-transform">
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
                </svg>
                <span>Facebook</span>
              </a>
            )}

            {/* YouTube */}
            {settings?.youtube && (
              <a href={settings.youtube} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-gray-600 hover:text-[#D4AF37] transition-colors font-bold group">
                <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5 group-hover:scale-110 transition-transform">
                  <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                </svg>
                <span>YouTube</span>
              </a>
            )}

          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t-2 border-gray-100 text-center text-gray-400 font-bold uppercase tracking-widest text-[10px]">
        <p>© {new Date().getFullYear()} Naveed Rehman. All rights reserved.</p>
      </div>
    </footer>
  );
}