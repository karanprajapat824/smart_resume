const fs = require('fs-extra');
const dotenv = require('dotenv');
const multer = require("multer");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const nodemailer = require('nodemailer');
dotenv.config();


const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);
const extractTextAi = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY_2);
const upload = multer({ storage: multer.memoryStorage() });

const promtForFormat = `
{"id":"","email":"","template":"","order":["PersonalDetails","Summary","WorkExperience","Education","Skills","Projects","Achievements","Languages"],"personalDetails":{"name":"","email":"","phone":"","linkedin":"","github":"","location":"","country":""},"summary":"","workExperience":[{"id":"1","company":"","role":"","duration":"","description":"","bulletPoints":[],"isBulletPoints":false}],"education":[{"id":"1","degree":"","institution":"","year":"","description":"","grade":"","location":""}],"skills":[{"id":"1","name":"","level":"","key":"","value":""}],"projects":[{"id":"1","title":"","link":"","description":"","bulletPoints":[],"isBulletPoints":false}],"achievements":[{"id":"1","title":"","year":"","description":"","bulletPoints":[],"isBulletPoints":false}],"languages":[{"id":"1","language":"","level":""}]}
`


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

        const prompt = `Extract only the complete and accurate text content from the given image or PDF. Do not include any descriptions, explanations, or formatting unless it is part of the original text. Preserve the original order, line breaks, and spacing as much as possible. Ignore any irrelevant graphics, borders, or background elements. Return only the extracted text, nothing else.`
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