const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
    const token = req.headers["authorization"];
    
    if (!token) {
        console.log("No token provided");
        return res.status(401).json({ message: "No token provided" });
    }
    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded;
        console.log(decoded);
        next();
    } catch (err) {
        return res.status(403).json({ message: "Invalid token", error: err.message });
    }
}

module.exports = {
    authenticateToken
}