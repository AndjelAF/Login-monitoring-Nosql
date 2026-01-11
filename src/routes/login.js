// src/routes/login.js
import express from "express";
import { login } from "../services/loginService.js";
import { logLoginAttempt } from "../neo4j/loginGraphService.js";


const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const ip = req.ip;

    if (!username || !password) {
      return res.status(400).json({
        message: "Username and password required"
      });
    }

    const result = await login(username, password, ip);

    return res.status(result.status).json({
      message: result.message,
      ...(result.attempts !== undefined && { attempts: result.attempts }),
      ...(result.blocked !== undefined && { blocked: result.blocked })
    });

  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      message: "Internal server error"
    });
  }
});

export default router;
