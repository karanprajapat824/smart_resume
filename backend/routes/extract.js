const express = require("express");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");
const textract = require("textract");
const fs = require('fs-extra');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const Router = express.Router();
const { ocrFile, genAI, upload } = require("../utility");


Router.post("/", upload.single("file"), async (req, res) => {
    try {
        const file = req.file;
        if (!file) return res.status(400).json({ message: "No file uploaded" });

        const mime = file.mimetype;
        let text = "";

        const baseTempDir = path.join(process.cwd(), 'temp');
        await fs.ensureDir(baseTempDir);

        const ext = path.extname(file.originalname) || (
            mime === 'application/pdf' ? '.pdf' :
                mime && mime.startsWith('image/') ? (mime.split('/')[1] === 'jpeg' ? '.jpg' : '.' + mime.split('/')[1]) :
                    '.bin'
        );

        const filePath = path.join(baseTempDir, 'upload_' + uuidv4() + ext);
        await fs.writeFile(filePath, file.buffer);

        if (mime === "application/pdf" || file.originalname.toLowerCase().endsWith(".pdf")) {
            const data = await pdfParse(file.buffer);
            if (data && data.text) text = data.text.trim() || "";
            if (text.length < 50) text = await ocrFile(filePath, mime);
            await fs.unlink(filePath);
        } else if (mime === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || file.originalname.toLowerCase().endsWith(".docx")) {
            const result = await mammoth.extractRawText({ buffer: file.buffer });
            text = result.value || "";
        } else if (mime === "text/plain" || file.originalname.toLowerCase().endsWith(".txt")) {
            text = file.buffer.toString("utf8");
        } else {
            try {
                text = await ocrFile(filePath, mime);
                await fs.unlink(filePath);
            } catch (err) {
                text = await new Promise((resolve, reject) => {
                    textract.fromBufferWithMime(file.mimetype, file.buffer, (err, result) => {
                        if (err) return reject(err);
                        resolve(result || "");
                    });
                });
                console.log(err);
            }
        }

        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash-lite-preview-09-2025"
        });

        const prompt = `
            {"id":"","email":"","template":"","order":["PersonalDetails","Summary","WorkExperience","Education","Skills","Projects","Achievements","Languages"],"personalDetails":{"name":"","email":"","phone":"","linkedin":"","github":"","location":"","country":""},"summary":"","workExperience":[{"id":"1","company":"","role":"","duration":"","description":"","bulletPoints":[],"isBulletPoints":false}],"education":[{"id":"1","degree":"","institution":"","year":"","description":"","grade":"","location":""}],"skills":[{"id":"1","name":"","level":"","key":"","value":""}],"projects":[{"id":"1","title":"","link":"","description":"","bulletPoints":[],"isBulletPoints":false}],"achievements":[{"id":"1","title":"","year":"","description":"","bulletPoints":[],"isBulletPoints":false}],"languages":[{"id":"1","language":"","level":""}]} ${text}`;

        const result = await model.generateContent(prompt);
        let responseText = result.response.text();
        responseText = responseText.replace(/```json|```/g, "").trim();

        let parsed;
        try {
            parsed = JSON.parse(responseText);
        } catch (err) {
            console.log("Model did not return valid JSON, sending raw text");
            parsed = responseText;
            return res.status(200).json({ response: parsed });
        }
        res.json({ response: parsed });
    } catch (err) {
        console.error("PDF parsing error:", err);
        res.status(500).json({ message: "Failed to process PDF" });
    }
});

module.exports = Router;