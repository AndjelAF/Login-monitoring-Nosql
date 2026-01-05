import express from "express";
import {
  handleFailedLogin,
  handleSuccessfulLogin,
  checkIfBlocked
} from "../services/loginAttemptService.js";

const router = express.Router();

/**
 * LOGIN RUTA – SIMULACIJA
 *
 * Ne implementiramo pravi authentication sistem.
 * Hardcoded lozinka se koristi isključivo radi demonstracije:
 * - Redis logike (rate limit, blokade, TTL)
 * - kasnije Neo4j analize login obrazaca
 */
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const ip = req.ip;

    if (!username || !password) {
      return res.status(400).json({
        message: "Username and password required"
      });
    }

    // 1️⃣ Provera da li je korisnik + IP blokiran
    const blocked = await checkIfBlocked(username, ip);
    if (blocked) {
      return res.status(403).json({
        message: "User temporarily blocked from this IP due to too many failed attempts"
      });
    }

    /**
     * 2️⃣ SIMULACIJA PROVERE LOZINKE
     * U realnom sistemu:
     * - lozinka bi se proveravala u bazi
     * - koristio bi se hash (bcrypt, argon2)
     *
     * Ovde je svesno hardcoded radi jednostavnosti projekta
     */
    const CORRECT_PASSWORD = "secret123";

    if (password !== CORRECT_PASSWORD) {
      const result = await handleFailedLogin(username, ip);

      return res.status(401).json({
        message: "Invalid credentials",
        attempts: result.attempts,
        blocked: result.blocked
      });
    }

    // 3️⃣ Uspešan login – reset pokušaja za username + IP
    await handleSuccessfulLogin(username, ip);

    return res.status(200).json({
      message: "Login successful"
    });

  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      message: "Internal server error"
    });
  }
});

export default router;
