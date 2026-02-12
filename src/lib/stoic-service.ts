import Groq from "groq-sdk";

const groq = new Groq({
    apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY || process.env.GROQ_API_KEY,
    dangerouslyAllowBrowser: true,
});

export async function getStoicQuote() {
    try {
    const prompt = `
        Berikan satu kutipan stoikisme (dari Marcus Aurelius, Seneca, atau Epictetus) 
        yang sudah dimodifikasi sedikit agar relevan dengan perjuangan seorang software developer/programmer. 
        Gunakan Bahasa Indonesia yang elegan dan mendalam. 
        Format: "Isi kutipan" — Tokoh.
        Maksimal 1 paragraf pendek (25 kata).
    `;

    const completion = await groq.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "llama-3.3-70b-versatile",
        temperature: 0.7,
    });

    return completion.choices[0]?.message?.content || "Hambatan dalam bertindak justru memajukan tindakan. Apa yang menghalangi jalan, menjadi jalan itu sendiri. — Marcus Aurelius";
    } catch (error) {
    return "Fokuslah pada apa yang bisa kamu kendalikan: logikamu dan ketenanganmu. — Seneca";
    }
}