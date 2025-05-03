import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import mongoose from "mongoose";

it("returns a 404 if the provided id does not exist", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .set("Cookie", global.getAuthCookie())
    .send({ title: "Title", price: 20 })
    .expect(404);
});

it("returns a 401 if the user is not authenticated", async () => {
  const response = await request(app)
    .post(`/api/tickets`)
    .set("Cookie", global.getAuthCookie())
    .send({ title: "Title", price: 20 })
    .expect(201);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .send({ title: "Title 2", price: 20 })
    .expect(401);
});

it("returns a 401 if the user does not own the ticket", async () => {
  const response = await request(app)
    .post(`/api/tickets`)
    .set("Cookie", global.getAuthCookie())
    .send({ title: "Title", price: 20 })
    .expect(201);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", global.getAuthCookie())
    .send({ title: "Title 2", price: 10 })
    .expect(401);
});

it("returns a 400 if price or title provided are invalid", async () => {
  const cookie = global.getAuthCookie();
  const response = await request(app)
    .post(`/api/tickets`)
    .set("Cookie", cookie)
    .send({ title: "Title", price: 20 })
    .expect(201);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({ title: "", price: 20 })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({ title: 20, price: -5 })
    .expect(400);
});

it("updates the ticket provided valid inputs", async () => {
  const cookie = global.getAuthCookie();
  const response = await request(app)
    .post(`/api/tickets`)
    .set("Cookie", cookie)
    .send({ title: "Title", price: 20 })
    .expect(201);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({ title: "Title 2", price: 10 })
    .expect(200);

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send();

  expect(ticketResponse.body.title).toEqual("Title 2");
  expect(ticketResponse.body.price).toEqual(10);
});
