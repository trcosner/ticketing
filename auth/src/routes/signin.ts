// auth/src/routes/signin.ts
import express, { Request, Response } from "express";
import { body } from "express-validator";
import { Password } from "../services/password";
import { User } from "../models/user";
import { BadRequestError, validateRequest } from "@trc-ticketing/common";
import { TokenService } from "../services/token";

const router = express.Router();

router.post(
  "/api/users/signin",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("You must supply a password"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      throw new BadRequestError("Invalid credentials");
    }

    const passwordsMatch = await Password.compare(
      existingUser.password,
      password
    );
    if (!passwordsMatch) {
      throw new BadRequestError("Invalid credentials");
    }

    // Generate both access and refresh tokens
    const deviceInfo = req.get("User-Agent") || "Unknown Device";
    const ipAddress = req.ip;

    const tokenPair = await TokenService.generateTokenPair(
      {
        id: existingUser.id,
        email: existingUser.email,
      },
      deviceInfo,
      ipAddress,
      req.get("User-Agent")
    );

    // Store access token in session (for backward compatibility)
    req.session = { jwt: tokenPair.accessToken };

    res.status(200).send({
      user: existingUser,
      refreshToken: tokenPair.refreshToken,
      accessTokenExpiresAt: tokenPair.accessTokenExpiresAt,
      refreshTokenExpiresAt: tokenPair.refreshTokenExpiresAt,
    });
  }
);

export { router as signinRouter };
