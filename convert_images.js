const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const imgDir = path.join(__dirname, 'images');
const files = fs.readdirSync(imgDir);

files.forEach(file => {
    if (file.toLowerCase().endsWith('.jpeg') || file.toLowerCase().endsWith('.jpg')) {
        const inputPath = path.join(imgDir, file);
        const outputPath = path.join(imgDir, path.basename(file, path.extname(file)) + '.webp');

        console.log(`Processing ${file}...`);

        sharp(inputPath)
            .resize(1920, null, { // Width 1920, auto height
                withoutEnlargement: true
            })
            .webp({ quality: 75 })
            .toFile(outputPath)
            .then(() => {
                console.log(`Converted: ${file} -> ${path.basename(outputPath)}`);
                // Optional: Delete original
                // fs.unlinkSync(inputPath);
            })
            .catch(err => {
                console.error(`Error converting ${file}:`, err);
            });
    }
});
