const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const cookieParser = require("cookie-parser");
const userRouter = require("./routes/user");
const questionRouter = require("./routes/question");
const categoryRouter = require("./routes/category");
const subCateogryRouter = require("./routes/subCategory");
const authRouter = require("./routes/auth");
const helmet = require("helmet");
dotenv.config();

const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(express.static("public"));
const corsOptions = {
  origin: "http://localhost:5173",
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

// Add CSP headers using helmet middleware
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:"], // Allow data URLs for images
      // Add more directives as needed
    },
  })
);

// Convert SVG to base64

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
