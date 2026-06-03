"use client";

import { useState } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Function to toggle the menu open/closed
  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <nav className="fixed w-full z-50 bg-white/90 backdrop-blur-md border-b-2 border-[#D4AF37]/20 text-black transition-all shadow-sm">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 h-20 flex items-center justify-between">
        
        {/* BRAND / LOGO - Now using "invert" to show up perfectly on white! */}
        <Link href="/" className="z-50 flex items-center">
          <img 
            src="/logo.svg" 
            alt="Naveed Rehman Logo" 
            className="h-10 md:h-12 w-auto object-contain invert" 
          />
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-8 text-sm font-black uppercase tracking-widest text-gray-600">
          <Link href="/" className="hover:text-[#D4AF37] transition-colors">Home</Link>
          <Link href="/news" className="hover:text-[#D4AF37] transition-colors">News</Link>
          <Link href="/tournaments" className="hover:text-[#D4AF37] transition-colors">Career Archive</Link>
          <Link href="/about" className="hover:text-[#D4AF37] transition-colors">About</Link>
        </div>

        {/* MOBILE HAMBURGER BUTTON */}
        <button
          onClick={toggleMenu}
          className="md:hidden text-black p-2 focus:outline-none z-50"
          aria-label="Toggle Mobile Menu"
        >
          {isMobileMenuOpen ? (
            // Close "X" Icon (Gold)
            <svg className="w-7 h-7 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            // Hamburger "3 Lines" Icon
            <svg className="w-7 h-7 text-black hover:text-[#D4AF37] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* MOBILE DROPDOWN MENU */}
      <div 
        className={`md:hidden absolute top-20 left-0 w-full bg-white border-b-2 border-[#D4AF37]/20 overflow-hidden transition-all duration-300 ease-in-out shadow-lg ${
          isMobileMenuOpen ? "max-h-64 opacity-100 py-4" : "max-h-0 opacity-0 py-0"
        }`}
      >
        <div className="flex flex-col px-6 gap-2 text-sm font-black uppercase tracking-widest text-gray-600">
          <Link 
            href="/" 
            onClick={toggleMenu} 
            className="hover:text-[#D4AF37] hover:bg-gray-50 border-l-4 border-transparent hover:border-[#D4AF37] p-3 transition-all"
          >
            Home
          </Link>
          <Link 
            href="/news" 
            onClick={toggleMenu} 
            className="hover:text-[#D4AF37] hover:bg-gray-50 border-l-4 border-transparent hover:border-[#D4AF37] p-3 transition-all"
          >
            News
          </Link>
          <Link 
            href="/tournaments" 
            onClick={toggleMenu} 
            className="hover:text-[#D4AF37] hover:bg-gray-50 border-l-4 border-transparent hover:border-[#D4AF37] p-3 transition-all"
          >
            Career Archive
          </Link>
          <Link 
            href="/about" 
            onClick={toggleMenu} 
            className="hover:text-[#D4AF37] hover:bg-gray-50 border-l-4 border-transparent hover:border-[#D4AF37] p-3 transition-all"
          >
            About
          </Link>
        </div>
      </div>
    </nav>
  );
}