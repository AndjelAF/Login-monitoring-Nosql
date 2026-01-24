import express from "express";
import redisClient from "../redis/redisClient.js";

const router = express.Router();

router.get("/blocked", async (req, res) => {
  try {
    const keys = await redisClient.keys("login:blocked:*");

    const blocked = [];

    for (const key of keys) {
      const ttl = await redisClient.ttl(key);

      const parts = key.split(":");
      const username = parts[2];
      const ip = parts.slice(3).join(":");

      blocked.push({
        username,
        ip,
        ttl
      });
    }

    res.json(blocked);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Admin error" });
  }
});

export default router;
