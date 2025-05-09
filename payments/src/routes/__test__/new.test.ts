import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { Order, OrderStatus } from "../../models/order";
import { stripe } from "../../stripe";
import { Payment } from "../../models/payment";

it("returns 404 when purchasing an order that does not exist", async () => {
  await request(app)
    .post("/api/payments")
    .set("Cookie", global.getAuthCookie())
    .send({
      token: "123123",
      orderId: new mongoose.Types.ObjectId().toHexString(),
    })
    .expect(404);
});

it("returns 401 when purchasing an order that does not belong to current user", async () => {
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    price: 10,
  });
  await order.save();
  await request(app)
    .post("/api/payments")
    .set("Cookie", global.getAuthCookie())
    .send({
      token: "123123",
      orderId: order.id,
    })
    .expect(401);
});

it("returns 400 when purchasing a canceled order", async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId,
    version: 0,
    status: OrderStatus.Canceled,
    price: 10,
  });

  await order.save();
  await request(app)
    .post("/api/payments")
    .set("Cookie", global.getAuthCookie(userId))
    .send({
      token: "123123",
      orderId: order.id,
    })
    .expect(400);
});

it("returns 201 with valid inputs", async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId,
    version: 0,
    status: OrderStatus.Created,
    price: 10,
  });

  await order.save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", global.getAuthCookie(userId))
    .send({ token: "tok_visa", orderId: order.id })
    .expect(201);
  const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0];

  expect(chargeOptions.source).toEqual("tok_visa");
  expect(chargeOptions.amount).toEqual(10 * 100);
  expect(chargeOptions.currency).toEqual("usd");
  const payment = await Payment.findOne({
    orderId: order.id,
  });
  expect(payment).not.toEqual(null);
});
