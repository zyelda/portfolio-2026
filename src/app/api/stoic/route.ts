import { getStoicQuote } from "@/lib/stoic-service";
import { NextResponse } from "next/server";

// Pakai fitur bawaan Next.js buat nge-cache hasil API selama 1 jam (3600 detik)
export const revalidate = 3600; 

export async function GET() {
    try {
        const quote = await getStoicQuote();
        
        // Cek kalau yang balik itu pesan error default karena rate limit
        if (quote.includes("Fokuslah pada apa yang bisa kamu kendalikan")) {
             return NextResponse.json({ quote }, { status: 200 });
        }

        return NextResponse.json({ quote });
    } catch (error) {
        // Fallback kalau Groq bener-bener mati/limit
        return NextResponse.json({ 
            quote: "Hambatan adalah jalan. Tetaplah coding meski kuota limit. — Marcus Aurelius" 
        });
    }
}