import { NextResponse } from "next/server";

export async function GET() {
  const API_KEY = process.env.WAKATIME_API_KEY;
  
  if (!API_KEY) {
    return NextResponse.json({ error: "API Key missing" }, { status: 500 });
  }

  try {
    // Mengambil data 7 hari terakhir
    const response = await fetch(
      `https://wakatime.com/api/v1/users/current/stats/last_7_days?api_key=${API_KEY}`,
      { next: { revalidate: 3600 } } // Cache selama 1 jam biar loading cepat
    );

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch Wakatime" }, { status: 500 });
  }
}