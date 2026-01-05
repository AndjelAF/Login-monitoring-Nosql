import express from "express";
import loginRoutes from "./routes/login.js";


const app = express();

app.use(express.json());
app.use("/api", loginRoutes);


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
