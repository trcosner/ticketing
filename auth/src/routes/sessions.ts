// auth/src/routes/sessions.ts
import express from "express";
import { requireAuth, currentUser } from "@trc-ticketing/common";
import { TokenService } from "../services/token";

const router = express.Router();

// Get user's active sessions
router.get("/api/auth/sessions", currentUser, requireAuth, async (req, res) => {
  const sessions = await TokenService.getUserSessions(req.currentUser!.id);

  res.status(200).send({ sessions });
});

// Revoke all user sessions (logout from all devices)
router.delete(
  "/api/auth/sessions",
  currentUser,
  requireAuth,
  async (req, res) => {
    await TokenService.revokeAllUserSessions(req.currentUser!.id);

    // Also clear current session
    req.session = null;

    res.status(200).send({ message: "All sessions revoked" });
  }
);

export { router as sessionsRouter };
