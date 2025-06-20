// auth/src/routes/signout.ts
import { redisClient, verifyJWT } from "@trc-ticketing/common";
import express from "express";

const router = express.Router();

router.post("/api/users/signout", async (req, res) => {
  if (req.session?.jwt) {
    try {
      // Use centralized JWT verification
      const payload = verifyJWT(req.session.jwt);

      if (payload.jti) {
        // Calculate remaining TTL (time until token expires)
        const now = Math.floor(Date.now() / 1000);
        const remainingTTL = payload.exp - now;

        if (remainingTTL > 0) {
          // Add JTI to blacklist with remaining TTL
          await redisClient.set(`blacklist:${payload.jti}`, "1", remainingTTL);
          console.log(
            `Blacklisted token ${payload.jti} for ${remainingTTL} seconds`
          );
        }
      }
    } catch (err) {
      console.log("Error blacklisting token:", err);
    }
  }

  req.session = null;
  res.send({});
});

export { router as signoutRouter };
