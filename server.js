const express = require("express");
const fileUpload = require("express-fileupload");
const pdfParse = require("pdf-parse");
const bodyParser = require('body-parser');
const path = require("path");

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'AutthenTextAI-NEU/ATAI-Interface/Homepage')));

app.use(express.static(path.join(__dirname, 'AutthenTextAI-NEU/ATAI-Interface/Product')));

app.use(express.static(path.join(__dirname, 'AutthenTextAI-NEU/ATAI-Interface/ATAI_Information')));




app.use(fileUpload());
app.use(bodyParser.json());

app.post("/upload-file", async (req, res) => {
    try {
        if (!req.files || !req.files.pdfFile) {
            res.status(400).send("No PDF file uploaded.");
            return;
        }

        const pdfFile = req.files.pdfFile;

        const result = await pdfParse(pdfFile.data);
        const extractedText = result.text.trim(); 

        res.send(extractedText);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/api/detect/detectText', async (req, res) => {
    try {
        const inputText = req.body.input_text;
        const apiKey = "14b71190-ab93-4e5e-a23f-065f09544d42"; // Replace with your API key
        const apiUrl = "https://api.zerogpt.com/api/detect/detectText";

        const fetch = await import('node-fetch').then(mod => mod.default);
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'ApiKey': apiKey
            },
            body: JSON.stringify({ input_text: inputText })
        });
        
        const data = await response.text();
        res.send(data);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
