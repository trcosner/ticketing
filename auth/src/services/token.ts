// auth/src/services/token.ts
import { randomBytes } from "crypto";
import {
  generateJWT,
  verifyJWT,
  JWTPayload,
  redisClient,
} from "@trc-ticketing/common";
import { RefreshToken } from "../models/refresh-token";
import { User } from "../models/user"; // Import User model

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAt: Date;
  refreshTokenExpiresAt: Date;
}

// Define the cached token structure
interface CachedRefreshToken {
  userId: string;
  deviceInfo: string;
  expiresAt: string;
}

export class TokenService {
  private static readonly REFRESH_TOKEN_LENGTH = 64;
  private static readonly ACCESS_TOKEN_EXPIRY = 15 * 60; // 15 minutes in seconds
  private static readonly REFRESH_TOKEN_EXPIRY = 30 * 24 * 60 * 60; // 30 days in seconds

  // Generate both access and refresh tokens
  static async generateTokenPair(
    user: { id: string; email: string },
    deviceInfo?: string,
    ipAddress?: string,
    userAgent?: string
  ): Promise<TokenPair> {
    // Generate access token (short-lived, contains user data)
    const accessToken = generateJWT({
      id: user.id,
      email: user.email,
    });

    // Generate refresh token (long-lived, opaque)
    const refreshTokenValue = randomBytes(
      TokenService.REFRESH_TOKEN_LENGTH
    ).toString("hex");

    // Calculate expiration dates
    const accessTokenExpiresAt = new Date(
      Date.now() + TokenService.ACCESS_TOKEN_EXPIRY * 1000
    );
    const refreshTokenExpiresAt = new Date(
      Date.now() + TokenService.REFRESH_TOKEN_EXPIRY * 1000
    );

    // Save refresh token to database
    const refreshToken = RefreshToken.build({
      token: refreshTokenValue,
      userId: user.id,
      expiresAt: refreshTokenExpiresAt,
      deviceInfo,
      ipAddress,
      userAgent,
    });

    await refreshToken.save();

    // Cache refresh token in Redis for fast lookup
    await redisClient.setJSON(
      `refresh_token:${refreshTokenValue}`,
      {
        userId: user.id,
        email: user.email, // Include email in cache
        deviceInfo: deviceInfo || "Unknown Device",
        expiresAt: refreshTokenExpiresAt.toISOString(),
      },
      TokenService.REFRESH_TOKEN_EXPIRY
    );

    console.log(`Generated token pair for user ${user.id}`);

    return {
      accessToken,
      refreshToken: refreshTokenValue,
      accessTokenExpiresAt,
      refreshTokenExpiresAt,
    };
  }

  // Refresh access token using refresh token
  static async refreshAccessToken(
    refreshTokenValue: string,
    ipAddress?: string
  ): Promise<{ accessToken: string; expiresAt: Date } | null> {
    try {
      // First check Redis cache
      const cachedToken = await redisClient.getJSON<CachedRefreshToken>(
        `refresh_token:${refreshTokenValue}`
      );

      let userId: string;
      let userEmail: string;

      if (cachedToken && cachedToken.userId) {
        // Use cached data
        userId = cachedToken.userId;
        userEmail = (cachedToken as any).email || "unknown@example.com";
      } else {
        // Fallback to database
        const dbToken = await RefreshToken.findOne({
          token: refreshTokenValue,
          isRevoked: false,
          expiresAt: { $gt: new Date() },
        });

        if (!dbToken) {
          console.log("Refresh token not found or expired");
          return null;
        }

        userId = dbToken.userId;

        // Get user email from User model
        const user = await User.findById(userId);
        if (!user) {
          console.log("User not found for refresh token");
          return null;
        }

        userEmail = user.email;
      }

      // Generate new access token
      const accessToken = generateJWT({
        id: userId,
        email: userEmail,
      });

      const accessTokenExpiresAt = new Date(
        Date.now() + TokenService.ACCESS_TOKEN_EXPIRY * 1000
      );

      console.log(`Refreshed access token for user ${userId}`);

      return {
        accessToken,
        expiresAt: accessTokenExpiresAt,
      };
    } catch (error) {
      console.error("Error refreshing access token:", error);
      return null;
    }
  }

  // Revoke refresh token
  static async revokeRefreshToken(refreshTokenValue: string): Promise<boolean> {
    try {
      // Update database
      const result = await RefreshToken.updateOne(
        { token: refreshTokenValue },
        { isRevoked: true }
      );

      // Remove from Redis cache
      await redisClient.del(`refresh_token:${refreshTokenValue}`);

      console.log(`Revoked refresh token: ${refreshTokenValue}`);
      return result.modifiedCount > 0;
    } catch (error) {
      console.error("Error revoking refresh token:", error);
      return false;
    }
  }

  // Get user's active sessions
  static async getUserSessions(userId: string): Promise<any[]> {
    try {
      const sessions = await RefreshToken.find({
        userId,
        isRevoked: false,
        expiresAt: { $gt: new Date() },
      }).select("-token"); // Don't include the actual token

      return sessions;
    } catch (error) {
      console.error("Error getting user sessions:", error);
      return [];
    }
  }

  // Revoke all user sessions
  static async revokeAllUserSessions(userId: string): Promise<void> {
    try {
      // Update all user's refresh tokens
      await RefreshToken.updateMany(
        { userId, isRevoked: false },
        { isRevoked: true }
      );

      // Remove all from Redis cache (we'd need to track them better for this)
      console.log(`Revoked all sessions for user ${userId}`);
    } catch (error) {
      console.error("Error revoking all user sessions:", error);
    }
  }

  static async checkRefreshRateLimit(identifier: string): Promise<boolean> {
    try {
      // Use Redis for rate limiting - 10 refresh attempts per 5 minutes
      const key = `refresh_rate_limit:${identifier}`;
      const windowMs = 5 * 60 * 1000; // 5 minutes
      const limit = 10;

      const now = Date.now();
      const windowStart = now - windowMs;

      // Remove old entries
      await redisClient.zRemRangeByScore(key, 0, windowStart);

      // Add current request
      await redisClient.zAdd(key, now, `${now}-${Math.random()}`);

      // Count current requests
      const count = await redisClient.zCard(key);

      // Set expiry
      await redisClient.expire(key, Math.ceil(windowMs / 1000));

      return count <= limit;
    } catch (error) {
      console.error("Error checking refresh rate limit:", error);
      return true; // Allow on error
    }
  }
}
