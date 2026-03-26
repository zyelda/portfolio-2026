import Groq from "groq-sdk";

export async function getStoicQuote() {
    const groq = new Groq({
        apiKey: process.env.GROQ_API_KEY,
    });

    try {
        const prompt = `
            Berikan satu kutipan stoikisme (dari Marcus Aurelius, Seneca, atau Epictetus) 
            yang sudah dimodifikasi sedikit agar relevan dengan perjuangan seorang software developer. 
            Gunakan Bahasa Indonesia yang elegan. 
            Format: "Isi kutipan". Maksimal 25 kata.
        `;

        const completion = await groq.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "llama-3.3-70b-versatile",
            temperature: 0.7,
        });

        return completion.choices[0]?.message?.content || "Hambatan adalah jalan. — Marcus Aurelius";
    } catch (error) {
        console.error("Stoic API Error:", error);
        return "Fokuslah pada apa yang bisa kamu kendalikan. — Seneca";
    }
}