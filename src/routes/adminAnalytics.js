import express from "express";

import {
  getIpsWithMultipleUsers,
  getUsersWithMultipleIps,
  getSuspiciousIps,
  getStatistics,
  getAttackPatterns
} from "../services/analysisService.js";

const router = express.Router();


// =========================
// ANALYTICS
// =========================

router.get("/analytics", async (req, res) => {

  try {

    const ipsWithMultipleUsers =
      await getIpsWithMultipleUsers();

    const usersWithMultipleIps =
      await getUsersWithMultipleIps();

    const suspiciousIps =
      await getSuspiciousIps();

    const attackPatterns =
      await getAttackPatterns();

    res.json({
      ipsWithMultipleUsers,
      usersWithMultipleIps,
      suspiciousIps,
      attackPatterns
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: "Analytics error"
    });
  }
});


// =========================
// STATISTIKA
// =========================

router.get("/stats", async (req, res) => {

  try {

    const stats = await getStatistics();

    res.json(stats);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: "Statistics error"
    });
  }
});

export default router;