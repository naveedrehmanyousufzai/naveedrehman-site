export default function Home() {
  return (
    <main className="min-h-screen bg-white text-gray-900 p-8 md:p-24 max-w-4xl mx-auto">
      {/* Hero Section */}
      <section className="text-left mt-10">
        <h1 className="text-5xl font-bold tracking-tight">Naveed Rehman</h1>
        <h2 className="text-xl font-light mt-2 text-gray-600">Professional Squash Player</h2>
        <p className="text-md italic mt-4 text-gray-500">"The dream is still alive"</p>
      </section>

      {/* Brief Bio Section */}
      <section className="mt-20">
        <p className="text-gray-800 leading-relaxed text-lg">
          As a professional squash athlete and the Secretary of the Sindh Squash Association, 
          I am dedicated to elevating the sport through elite-level competition and 
          strategic infrastructure development.
        </p>
        <div className="mt-8">
          <a href="/about" className="text-sm font-medium underline underline-offset-4 hover:text-gray-600">
            Read more about my professional background
          </a>
        </div>
      </section>

      {/* Upcoming Event Section */}
      <section className="mt-20 pt-12 border-t border-gray-100">
        <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-6">Upcoming Event</h3>
        <div className="space-y-2">
          <h4 className="text-2xl font-semibold">June 2026 Sanctioned Tournament</h4>
          <p className="text-gray-600">June 8, 2026</p>
          <div className="pt-4">
            <a href="/tournament" className="text-sm font-medium underline underline-offset-4 hover:text-gray-600">
              View tournament details
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}