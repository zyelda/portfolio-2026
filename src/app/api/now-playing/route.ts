export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const DISCORD_ID = "757546433334214676"; 

    // Hit Lanyard API
    const response = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_ID}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json({ isPlaying: false });
    }

    const { data } = await response.json();

    if (!data || !data.listening_to_spotify || !data.spotify) {
      return NextResponse.json({ isPlaying: false });
    }

    const spotify = data.spotify;

    return NextResponse.json({
      isPlaying: true,
      title: spotify.song,
      artist: spotify.artist,
      album: spotify.album,
      albumImageUrl: spotify.album_art_url,
      songUrl: `https://open.spotify.com/track/${spotify.track_id}`,
    });
  } catch (error) {
    console.error("LANYARD ERROR:", error);
    return NextResponse.json({ isPlaying: false });
  }
}