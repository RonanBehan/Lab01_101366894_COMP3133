const fs = require('fs');
const csv = require('csv-parser');

const inputFile = './input_countries.csv';
const canadaFile = './canada.txt';
const usaFile = './usa.txt';

[canadaFile, usaFile].forEach((file) => {
    if (fs.existsSync(file)) {
        fs.unlinkSync(file);
        console.log(`Deleted existing file: ${file}`);
    }
});

const canadaStream = fs.createWriteStream(canadaFile, { flags: 'a' });
const usaStream = fs.createWriteStream(usaFile, { flags: 'a' });

const headers = 'country,year,population\n';
canadaStream.write(headers);
usaStream.write(headers);

fs.createReadStream(inputFile)
    .pipe(csv())
    .on('data', (row) => {
        if (row.country.toLowerCase() === 'canada') {
            canadaStream.write(`${row.country},${row.year},${row.population}\n`);
        } else if (row.country.toLowerCase() === 'united states') {
            usaStream.write(`${row.country},${row.year},${row.population}\n`);
        }
    })
    .on('end', () => {
        console.log('CSV file successfully processed.');
        canadaStream.end();
        usaStream.end();
    })
    .on('error', (err) => {
        console.error(`Error reading CSV file: ${err.message}`);
    });
