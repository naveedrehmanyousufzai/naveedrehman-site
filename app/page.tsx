import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-gray-900 p-8 md:p-24 max-w-4xl mx-auto">
      
      {/* Navigation Header with Logo */}
      <header className="mb-12 flex items-center justify-between border-b border-gray-100 pb-6">
        <div>
          <Image
            src="/logo.svg" 
            alt="Naveed Rehman Logo"
            width={120} // Adjust this width as needed for your SVG
            height={40} // Adjust this height as needed
            className="h-auto w-auto"
            priority
          />
        </div>
        <nav className="space-x-6 text-sm font-medium">
          <Link href="/" className="hover:text-gray-500">Home</Link>
          <Link href="/tournament" className="hover:text-gray-500">Tournament</Link>
          <Link href="/about" className="hover:text-gray-500">About</Link>
        </nav>
      </header>

      {/* Hero Section with Image */}
      <section className="mt-10 flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1 text-left">
          <h1 className="text-5xl font-bold tracking-tight">Naveed Rehman</h1>
          <h2 className="text-xl font-light mt-2 text-gray-600">Professional Squash Player</h2>
          <p className="text-md italic mt-4 text-gray-500">&quot;The dream is still alive&quot;</p>
        </div>
        
        <div className="flex-1 w-full flex justify-center md:justify-end">
          <Image
            src="/hero-image.jpeg" 
            alt="Naveed Rehman on the squash court"
            width={400}
            height={500}
            className="rounded-md object-cover shadow-sm bg-gray-100"
            priority
          />
        </div>
      </section>

      {/* Brief Bio Section */}
      <section className="mt-20">
        <p className="text-gray-800 leading-relaxed text-lg">
          As a professional squash athlete and the Secretary of the Sindh Squash Association, 
          I am dedicated to elevating the sport through elite-level competition and 
          strategic infrastructure development.
        </p>
        <div className="mt-8">
          <Link href="/about" className="text-sm font-medium underline underline-offset-4 hover:text-gray-600">
            Read more about my professional background
          </Link>
        </div>
      </section>

      {/* Upcoming Event Section */}
      <section className="mt-20 pt-12 border-t border-gray-100">
        <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-6">Upcoming Event</h3>
        <div className="space-y-2">
          <h4 className="text-2xl font-semibold">June 2026 Sanctioned Tournament</h4>
          <p className="text-gray-600">June 8–12, 2026</p>
          <div className="pt-4">
            <Link href="/tournament" className="text-sm font-medium underline underline-offset-4 hover:text-gray-600">
              View tournament details
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}