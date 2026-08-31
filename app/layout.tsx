import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { createClient } from "next-sanity";
import "./globals.css";

// Import both your Navigation components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const inter = Inter({ subsets: ["latin"] });

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.naveedrehman.com";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-05-28",
  useCdn: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Naveed Rehman | Professional Squash Athlete",
    template: "%s | Naveed Rehman",
  },
  description:
    "Official platform for Naveed Rehman. Professional squash athlete and Secretary of the Sindh Squash Association.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Social profiles are managed in Sanity (Global Site Settings)
  const settings = await client.fetch(
    `*[_type == "siteSettings"][0]{ instagram, youtube, squashTv }`
  );

  const youtube =
    settings?.youtube ||
    (process.env.YOUTUBE_CHANNEL_ID
      ? `https://www.youtube.com/channel/${process.env.YOUTUBE_CHANNEL_ID}`
      : undefined);

  const sameAs = [settings?.instagram, youtube, settings?.squashTv].filter(
    (url): url is string => Boolean(url)
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${siteUrl}/#person`,
        name: "Naveed Rehman Yousufzai",
        alternateName: "Naveed Rehman",
        url: siteUrl,
        jobTitle: [
          "Professional Squash Player",
          "Secretary, Sindh Squash Association",
        ],
        nationality: { "@type": "Country", name: "Pakistan" },
        knowsAbout: "Squash",
        memberOf: { "@id": `${siteUrl}/#organization` },
        ...(sameAs.length > 0 ? { sameAs } : {}),
      },
      {
        "@type": "SportsOrganization",
        "@id": `${siteUrl}/#organization`,
        name: "Sindh Squash Association",
        sport: "Squash",
        member: { "@id": `${siteUrl}/#person` },
      },
    ],
  };

  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col bg-white text-black`}>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

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