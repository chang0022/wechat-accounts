'use strict'

const fs = require('fs');

exports.readFileAsync = (fpath, encodning) => {
    return new Promise((resolve, reject) => {
        fs.readFile(fpath, encodning, (err, content) => {
            if (err) reject(err);
            else resolve(content);
        });
    });
}

exports.writeFileAsync = (fpath, content) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(fpath, content, (err) => {
            if (err) reject(err);
            else resolve();
        });
    });
}