const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { User } = require("../models/model");
const { authenticateToken } = require("../middleware/auth");
const Router = express.Router();

Router.get("/verifyToken", authenticateToken, async (req, res) => {
    res.status(200).json({ message: "success", email: req.user.email });
});

Router.post("/signup", async (req, res) => {
    try {
        const { email, password } = req.body;
        const existingUser = await User.findOne({ email: email.toLowerCase() });

        if (existingUser) return res.status(400).json({ message: "An account with this email already exists. Try logging in instead." });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ email: email.toLowerCase(), password: hashedPassword });
        await newUser.save();

        const token = jwt.sign({ email: newUser.email }, process.env.SECRET_KEY);

        res.json({ message: "User registered successfully", token });
    } catch (err) {
        res.status(500).json({ message: "Internal server error. Please try again later.", error: err.message });
    }
});

Router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) return res.status(400).json({ message: "No account found with that email address." });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid password" });

        const token = jwt.sign({ id: user._id, email: user.email }, process.env.SECRET_KEY);

        res.json({ message: "Login successful", token });
    } catch (err) {
        res.status(500).json({ message: "Error in login", error: err.message });
    }
});



module.exports = Router;