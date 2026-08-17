export async function getLatestYouTubeVideos(maxResults = 3) {
  const API_KEY = process.env.YOUTUBE_API_KEY;
  const CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID;

  if (!API_KEY || !CHANNEL_ID) {
    console.warn("YouTube API keys are missing. Check your .env.local file.");
    return [];
  }

  try {
    // 1. Get the official "Uploads" playlist ID for your channel
    const channelRes = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${CHANNEL_ID}&key=${API_KEY}`,
      { next: { revalidate: 3600 } } // Updates every 1 hour automatically
    );
    const channelData = await channelRes.json();
    
    if (!channelData.items || channelData.items.length === 0) return [];
    
    const uploadsPlaylistId = channelData.items[0].contentDetails.relatedPlaylists.uploads;

    // 2. Fetch the latest videos from that playlist
    const playlistRes = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=${maxResults}&key=${API_KEY}`,
      { next: { revalidate: 3600 } }
    );
    const playlistData = await playlistRes.json();

    // 3. Clean up the data so it's easy for our Homepage to read
    return playlistData.items.map((item: any) => ({
      _id: item.snippet.resourceId.videoId,
      title: item.snippet.title,
      imageUrl: item.snippet.thumbnails.maxres?.url || item.snippet.thumbnails.high?.url,
      youtubeLink: `https://www.youtube.com/watch?v=${item.snippet.resourceId.videoId}`,
    }));
  } catch (error) {
    console.error("Error fetching YouTube videos:", error);
    return [];
  }
}