// auth/src/routes/__test__/revoke.test.ts
import request from "supertest";
import { app } from "../../app";
import { TokenService } from "../../services/token";

it("successfully revokes valid refresh token", async () => {
  const response = await request(app)
    .post("/api/auth/revoke")
    .send({
      refreshToken: "valid-refresh-token-123",
    })
    .expect(200);

  expect(response.body.message).toEqual("Refresh token revoked");
  expect(TokenService.revokeRefreshToken).toHaveBeenCalledWith(
    "valid-refresh-token-123"
  );
});

it("returns 400 for invalid refresh token", async () => {
  // Mock revocation failure
  (TokenService.revokeRefreshToken as jest.Mock).mockResolvedValueOnce(false);

  await request(app)
    .post("/api/auth/revoke")
    .send({
      refreshToken: "invalid-refresh-token",
    })
    .expect(400);
});

it("returns 400 when refresh token is missing", async () => {
  await request(app).post("/api/auth/revoke").send({}).expect(400);
});
