const fs = require('fs-extra');
const dotenv = require('dotenv');
const multer = require("multer");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const nodemailer = require('nodemailer');
dotenv.config();


const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);
const extractTextAi = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY_2);
const upload = multer({ storage: multer.memoryStorage() });


async function ocrFile(filePath, mimeType = "application/pdf") {

    if (!fs.existsSync(filePath)) {
        throw new Error('File not found: ' + filePath);
    }
    try {
        const model = extractTextAi.getGenerativeModel({
            model: "gemini-2.5-flash-lite-preview-09-2025"
        });

        const fileBuffer = fs.readFileSync(filePath);
        const base64Data = fileBuffer.toString("base64");

        const prompt = `${process.env.PROMPT_2}`
        const result = await model.generateContent([
            prompt,
            {
                inlineData: {
                    data: base64Data,
                    mimeType: mimeType,
                },
            },
        ]);
        return result.response.text().trim();
    } catch (err) {
        console.log("error while extracttext using orc: " + err);
        return "";
    }
}

const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});


module.exports = {
    ocrFile,
    extractTextAi,
    genAI,
    upload,
    transporter
};