import express, { Request, Response } from "express";
import { body } from "express-validator";
import { User } from "../models/user";
import {
  BadRequestError,
  validateRequest,
  generateJWT,
} from "@trc-ticketing/common";
import { TokenService } from "../services/token";

const router = express.Router();

router.post(
  "/api/users/signup",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be between 4 and 20 characters"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new BadRequestError("Email in use");
    }

    const user = User.build({ email, password });
    await user.save();

    const tokenPair = await TokenService.generateTokenPair(
      {
        id: user.id,
        email: user.email,
      },
      req.get("User-Agent") || "Unknown Device",
      req.ip,
      req.get("User-Agent")
    );

    req.session = { jwt: tokenPair.accessToken };

    res.status(201).send({
      user,
      refreshToken: tokenPair.refreshToken,
      accessTokenExpiresAt: tokenPair.accessTokenExpiresAt,
      refreshTokenExpiresAt: tokenPair.refreshTokenExpiresAt,
    });
  }
);

export { router as signupRouter };
