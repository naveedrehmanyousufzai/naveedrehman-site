export default function TournamentPage() {
  return (
    <main className="max-w-4xl mx-auto p-12">
      <h1 className="text-4xl font-bold mb-6">June 2026 Sanctioned Tournament</h1>
      <p className="text-xl text-gray-600 mb-8">Date: June 8, 2026</p>
      
      <div className="bg-white p-6 border rounded-lg shadow-sm">
        <h2 className="text-2xl font-semibold mb-4">Event Details</h2>
        <p className="text-gray-700">
          This is where you will list the tournament schedule, venue information, 
          registration requirements, and any other relevant details for participants.
        </p>
      </div>

      <a href="/" className="inline-block mt-8 text-blue-600 hover:underline">
        ← Back to Home
      </a>
    </main>
  );
}