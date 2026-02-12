import Groq from "groq-sdk";

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

export async function generateRepoDescription(repoName: string, originalDesc: string | null) {
    try {
    const prompt = `
        Saya punya project GitHub bernama "${repoName}".
        Deskripsi aslinya: "${originalDesc || "Tidak ada deskripsi"}".

        Tugasmu: Buat ulang deskripsi ini menjadi 1 kalimat pendek (maksimal 20 kata) yang terdengar profesional, canggih, dan teknis untuk portfolio developer. Gunakan Bahasa Indonesia.
        Contoh output: "Sistem deteksi anomali jaringan menggunakan algoritma Random Forest dengan akurasi tinggi."

        Outputkan HANYA kalimat deskripsinya saja. Jangan ada tanda kutip atau intro.
    `;

    const completion = await groq.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "llama-3.3-70b-versatile",
        temperature: 0.5,
    });

    return completion.choices[0]?.message?.content || originalDesc;
    } catch (error) {
    console.error("AI Gen Error:", error);
    return originalDesc || "Project pengembangan perangkat lunak.";
    }
}