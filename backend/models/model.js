const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String },
    loginMethod: { type: String, enum: ['local', 'google', 'linkedin'], default: 'local' }
});

const User = mongoose.model("User", userSchema);

const resumeSchema = new mongoose.Schema(
    {
        email: { type: String, required: true },
        resume_id: { type: String, unique: true },
        template: { type: String, default: "SimpleResume" },

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
            name: String,
            email: String,
            phone: String,
            linkedin: String,
            github: String,
            location: String,
            country: String,
        },

        summary: String,

        workExperience: [
            {
                id: String,
                company: String,
                role: String,
                duration: String,
                description: String,
                bulletPoints: [String]
            }
        ],

        education: [
            {
                id: String,
                degree: String,
                institution: String,
                year: String,
                description: String,
                grade: String,
                location: String
            }
        ],

        skills: [
            {
                id: String,
                name: String,
                level: String,
                key: String,
                value: String
            }
        ],

        projects: [
            {
                id: String,
                title: String,
                link: String,
                description: String,
                bulletPoints: [String]
            }
        ],

        achievements: [
            {
                id: String,
                title: String,
                year: String,
                description: String,
                bulletPoints: [String]
            }
        ],

        languages: [
            {
                id: String,
                language: String,
                level: String
            }
        ]
    },
    { timestamps: true }
);

const Resume = mongoose.model("Resume", resumeSchema);

const TempOPT = mongoose.model("TempOPT", new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    otp: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: 300 }
}));

module.exports = {
    User,
    Resume,
    TempOPT
}