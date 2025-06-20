// auth/src/routes/revoke.ts
import express, { Request, Response } from "express";
import { body } from "express-validator";
import { validateRequest, BadRequestError } from "@trc-ticketing/common";
import { TokenService } from "../services/token";

const router = express.Router();

router.post(
  "/api/auth/revoke",
  [body("refreshToken").notEmpty().withMessage("Refresh token is required")],
  validateRequest,
  async (req: Request, res: Response) => {
    const { refreshToken } = req.body;

    const success = await TokenService.revokeRefreshToken(refreshToken);

    if (!success) {
      throw new BadRequestError("Invalid refresh token");
    }

    res.status(200).send({ message: "Refresh token revoked" });
  }
);

export { router as revokeRouter };
