import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";

const createTicket = () => {
  return request(app)
    .post("/api/tickets")
    .set("Cookie", global.getAuthCookie())
    .send({ title: "Title", price: 20 });
};

it("fetches a list of tickets", async () => {
  await createTicket();
  await createTicket();
  await createTicket();

  const response = await request(app).get("/api/tickets").send().expect(200);

  expect(response.body.length).toEqual(3);
});
