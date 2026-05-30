import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Import both your Navigation components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Naveed Rehman | Professional Squash Athlete",
  description: "Official platform for Naveed Rehman. Professional squash athlete and Secretary of the Sindh Squash Association.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col bg-[#111111]`}>
        
        {/* The Navbar stays sticky at the top */}
        <Navbar />

        {/* This is where your page content changes (Home, About, News, etc.) */}
        <div className="flex-grow">
          {children}
        </div>

        {/* The Footer stays anchored to the bottom */}
        <Footer />
        
      </body>
    </html>
  );
}