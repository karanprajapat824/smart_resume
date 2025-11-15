const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String},
    loginMethod: { type: String, enum: ['local', 'google','linkedin'], default: 'local' }
});

const User = mongoose.model("User", userSchema);


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