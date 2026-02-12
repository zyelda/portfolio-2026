const fs = require('fs');
const path = require('path');

console.log("🔍 DIAGNOSA PATH & FILE");
console.log("=======================");

// 1. Cek Root Directory
const cwd = process.cwd();
console.log(`1. Current Working Directory: ${cwd}`);

// 2. Cek Folder Certificates
const certsDir = path.join(cwd, 'public', 'certificates');
console.log(`2. Target Folder: ${certsDir}`);

if (fs.existsSync(certsDir)) {
    console.log("   ✅ Folder DITEMUKAN.");

    // 3. Cek Isi File
    const files = fs.readdirSync(certsDir);
    console.log(`3. Total File: ${files.length}`);

    files.forEach((file, index) => {
        const filePath = path.join(certsDir, file);
        const stats = fs.statSync(filePath);
        console.log(`   - [${index + 1}] ${file}`);
        console.log(`     Size: ${(stats.size / 1024).toFixed(2)} KB`);
        console.log(`     Is PDF?: ${file.toLowerCase().endsWith('.pdf')}`);
    });
} else {
    console.log("   ❌ Folder TIDAK DITEMUKAN. Cek nama folder 'public/certificates'.");
}
console.log("=======================");