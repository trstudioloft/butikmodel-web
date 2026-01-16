const fs = require('fs');
const path = require('path');

// Taranacak dosya uzantıları
const extensions = ['.ts', '.tsx', '.css', '.sql', '.json', '.js'];

// Yoksayılacak klasörler (Gereksiz kalabalık yapmasın)
const ignoreDirs = ['node_modules', '.next', '.git', '.vscode', 'dist', 'build'];

// Çıktı dosyası
const outputFile = 'PROJE_FULL_ANALIZ.txt';

function getAllFiles(dirPath, arrayOfFiles) {
  let files;
  try {
    files = fs.readdirSync(dirPath);
  } catch (e) {
    return arrayOfFiles || [];
  }

  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function(file) {
    if (ignoreDirs.includes(file)) return;
    
    // ". " ile başlayan gizli dosyaları atla (.env hariç)
    if (file.startsWith('.') && file !== '.env.local') return;

    const fullPath = path.join(dirPath, file);

    if (fs.statSync(fullPath).isDirectory()) {
      arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
    } else {
      const ext = path.extname(file);
      // Sadece belirlediğimiz uzantıları al
      if (extensions.includes(ext)) {
        arrayOfFiles.push(fullPath);
      }
    }
  });

  return arrayOfFiles;
}

const allFiles = getAllFiles(__dirname);
let content = `=== BUTIKMODEL.COM DETAYLI PROJE DÖKÜMÜ ===\n`;
content += `Tarih: ${new Date().toLocaleString()}\n`;
content += `Toplam Dosya Sayısı: ${allFiles.length}\n\n`;

allFiles.forEach(file => {
    // Kendisini ve çıktı dosyasını taramasın
    if (file.includes('scan.js') || file.includes(outputFile)) return;
    if (file.includes('package-lock.json')) return; // Çok uzun, gerek yok

    const relativePath = path.relative(__dirname, file);
    
    content += `\n================================================================================\n`;
    content += `DOSYA YOLU: ${relativePath}\n`;
    content += `================================================================================\n`;
    
    try {
        const fileContent = fs.readFileSync(file, 'utf8');
        content += fileContent;
    } catch (e) {
        content += `[HATA: Dosya okunamadı - ${e.message}]`;
    }
    content += `\n\n`;
});

fs.writeFileSync(outputFile, content);
console.log(`✅ DETAYLI TARAMA TAMAMLANDI!`);
console.log(`📂 Tüm kodlar '${outputFile}' dosyasına kaydedildi.`);
console.log(`👉 Bu dosyayı yapay zekaya (bana) gönder.`);