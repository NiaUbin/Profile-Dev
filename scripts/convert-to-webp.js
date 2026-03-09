/**
 * แปลงรูปโปรไฟล์ JPG → WebP
 * วิธีใช้: node scripts/convert-to-webp.js
 */
const sharp = require('sharp');
const path = require('path');

const inputFile = path.join(__dirname, '..', 'public', 'S__50872323.jpg');
const outputFile = path.join(__dirname, '..', 'public', 'profile.webp');

sharp(inputFile)
  .webp({ quality: 80 })
  .toFile(outputFile)
  .then(info => {
    console.log('✅ แปลงสำเร็จ!');
    console.log(`   ไฟล์: ${outputFile}`);
    console.log(`   ขนาด: ${(info.size / 1024).toFixed(1)} KB`);
    console.log(`   ${info.width}x${info.height}`);
  })
  .catch(err => {
    console.error('❌ เกิดข้อผิดพลาด:', err.message);
  });
