const express = require("express");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const userRouter = require("./routes/user.route");
const blogRouter = require("./routes/blog.route");
const commentRouter = require("./routes/comment.route");
const connectDB = require("./config/db");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());
connectDB();

app.get("/", (req, res) => {
  res.send("NODE SERVER RUNNING");
});

app.use("/api/v1/user", userRouter);
app.use("/api/v1/blog", blogRouter);
app.use("/api/v1/comment", commentRouter);  // Fixed missing `/`
app.listen(PORT, () => {
  console.log(`NODE SERVER RUNNING ON http://localhost:${PORT}`);
});
