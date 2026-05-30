import Link from 'next/link';
import { createClient } from 'next-sanity';

// 1. Establish the connection to your secure database
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-05-28',
  useCdn: false, // Ensures you see changes instantly when you upload a new logo
});

export default async function Navbar() {
  // 2. Fetch the exact URL of the logo you uploaded in the dashboard
  const data = await client.fetch(`*[_type == "siteSettings"][0]{ "logoUrl": logo.asset->url }`);

  return (
    <nav className="w-full bg-white border-b-2 border-[#D4AF37] py-4 px-6 md:px-12 flex justify-between items-center sticky top-0 z-50 shadow-sm">
      
      {/* 3. The Logo Area - Now connected to your database */}
      <Link href="/" className="text-3xl font-black tracking-tighter text-[#111111] flex items-center">
        {data?.logoUrl ? (
          <img src={data.logoUrl} alt="Naveed Rehman Logo" className="h-12 w-auto object-contain" />
        ) : (
          /* Fallback text just in case you ever delete the logo from the dashboard */
          <>N<span className="text-[#D4AF37]">R</span></>
        )}
      </Link>

      {/* The Navigation Links */}
      <div className="hidden md:flex gap-8 items-center font-medium text-[#111111]">
        <Link href="/tournaments" className="hover:text-[#D4AF37] transition-colors">
          Tournaments
        </Link>
        <Link href="/news" className="hover:text-[#D4AF37] transition-colors">
          News & Media
        </Link>
        <Link href="/about" className="hover:text-[#D4AF37] transition-colors">
          About
        </Link>
        
        {/* The Action Button */}
        <Link href="/admin" className="bg-[#D4AF37] text-white px-6 py-2 font-bold rounded hover:bg-[#111111] transition-colors">
          Portal Login
        </Link>
      </div>
      
      {/* Mobile Menu Icon */}
      <div className="md:hidden text-[#111111] hover:text-[#D4AF37] text-2xl font-bold cursor-pointer transition-colors">
        ☰
      </div>
    </nav>
  );
}