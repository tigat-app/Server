
import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";
import compression from "compression"; // Compression
import helmet from "helmet"; // Helmet
import hpp from "hpp";
import morgan from "morgan";
import path from "path";
import mongoDBConnect from "./database/database";
import authRoutes from "./routes/authRoutes";
import courseRoutes from "./routes/courseRoute";
import categoryRoutes from "./routes/categorie";
import subCategoryRoutes from "./routes/subCategorie";
import subSubCategoryRoutes from "./routes/subSubCategorie";
import studentRoute from "./routes/StudenRoute";
import comunityRoute from "./routes/communityRoute";



dotenv.config();

const app = express();

// Security middlewares
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));app.use(hpp());

app.use(
  cors({
    origin: "*",
  })
);
//logging
app.use(morgan("dev"));

// Compression
app.use(compression());

app.use(bodyParser.json());

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/course", courseRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/subCategory", subCategoryRoutes);
app.use("/api/subSubCategory", subSubCategoryRoutes);
app.use("/api/student", studentRoute);

app.use('/api/community', comunityRoute);


const port = process.env.PORT || 7070;

app.get("/", (req, res) => {
  res.send("Hello from project X!");
});

app.listen(port, async () => {
  await mongoDBConnect();
  console.log(`Server is running at :${port}`);
});