// auth/src/routes/refresh.ts
import express, { Request, Response } from "express";
import { body } from "express-validator";
import { validateRequest, BadRequestError } from "@trc-ticketing/common";
import { TokenService } from "../services/token";

const router = express.Router();

router.post(
  "/api/auth/refresh",
  [body("refreshToken").notEmpty().withMessage("Refresh token is required")],
  validateRequest,
  async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    const ipAddress = req.ip || "unknown";

    // Check rate limiting first
    const rateLimitOk = await TokenService.checkRefreshRateLimit(ipAddress);
    if (!rateLimitOk) {
      throw new BadRequestError(
        "Too many refresh attempts. Please try again later."
      );
    }

    // Refresh the access token
    const result = await TokenService.refreshAccessToken(
      refreshToken,
      ipAddress
    );

    if (!result) {
      throw new BadRequestError("Invalid or expired refresh token");
    }

    // Store new access token in session
    req.session = { jwt: result.accessToken };

    res.status(200).send({
      accessToken: result.accessToken,
      expiresAt: result.expiresAt,
    });
  }
);

export { router as refreshRouter };
