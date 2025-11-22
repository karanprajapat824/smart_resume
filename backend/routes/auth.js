const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { User, TempOPT } = require("../models/model");
const { authenticateToken } = require("../middleware/auth");
const Router = express.Router();
const axios = require("axios");
const crypto = require("crypto");
const { transporter } = require("../utility");


Router.get("/google", async (req, res) => {
    const redirect_uri = `${process.env.SERVER_URL}/auth/google/callback`;
    const scope = [
        "https://www.googleapis.com/auth/userinfo.email",
        "https://www.googleapis.com/auth/userinfo.profile"
    ].join(" ");
    const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${redirect_uri}&response_type=code&scope=${scope}&access_type=offline`;
    res.redirect(url);
});

Router.get("/google/callback", async (req, res) => {
    const code = req.query.code;

    try {

        const { data } = await axios.post("https://oauth2.googleapis.com/token", {
            code,
            client_id: process.env.GOOGLE_CLIENT_ID,
            client_secret: process.env.GOOGLE_CLIENT_SECRET,
            redirect_uri: `${process.env.SERVER_URL}/auth/google/callback`,
            grant_type: "authorization_code",
        });

        const { access_token } = data;

        const { data: userInfo } = await axios.get(
            "https://www.googleapis.com/oauth2/v3/userinfo",
            { headers: { Authorization: `Bearer ${access_token}` } }
        );

        if (!userInfo.email_verified) {
            return res.redirect(`${process.env.CLIENT_URL}/login?error=email_not_verified`);
        }

        let user = await User.findOne({ email: userInfo.email.toLowerCase() });

        if (!user) {
            user = new User({
                email: userInfo.email.toLowerCase(),
                password: null,
                loginMethod: "google",
            });
            await user.save();
        }

        const accessToken = jwt.sign(
            { id: user._id, email: user.email },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "15m" }
        );

        const refreshToken = jwt.sign(
            { id: user._id, email: user.email },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: "7d" }
        );

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            path: "/",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.redirect(`${process.env.CLIENT_URL}/`);

    } catch (err) {
        console.error("Google OAuth error:", err);
        return res.redirect(`${process.env.CLIENT_URL}/login?error=google_auth_failed`);
    }
});

Router.get("/linkedin", (req, res) => {
    const state = crypto.randomBytes(16).toString("hex");
    res.cookie("li_oauth_state", state, {
        httpOnly: false,
        sameSite: "lax",
        secure: false,
        maxAge: 10 * 60 * 1000
    });
    const params = new URLSearchParams({
        response_type: "code",
        client_id: process.env.LINKEDIN_CLIENT_ID,
        redirect_uri: process.env.LINKEDIN_REDIRECT_URI,
        scope: (process.env.LINKEDIN_SCOPES || "r_emailaddress").replace(/\s+/g, " "),
        state
    });
    res.redirect(`https://www.linkedin.com/oauth/v2/authorization?${params.toString()}`);
});

Router.get("/linkedin/callback", async (req, res) => {
    try {
        if (req.query.error) {
            console.error("LinkedIn error:", req.query.error, req.query.error_description);
            return res.redirect(`${process.env.CLIENT_URL}/login?error=linkedin_auth_failed`);
        }

        const { code, state } = req.query;

        const savedState = req.cookies?.li_oauth_state;
        if (!code || !state || state !== savedState) {
            return res.redirect(`${process.env.CLIENT_URL}/login?error=linkedin_auth_failed`);
        }

        const tokenParams = new URLSearchParams({
            grant_type: "authorization_code",
            code,
            redirect_uri: process.env.LINKEDIN_REDIRECT_URI,
            client_id: process.env.LINKEDIN_CLIENT_ID,
            client_secret: process.env.LINKEDIN_CLIENT_SECRET,
        });

        const tokenResp = await axios.post(
            "https://www.linkedin.com/oauth/v2/accessToken",
            tokenParams.toString(),
            { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
        );

        const accessToken = tokenResp.data.access_token;
        if (!accessToken) {
            return res.redirect(`${process.env.CLIENT_URL}/login?error=linkedin_auth_failed`);
        }

        const userinfo = await axios.get("https://api.linkedin.com/v2/userinfo", {
            headers: { Authorization: `Bearer ${accessToken}` },
        });

        const email = userinfo.data?.email;

        if (!email) {
            return res.redirect(`${process.env.CLIENT_URL}/login?error=email_not_verified`);
        }

        let user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
            user = new User({
                email: email.toLowerCase(),
                password: null,
                loginMethod: "linkedin",
            });
            await user.save();
        }

        const appAccessToken = jwt.sign(
            { id: user._id, email: user.email },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "15m" }
        );

        const refreshToken = jwt.sign(
            { id: user._id, email: user.email },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: "7d" }
        );

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            path: "/",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.clearCookie("li_oauth_state", {
            httpOnly: false,
            sameSite: "lax",
            secure: false,
        });

        return res.redirect(`${process.env.CLIENT_URL}/`);

    } catch (e) {
        console.error("LinkedIn OAuth error:", e?.response?.data || e);
        return res.redirect(`${process.env.CLIENT_URL}/login?error=linkedin_auth_failed`);
    }
});

Router.post("/signup", async (req, res) => {
    try {
        const { email, password } = req.body;

        const existingUser = await User.findOne({ email: email.toLowerCase() });

        if (existingUser) {
            return res.status(400).json({
                message: "An account with this email already exists. Try logging in instead."
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            email: email.toLowerCase(),
            password: hashedPassword,
        });
        await newUser.save();

        const accessToken = jwt.sign(
            { id: newUser._id, email: newUser.email },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "15m" }
        );

        const refreshToken = jwt.sign(
            { id: newUser._id, email: newUser.email },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: "7d" }
        );

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            path: "/",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.json({
            message: "User registered successfully",
            accessToken,
            user: {
                id: newUser._id,
                email: newUser.email
            }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Internal server error. Please try again later.",
            error: err.message
        });
    }
});

Router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(400).json({ message: "No account found with that email address." });
        }

        if (user.password === null) {
            if (user.loginMethod === "google") {
                return res.status(400).json({ message: "This email is registered via Google. Use Google Sign-In." });
            } else {
                return res.status(400).json({ message: "This email is registered via LinkedIn. Use LinkedIn Sign-In." });
            }
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid password" });
        }

        const accessToken = jwt.sign(
            { id: user._id, email: user.email },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "15m" }
        );

        const refreshToken = jwt.sign(
            { id: user._id, email: user.email },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: "7d" }
        );

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            path: "/",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.json({
            message: "Login successful",
            accessToken,
            user: {
                id: user._id,
                email: user.email,
                name: user.name
            }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error in login", error: err.message });
    }
});

Router.post("/resetPassword", async (req, res) => {
    try {
        const { email, newPassword } = req.body;

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) return res.status(400).json({ message: "No account found with that email address." });

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        res.json({ message: "Password reset successful" });
    } catch (err) {
        res.status(500).json({ message: "Error in resetting password", error: err.message });
    }
});

Router.post("/sendCode", async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) return res.status(400).json({ message: "No account found with that email address." });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const cryptedOPT = await bcrypt.hash(otp, 10);
        const tempOpt = new TempOPT({ email: email.toLowerCase(), otp: cryptedOPT });
        await tempOpt.save();

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Smart Resumr Password Reset Code',
            text: `Your password reset code is: ${otp}`,
        };

        await transporter.sendMail(mailOptions);
        res.json({ message: "Password reset code sent successfully" });
    } catch (err) {
        console.error("Error in sending code:", err);
        res.status(500).json({ message: "Error in sending code", error: err.message });
    }
});

Router.post("/verifyCode", async (req, res) => {
    try {
        const { email, code } = req.body;

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) return res.status(400).json({ message: "No account found with that email address." });

        const tempOpt = await TempOPT.findOne({ email: email.toLowerCase() });
        if (!tempOpt) return res.status(400).json({ message: "No verification code sent to this email or code is expired." });

        const isMatch = await bcrypt.compare(code, tempOpt.otp);
        if (!isMatch) return res.status(400).json({ message: "Invalid verification code." });

        await TempOPT.deleteOne({ email: email.toLowerCase() });
        res.json({ message: "Verification code verified successfully." });
    } catch (err) {
        res.status(500).json({ message: "Error in verifying code", error: err.message });
    }
});

Router.post("/refresh", (req, res) => {
    const token = req.cookies.refreshToken;
    if (!token) return res.status(401).json({ message: "No refresh token" });

    try {
        const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

        const accessToken = jwt.sign(
            { id: decoded.id, email: decoded.email },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "15m" }
        );

        return res.json({ accessToken });

    } catch (err) {
        return res.status(403).json({ message: "Invalid refresh token" });
    }
});

Router.post("/logout", (req, res) => {
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        path: "/"
    });

    return res.json({ message: "Logged out successfully" });
});

module.exports = Router;