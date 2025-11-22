const express = require("express");
const { authenticateToken } = require("../middleware/auth");
const { Resume } = require("../models/model");
const Router = express.Router();

Router.get("/", authenticateToken, async (req, res) => {
    try {
        const { email } = req.user;

        if (!email) {
            return res.status(400).json({ message: "Email not found in token" });
        }

        const resumes = await Resume.find({ email: email.toLowerCase() });

        res.json({
            message: "Resumes fetched successfully",
            count: resumes.length,
            resumes: resumes,
        });
    } catch (err) {
        res.status(500).json({ message: "Error fetching resumes", error: err.message });
    }
});

Router.delete("/", authenticateToken, async (req, res) => {
    try {
        const { resume_id } = req.body;

        if (!resume_id) {
            return res.status(400).json({ message: "Resume Id not found" });
        }
        const result = await Resume.deleteOne({ resume_id });

        if (result.deletedCount > 0) {
            return res.json({ message: "Resume deleted successfully" });
        }

        return res.status(400).json({ message: "No resume found or deletion failed" });

    } catch (err) {
        return res.status(500).json({ message: "Error deleting resume", error: err.message });
    }
});

Router.get("/:id", authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: "Resume Id not provided" });
        }

        const resume = await Resume.findOne({ resume_id : id });
        if (!resume) {
            return res.status(404).json({ message: "Resume not found" });
        }

        return res.json({ resume });

    } catch (err) {
        return res.status(500).json({
            message: "Error fetching resume",
            error: err.message
        });
    }
});


Router.post("/save", authenticateToken, async (req, res) => {
    try {
        const resumeData = req.body.resumeData;

        if (!req.user?.email) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        if (!resumeData.resume_id) {
            resumeData.resume_id = Date.now().toString();
        }

        resumeData.email = req.user.email.toLowerCase();

        const updatedResume = await Resume.findOneAndUpdate(
            { resume_id: resumeData.resume_id },
            { $set: resumeData },
            { upsert: true, new: true }
        );

        return res.status(200).json({
            message: "Resume saved successfully",
            resume: updatedResume,
        });

    } catch (error) {
        console.error("Error saving resume:", error);
        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
});


module.exports = Router;