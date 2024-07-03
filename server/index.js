const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 5005;

const jsonDirectory = path.join(__dirname, 'json');

// Endpoint to list all JSON files
app.get('/json', (req, res) => {
    fs.readdir(jsonDirectory, (err, files) => {
        if (err) {
            return res.status(500).send('Unable to scan directory');
        }
        res.json(files.filter(file => file.endsWith('.json')));
    });
});

// Endpoint to get the content of a specific JSON file
app.get('/json/:fileName', (req, res) => {
    const fileName = req.params.fileName;
    const filePath = path.join(jsonDirectory, fileName);

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Unable to read file');
        }
        res.json(JSON.parse(data));
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
