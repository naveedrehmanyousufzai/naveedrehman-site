export default function AboutPage() {
  return (
    <main className="max-w-4xl mx-auto p-12">
      <h1 className="text-4xl font-bold mb-6">About Naveed Rehman</h1>
      <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
        <p>
          I am a professional squash athlete based in Sindh, committed to the growth 
          of the game both on and off the court. My professional journey combines 
          high-performance athletics with sports administration.
        </p>
        <h2 className="text-2xl font-semibold text-gray-900">Association Leadership</h2>
        <p>
          Currently serving as the Secretary of the Sindh Squash Association, I oversee 
          strategic policy decisions, infrastructure maintenance, and tournament 
          operations to provide a professional environment for rising talent.
        </p>
        <a href="/" className="inline-block mt-8 text-blue-600 hover:underline font-medium">
          ← Back to Home
        </a>
      </div>
    </main>
  );
}