const fs = require('fs');
const path = require('path');

exports.generate = () => new Promise((resolve, reject) => {
    fs.readFile(path.resolve(__dirname, 'PdfGenerator.js'), (err, data) => {
        if (err) reject(err);

        resolve(data);
    });
});