// auth/src/routes/__test__/refresh.test.ts
import request from "supertest";
import { app } from "../../app";
import { TokenService } from "../../services/token";

it("successfully refreshes access token with valid refresh token", async () => {
  const response = await request(app)
    .post("/api/auth/refresh")
    .send({
      refreshToken: "valid-refresh-token-123",
    })
    .expect(200);

  expect(response.body).toEqual({
    accessToken: "new-access-token",
    expiresAt: expect.any(String),
  });

  expect(TokenService.refreshAccessToken).toHaveBeenCalledWith(
    "valid-refresh-token-123",
    expect.any(String)
  );
});

it("returns 400 for invalid refresh token", async () => {
  (TokenService.refreshAccessToken as jest.Mock).mockResolvedValueOnce(null);

  await request(app)
    .post("/api/auth/refresh")
    .send({
      refreshToken: "invalid-refresh-token",
    })
    .expect(400);
});

it("returns 400 when rate limited", async () => {
  (TokenService.checkRefreshRateLimit as jest.Mock).mockResolvedValueOnce(
    false
  );

  await request(app)
    .post("/api/auth/refresh")
    .send({
      refreshToken: "valid-refresh-token-123",
    })
    .expect(400);
});
