const express = require("express");
const { authenticateToken } = require("../middleware/auth");
const { Resume } = require("../models/model");
const Router = express.Router();
    
Router.get("/", authenticateToken, async (req, res) => {
    try {
        const { email } = req.user;
        console.log("Fetching resumes for email:", email);
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
        const { id } = req.body;

        if (!id) {
            return res.status(400).json({ message: "Resume Id not found" });
        }

        console.log(id);
        const result = await Resume.deleteOne({ _id: id });
        console.log(result);

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

        const resume = await Resume.findById(id);
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