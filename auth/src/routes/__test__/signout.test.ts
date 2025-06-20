import request from "supertest";
import { app } from "../../app";

it("clears the cookie after signing out", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({ email: "test@test.com", password: "password" })
    .expect(201);

  const response = await request(app)
    .post("/api/users/signout")
    .send({})
    .expect(200);

  const cookie = response.get("Set-Cookie");
  if (!cookie) {
    throw new Error("Expected cookie but got undefined.");
  }
  
  // Should clear both session and refreshToken cookies
  expect(cookie).toHaveLength(2);
  expect(cookie.some(c => c.includes("session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"))).toBe(true);
  expect(cookie.some(c => c.includes("refreshToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT"))).toBe(true);
});
