import express from "express";
import {
  getIpsWithMultipleUsers,
  getUsersWithMultipleIps,
  getSuspiciousIps
} from "../services/analysisService.js";

const router = express.Router();

router.get("/analytics", async (req, res) => {
  try {
    const ipsWithMultipleUsers = await getIpsWithMultipleUsers();
    const usersWithMultipleIps = await getUsersWithMultipleIps();
    const suspiciousIps = await getSuspiciousIps();

    res.json({
      ipsWithMultipleUsers,
      usersWithMultipleIps,
      suspiciousIps
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Analytics error" });
  }
});

export default router;
