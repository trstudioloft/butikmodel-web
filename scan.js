const fs = require('fs');
const path = require('path');

// Taranacak dosya uzantıları
const extensions = ['.ts', '.tsx', '.css', '.sql'];

// Yoksayılacak klasörler
const ignoreDirs = ['node_modules', '.next', '.git', 'public', '.vscode'];

const outputFile = 'PROJE_KODLARI.txt';

function getAllFiles(dirPath, arrayOfFiles) {
  files = fs.readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function(file) {
    if (ignoreDirs.includes(file)) return;
    
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
    } else {
      const ext = path.extname(file);
      if (extensions.includes(ext)) {
        arrayOfFiles.push(path.join(dirPath, "/", file));
      }
    }
  });

  return arrayOfFiles;
}

const allFiles = getAllFiles(__dirname);
let content = "=== BUTIKMODEL.COM PROJE KODLARI ===\n\n";

allFiles.forEach(file => {
    // Sadece scan.js ve çıktı dosyasını hariç tut
    if (file.includes('scan.js') || file.includes(outputFile)) return;

    const relativePath = path.relative(__dirname, file);
    content += `\n\n--- DOSYA BAŞLANGICI: ${relativePath} ---\n`;
    content += fs.readFileSync(file, 'utf8');
    content += `\n--- DOSYA SONU: ${relativePath} ---\n`;
});

fs.writeFileSync(outputFile, content);
console.log(`✅ Tarama tamamlandı! Tüm kodlar '${outputFile}' dosyasına kaydedildi.`);