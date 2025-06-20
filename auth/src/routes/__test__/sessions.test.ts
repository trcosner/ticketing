// auth/src/routes/__test__/sessions.test.ts
import request from "supertest";
import { app } from "../../app";

it("returns user sessions when authenticated", async () => {
  const cookie = await global.getAuthCookie();

  const response = await request(app)
    .get("/api/auth/sessions")
    .set("Cookie", cookie)
    .expect(200);

  expect(response.body.sessions).toBeDefined();
  expect(Array.isArray(response.body.sessions)).toBe(true);
});

it("returns 401 when not authenticated", async () => {
  await request(app).get("/api/auth/sessions").expect(401);
});

it("revokes all user sessions", async () => {
  const cookie = await global.getAuthCookie();

  const response = await request(app)
    .delete("/api/auth/sessions")
    .set("Cookie", cookie)
    .expect(200);

  expect(response.body.message).toEqual("All sessions revoked");
});

it("clears session when revoking all sessions", async () => {
  const cookie = await global.getAuthCookie();

  const response = await request(app)
    .delete("/api/auth/sessions")
    .set("Cookie", cookie)
    .expect(200);

  // Check that session is cleared (Set-Cookie with empty value)
  const setCookie = response.get("Set-Cookie");
  expect(setCookie).toBeDefined();
  expect(setCookie).toBeTruthy();
  expect(setCookie![0]).toContain("session=;");
});
