import express from "express";
import loginRoutes from "./routes/login.js";
import adminRoutes from "./routes/admin.js";
import path from "path";
import { fileURLToPath } from "url";

const app = express();

// ovo treba zbog ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());

//  SERVIRANJE FRONTENDA
app.use(express.static(path.join(__dirname, "public")));

//  API
app.use("/api", loginRoutes);
app.use("/admin", adminRoutes);


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
