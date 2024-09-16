const express = require("express");
require("dotenv").config();
const userRouter = require("./routes/user.route");
const connectDB = require("./config/db")

const app = express();
const PORT = process.env.PORT || 5000

app.use(express.json());
connectDB();

app.get("/", (req, res)=>{
    res.send("NODE SERVER RUNNING");
});

app.use("/api/v1/user", userRouter);
app.listen(PORT, ()=>{
    console.log(`NODE SERVER RUNNING ON http://localhost:${PORT}`);
})
