const fs = require('fs');
const path = require('path');
const { Groq } = require('groq-sdk');
require('dotenv').config({ path: '.env.local' });

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const certsDir = path.join(process.cwd(), 'public', 'certificates');
const outputFile = path.join(process.cwd(), 'src', 'data', 'certificates.json');

async function scanCertificates() {
  console.log("🚀 [AI Scanner] Memulai sistem (Mode Fail-Safe)...");
  
  if (!fs.existsSync(certsDir)) {
    console.log("❌ Folder 'public/certificates' tidak ditemukan!");
    return;
  }

  const files = fs.readdirSync(certsDir).filter(f => f.endsWith('.pdf'));
  
  if (files.length === 0) {
    console.log("⚠️ Tidak ada file PDF. Tambahkan file ke public/certificates.");
    return;
  }

  const certsData = [];

  // Load Library PDF (Try-Catch agar tidak fatal error)
  let pdfParser = null;
  try {
    pdfParser = require('pdf-parse');
  } catch (e) {
    console.log("⚠️ Library PDF tidak kompatibel. Beralih ke mode Analisis Nama File.");
  }

  for (const file of files) {
    console.log(`\n📄 Memproses: ${file}`);
    const filePath = path.join(certsDir, file);
    let rawText = "";
    let parsingSuccess = false;

    // 1. COBA BACA ISI PDF
    if (pdfParser) {
      try {
        const dataBuffer = fs.readFileSync(filePath);
        const data = await pdfParser(dataBuffer);
        rawText = data.text.slice(0, 1500).replace(/\s+/g, " ");
        parsingSuccess = true;
      } catch (err) {
        console.log(`   ⚠️ Gagal baca isi teks (${err.message}). Menggunakan Nama File.`);
      }
    }

    // 2. JIKA GAGAL, GUNAKAN NAMA FILE SEBAGAI DATA
    if (!parsingSuccess || !rawText.trim()) {
      rawText = `Nama File Sertifikat: ${file}`;
    }

    // 3. KIRIM KE AI (GROQ)
    try {
        const prompt = `
          Tugas: Buat data JSON untuk sertifikat portfolio.
          Sumber Data: "${rawText}"

          Jika sumber data hanya berisi "Nama File", TEBAK detailnya seakurat mungkin berdasarkan nama tersebut.

          Format JSON Wajib:
          {
            "title": "Nama Sertifikat (Jika ragu, rapikan dari nama file)",
            "issuer": "Penerbit (Tebak dari konteks, misal: Dicoding, Google, Udemy, Coursera)",
            "date": "Tahun (YYYY) - Default: 2026",
            "description": "Deskripsi singkat skill (max 12 kata, Bahasa Indonesia)",
            "color": "pilih acak: from-blue-500 to-cyan-500, from-purple-500 to-pink-500, from-green-500 to-emerald-500, from-orange-500 to-yellow-500"
          }
        `;

        const completion = await groq.chat.completions.create({
          messages: [{ role: "user", content: prompt }],
          model: "llama-3.3-70b-versatile",
          response_format: { type: "json_object" }
        });

        const aiContent = completion.choices[0].message.content;
        const aiData = JSON.parse(aiContent);
        
        certsData.push({ ...aiData, file: `/certificates/${file}` });
        
        console.log(`   ✅ SUKSES: ${aiData.title}`);
    
    } catch (aiError) {
        console.error(`   ❌ Gagal koneksi AI: ${aiError.message}`);
    }
  }

  // 4. SIMPAN DATA (Apapun hasilnya)
  const dataDir = path.dirname(outputFile);
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  
  fs.writeFileSync(outputFile, JSON.stringify(certsData, null, 2));
  console.log(`\n✨ SELESAI! ${certsData.length} sertifikat tersimpan di src/data/certificates.json`);
}

scanCertificates();