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

Router.post("/save", authenticateToken, async (req, res) => {
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

Router.delete("/delete", authenticateToken, async (req, res) => {
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





module.exports = Router;