const express = require('express');
const multer = require('multer');
//const Tesseract = require('tesseract.js');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const {createWorker} = require("tesseract.js");

const detectPII = require('./piiDetection');
const calculateRiskScore = require('./riskScorer');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.post('/upload', upload.single('image'), async (req, res) => {

    if (!req.file) {
        console.log("No file received");
        return res.status(400).json({ error: "No file uploaded" });
    }

    const originalPath = req.file.path;
    const processedPath = `${originalPath}_processed.jpg`;

    const handwrittenPath = `${originalPath}_handwritten.jpg`;

    try {

        //image preprocessing 
        await sharp(originalPath)
            //.resize(800)
            .grayscale()
            .normalize()
            //.sharpen() //not great for handwritten docs
            //.gamma(1.5) //could be useful for darker images
            //.threshold(150)
            .toFile(processedPath);

            //different images require diff preprocessing...perhaps I should preprocess images 3 diff ways
            //blurry image, small text images, handwritting images?
            //then apply the piidetection to all 3 preprocessed versions and get the cummulative risk score...covers bases

        //preprocess version 2: for handwritten text
        await sharp(originalPath)
            .grayscale()
            .normalize()
            .sharpen()
            .threshold(150)
            .toFile(handwrittenPath);

        //const imagePath = req.file.path;


        const worker = await createWorker();

        await worker.setParameters({
            tessedit_pageseg_mode: "6"
        });

        const { data: { text: rawText1 } } = await worker.recognize(processedPath);
        const { data: { text: rawText2 } } = await worker.recognize(handwrittenPath);

        await worker.terminate();

        console.log("OCR TEXT 1:", rawText1);
        console.log("OCR TEXT 2:", rawText2);

        //cleaning ocr text
        const cleanText = (text) => {
            return text
                .replace(/[^0-9a-zA-Z@.\-\s]/g, "") // remove weird chars
                .replace(/\s+/g, " ")              // normalize spaces
                .trim();
        };

        const text1 = cleanText(rawText1);
        const text2 = cleanText(rawText2);

        console.log("CLEAN TEXT 1:", text1);
        console.log("CLEAN TEXT 2:", text2);

        //OCR on preprocessed image
        //const result = await Tesseract.recognize(
        //    processedPath,
        //    'eng'
        //);

        //const extractedText = result.data.text;


        // pii detection
        //const piiResults = detectPII(extractedText);

        const piiResults1 = detectPII(text1);
        const piiResults2 = detectPII(text2);

        console.log("PII 1:", piiResults1);
        console.log("PII 2:", piiResults2);

        const mergedPII = {
            emails: [...new Set([...(piiResults1.emails || []), ...(piiResults2.emails || [])])],
            phoneNumbers: [...new Set([...(piiResults1.phoneNumbers || []), ...(piiResults2.phoneNumbers || [])])],
            ssns: [...new Set([...(piiResults1.ssns || []), ...(piiResults2.ssns || [])])]
        };


        // risk scoring
        //const riskScore = calculateRiskScore(piiResults);
        const riskScore = calculateRiskScore(mergedPII);


        //res.json({
        //    message: "OCR complete",
        //    text: extractedText,
        //    pii: piiResults.piiSummary,
        //    rawPII: piiResults,
        //    riskScore: riskScore
        //});


        res.json({
            text: text1 + "\n---\n" + text2,
            pii: mergedPII,
            riskScore: riskScore
        });


    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "OCR failed" });
    } finally {
        //clean up files 
        try {
            if (fs.existsSync(originalPath)) fs.unlinkSync(originalPath);
            if (fs.existsSync(processedPath)) fs.unlinkSync(processedPath);
            if (fs.existsSync(handwrittenPath)) fs.unlinkSync(handwrittenPath);
        } catch (cleanupError) {
            console.error("Cleanup error: ", cleanupError);
        }
    }
});

//adds note on http://localhost:3000/ that the server is running
app.get('/', (req, res) => {
    res.send('Server is running');
});


//runs when running node ./mainServer.js
//app.listen(3000, () => {
//    console.log("Server running on port 3000");
//});

app.listen(3000, "0.0.0.0", () => {
    console.log("Server running on port 3000");
});