const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const { User } = require("./models/model");

const AuthRouter = require("./routes/auth");
const ResumeRouter = require("./routes/resume");
const ExtractRouter = require("./routes/extract");

const app = express();
app.use(bodyParser.json());
app.use(cors());


mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB connected"))
.catch((err) => console.log("MongoDB connection error:", err));


app.use("/auth",AuthRouter);
app.use("/resume",ResumeRouter);
app.use("/extract",ExtractRouter);

app.get("/",async (req,res)=>{
    // const data = await User.deleteMany({});
    const data = await User.find({});
    res.json(data);
});

app.listen(5000, () => console.log("Server running on http://localhost:5000"));
