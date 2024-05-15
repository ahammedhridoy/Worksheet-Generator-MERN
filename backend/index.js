const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
// const cookieParser = require("cookie-parser");
const userRouter = require("./routes/user");
const questionRouter = require("./routes/question");
const categoryRouter = require("./routes/category");
const subCateogryRouter = require("./routes/subCategory");
const authRouter = require("./routes/auth");
dotenv.config();

const app = express();
app.use(express.json());
app.use(bodyParser.json());
const corsOptions = {
  origin: ["https://worksheet-generator-mern-dun.vercel.app"],
  credentials: true,
  optionSuccessStatus: 200,
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(
  bodyParser.urlencoded({
    extended: true,
    limit: "50mb",
    parameterLimit: 1000,
  })
);
app.use(express.json({ limit: "50mb" }));
app.use(bodyParser.raw({ limit: "50mb" }));
app.use("/api/v1/users", userRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/questions", questionRouter);
app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/sub-category", subCateogryRouter);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.get("/", (req, res) => {
  res.send("Welcome to the backend!");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
});
