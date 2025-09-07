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


const app = express();
app.use(bodyParser.json());
app.use(cors());

const upload = multer({ storage: multer.memoryStorage() });
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.log("MongoDB connection error:", err));

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

const resumeSchema = new mongoose.Schema({
    email: String,
    template: String,
    personalDetails: {
        name: { type: String, required: true },
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
            id: { type: String, required: true },
            company: { type: String, required: true },
            role: { type: String, required: true },
            duration: { type: String },
            description: { type: String },
            bulletPoints: [{ type: String }],
            isBulletPoints: { type: Boolean, default: true },
        },
    ],

    education: [
        {
            id: { type: String, required: true },
            degree: { type: String, required: true },
            institution: { type: String, required: true },
            year: { type: String },
            description: { type: String },
            grade: { type: String },
            location: { type: String },
        },
    ],

    skills: [
        {
            id: { type: String, required: true },
            name: { type: String, required: true },
            level: { type: String },
            key: { type: String },
            value: { type: String },
        },
    ],

    projects: [
        {
            id: { type: String, required: true },
            title: { type: String, required: true },
            link: { type: String },
            description: { type: String },
            bulletPoints: [{ type: String }],
            isBulletPoints: { type: Boolean, default: true },
        },
    ],

    achievements: [
        {
            id: { type: String, required: true },
            title: { type: String, required: true },
            year: { type: String },
            description: { type: String },
            bulletPoints: [{ type: String }],
            isBulletPoints: { type: Boolean, default: true },
        },
    ],

    languages: [
        {
            id: { type: String, required: true },
            language: { type: String, required: true },
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

        const token = jwt.sign({ email: newUser.email }, process.env.SECRET_KEY, { expiresIn: "1h" });

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

        const token = jwt.sign({ id: user._id, email: user.email }, process.env.SECRET_KEY, { expiresIn: "1h" });

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
            data: resumes,
        });
    } catch (err) {
        res.status(500).json({ message: "Error fetching resumes", error: err.message });
    }
});


app.post("/upload-file", upload.single("file"), async (req, res) => {
    try {
        const file = req.file;
        if (!file) return res.status(400).json({ message: "No file uploaded" });

        const mime = file.mimetype;
        let text = "";

        if (mime === "application/pdf" || file.originalname.toLowerCase().endsWith(".pdf")) {
            const data = await pdfParse(file.buffer);
            text = data.text || "";
        } else if (mime === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || file.originalname.toLowerCase().endsWith(".docx")) {
            const result = await mammoth.extractRawText({ buffer: file.buffer });
            text = result.value || "";
        } else if (mime === "text/plain" || file.originalname.toLowerCase().endsWith(".txt")) {
            text = file.buffer.toString("utf8");
        } else {
            text = await new Promise((resolve, reject) => {
                textract.fromBufferWithMime(file.mimetype, file.buffer, (err, result) => {
                    if (err) return reject(err);
                    resolve(result || "");
                });
            });
        }



        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
You are a helpful assistant that extracts structured resume data.

I will give you the raw text of a resume.  
Your task: Fill the following JSON object with data extracted from the resume.

If some information is unavailable, keep the field as an empty string "" or empty array [].
Do not add extra fields, explanations, or text. Return only valid JSON.

Here is the JSON object schema you must follow:
{
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
            console.warn("Model did not return valid JSON, sending raw text");
            parsed = responseText;
        }

        res.json({ response: parsed });
    } catch (err) {
        console.error("PDF parsing error:", err);
        res.status(500).json({ message: "Failed to process PDF" });
    }
});


app.listen(5000, () => console.log("Server running on http://localhost:5000"));
