const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { User,TempOPT } = require("../models/model");
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
            grant_type: "authorization_code"
        });

        const { access_token, id_token } = data;

        const { data: userInfo } = await axios.get(
            "https://www.googleapis.com/oauth2/v3/userinfo",
            { headers: { Authorization: `Bearer ${access_token}` } }
        );

        if (!userInfo.email_verified) {
            return res.redirect(`${process.env.CLIENT_URL}/login?error=Email_not_verified_By_Google`);
        }

        const existingUser = await User.findOne({ email: userInfo.email.toLowerCase() });

        if (!existingUser) {
            const newUser = new User({ email: userInfo.email.toLowerCase(), password: null, loginMethod: 'google' });
            await newUser.save();
        }

        const token = jwt.sign({ email: userInfo.email }, process.env.SECRET_KEY);
        res.redirect(`${process.env.CLIENT_URL}/login?token=${token}`);

    } catch (err) {
        console.error("Google OAuth error:", err);
        res.redirect(`${process.env.CLIENT_URL}/login?error=google_auth_failed_Try_again_later`);
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
            return res.redirect(`${process.env.CLIENT_URL}/login?error=linkedin_auth_failed_try_again_later`);
        }

        const { code, state } = req.query;
        const savedState = req.cookies?.li_oauth_state;

        if (!code || !state || state !== savedState) return res.redirect(`${process.env.CLIENT_URL}/login?error=linkedin_auth_failed_try_again_later`);

        const tokenParams = new URLSearchParams({
            grant_type: "authorization_code",
            code,
            redirect_uri: process.env.LINKEDIN_REDIRECT_URI,
            client_id: process.env.LINKEDIN_CLIENT_ID,
            client_secret: process.env.LINKEDIN_CLIENT_SECRET
        });

        const tokenResp = await axios.post(
            "https://www.linkedin.com/oauth/v2/accessToken",
            tokenParams.toString(),
            { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
        );

        const accessToken = tokenResp.data.access_token;
        if (!accessToken) return res.status(401).send("No LinkedIn access token");

        const userinfo = await axios.get("https://api.linkedin.com/v2/userinfo", {
            headers: { Authorization: `Bearer ${accessToken}` }
        });

        console.log(userinfo.data);
        const email = userinfo.data?.email;
        console.log(email);

        if (!email) {
            return res.redirect(`${process.env.CLIENT_URL}/login?error=Email_not_verified_By_LinkedIn`);
        }

        const existingUser = await User.findOne({ email: email.toLowerCase() });

        if (!existingUser) {
            const newUser = new User({ email: email.toLowerCase(), password: null, loginMethod: 'linkedin' });
            await newUser.save();
        }

        const token = jwt.sign({ email }, process.env.SECRET_KEY);

        res.clearCookie("li_oauth_state",
            {
                httpOnly: false,
                sameSite: "lax",
                secure: false
            });

        const redirect = new URL(`${process.env.CLIENT_URL}/login?token=${token}`);
        res.redirect(redirect.toString());

    } catch (e) {
        console.error("LinkedIn OAuth error:", e?.response?.data || e);
        const r = new URL(`${process.env.CLIENT_URL}/login?error=linkedin_auth_failed_try_again_later`);
        res.redirect(r.toString());
    }
});

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
        console.log("Fetching data from : "+email);
        const user = await User.findOne({ email: email.toLowerCase() });
        console.log(user);
        if (!user) return res.status(400).json({ message: "No account found with that email address." });

        if (user.password === null) {
            if (user.loginMethod === 'google') return res.status(400).json({ message: "This email is registered via Google. Please use Google Sign-In to log in." });
            else return res.status(400).json({ message: "This email is registered via Linkedin. Please use Linkedin Sign-In to log in." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid password" });

        const token = jwt.sign({ id: user._id, email: user.email }, process.env.SECRET_KEY);

        res.json({ message: "Login successful", token });
    } catch (err) {
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

module.exports = Router;