const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const cors = require("cors");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const mammoth = require("mammoth");
const textract = require("textract");
const fs = require('fs-extra');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { base } = require("framer-motion/client");
const FormData = require("form-data");


const app = express();
app.use(bodyParser.json());
app.use(cors());

const upload = multer({ storage: multer.memoryStorage() });
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);
const extractTextAi = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY_2);


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

        const prompt = `Extract only the complete and accurate text content from the given image or PDF.

Do not include any descriptions, explanations, or formatting unless it is part of the original text.

Preserve the original order, line breaks, and spacing as much as possible.

Ignore any irrelevant graphics, borders, or background elements.

Return only the extracted text, nothing else.`

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


mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.log("MongoDB connection error:", err));

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

const resumeSchema = new mongoose.Schema({
    email: { type: String },
    template: String,
    id: { type: String, unique: true },
    order: {
        type: [String],
        default: [
            "PersonalDetails",
            "Summary",
            "WorkExperience",
            "Education",
            "Skills",
            "Projects",
            "Achievements",
            "Languages"
        ]
    },
    personalDetails: {
        name: { type: String },
        email: { type: String },
        phone: { type: String },
        linkedin: { type: String },
        github: { type: String },
        location: { type: String },
        country: { type: String },
    },

    summary: { type: String },

    workExperience: [
        {
            id: { type: String },
            company: { type: String },
            role: { type: String },
            duration: { type: String },
            description: { type: String },
            bulletPoints: [{ type: String }],
            isBulletPoints: { type: Boolean, default: false },
        },
    ],

    education: [
        {
            id: { type: String },
            degree: { type: String },
            institution: { type: String },
            year: { type: String },
            description: { type: String },
            grade: { type: String },
            location: { type: String },
        },
    ],

    skills: [
        {
            id: { type: String },
            name: { type: String },
            level: { type: String },
            key: { type: String },
            value: { type: String },
        },
    ],

    projects: [
        {
            id: { type: String },
            title: { type: String },
            link: { type: String },
            description: { type: String },
            bulletPoints: [{ type: String }],
            isBulletPoints: { type: Boolean, default: false },
        },
    ],

    achievements: [
        {
            id: { type: String },
            title: { type: String },
            year: { type: String },
            description: { type: String },
            bulletPoints: [{ type: String }],
            isBulletPoints: { type: Boolean, default: false },
        },
    ],

    languages: [
        {
            id: { type: String },
            language: { type: String },
            level: { type: String },
        },
    ],
}, { timestamps: true });


const User = mongoose.model("User", userSchema);
const Resume = mongoose.model("Resume", resumeSchema);


function authenticateToken(req, res, next) {
    const token = req.headers["authorization"];
    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }
    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).json({ message: "Invalid token", error: err.message });
    }
}

app.get("/verifyToken", authenticateToken, async (req, res) => {
    res.status(200).json({ message: "success", email: req.user.email });
})

app.post("/signup", async (req, res) => {
    try {
        const { email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ email, password: hashedPassword });
        await newUser.save();

        const token = jwt.sign({ email: newUser.email }, process.env.SECRET_KEY);

        res.json({ message: "User registered successfully", token });
    } catch (err) {
        res.status(500).json({ message: "Error in registration", error: err.message });
    }
});

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid email or password" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

        const token = jwt.sign({ id: user._id, email: user.email }, process.env.SECRET_KEY);

        res.json({ message: "Login successful", token });
    } catch (err) {
        res.status(500).json({ message: "Error in login", error: err.message });
    }
});

app.get("/resumes", authenticateToken, async (req, res) => {
    try {
        const { email } = req.user;

        if (!email) {
            return res.status(400).json({ message: "Email not found in token" });
        }

        const resumes = await Resume.find({ email });

        res.json({
            message: "Resumes fetched successfully",
            count: resumes.length,
            resumes: resumes,
        });
    } catch (err) {
        res.status(500).json({ message: "Error fetching resumes", error: err.message });
    }
});

app.post("/save-resume", authenticateToken, async (req, res) => {
    try {
        let resumeData = req.body;
        resumeData.email = req.user.email;

        let updatedResume;

        if (resumeData.id) {
            updatedResume = await Resume.findOneAndUpdate(
                { id: resumeData.id },
                resumeData
            );
        } else {
            const newResume = new Resume(resumeData);
            newResume.id = newResume._id.toString();
            updatedResume = await newResume.save();
        }

        res.status(200).json({
            message: "Resume saved successfully",
            resume: updatedResume,
        });
    } catch (error) {
        console.error("Error saving resume:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

app.post("/upload-file", upload.single("file"), async (req, res) => {
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
You are a helpful assistant that extracts structured resume data.

I will give you the raw text of a resume.  
Your task: Fill the following JSON object with data extracted from the resume.

If some information is unavailable, keep the field as an empty string "" or empty array [] or same data.
Do not add extra fields, explanations, or text. Return only valid JSON.

Here is the JSON object schema you must follow:
{
"id" : "",
"email" : "",
"template" : "",
"order" : [
    "PersonalDetails",
      "Summary",
      "WorkExperience",
      "Education",
      "Skills",
      "Projects",
      "Achievements",
      "Languages"
],
  "personalDetails": {
    "name": "",
    "email": "",
    "phone": "",
    "linkedin": "",
    "github": "",
    "location": "",
    "country": ""
  },
  "summary": "",
  "workExperience": [
    {
      "id": "1",
      "company": "",
      "role": "",
      "duration": "",
      "description": "",
      "bulletPoints": [],
      "isBulletPoints": false
    }
  ],
  "education": [
    {
      "id": "1",
      "degree": "",
      "institution": "",
      "year": "",
      "description": "",
      "grade": "",
      "location": ""
    }
  ],
  "skills": [
    {
      "id": "1",
      "name": "",
      "level": "",
      "key": "",
      "value": ""
    }
  ],
  "projects": [
    {
      "id": "1",
      "title": "",
      "link": "",
      "description": "",
      "bulletPoints": [],
      "isBulletPoints": false
    }
  ],
  "achievements": [
    {
      "id": "1",
      "title": "",
      "year": "",
      "description": "",
      "bulletPoints": [],
      "isBulletPoints": false
    }
  ],
  "languages": [
    {
      "id": "1",
      "language": "",
      "level": ""
    }
  ]
}

Resume text:
${text}
    `;
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

app.delete("/deleteResume", authenticateToken, async (req, res) => {
    try {
        const { id } = req.body;

        if (!id) {
            return res.status(400).json({ message: "Resume ID is required" });
        }

        const deletedResume = await Resume.findByIdAndDelete(id);

        if (!deletedResume) {
            return res.status(404).json({ message: "Resume not found" });
        }

        res.status(200).json({ message: "Resume deleted successfully", deletedResume });
    } catch (error) {
        console.error("Error deleting resume:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

app.get("/temp", async (req, res) => {
    const data = await Resume.find({});
    res.send(data);
})

app.listen(5000, () => console.log("Server running on http://localhost:5000"));
