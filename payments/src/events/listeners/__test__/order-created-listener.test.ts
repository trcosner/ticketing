import { OrderCreatedEvent, OrderStatus } from "@trc-ticketing/common";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCreatedListener } from "../order-created-listener";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Order } from "../../../models/order";

const setup = async () => {
  const listener = new OrderCreatedListener(natsWrapper.client);

  const data: OrderCreatedEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    userId: new mongoose.Types.ObjectId().toHexString(),
    expiresAt: "123123",
    ticket: {
      id: "ticketdcsfv",
      price: 10,
    },
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };
  return { data, msg, listener };
};

it("sets the orderId of the ticket", async () => {
  const { data, msg, listener } = await setup();
  await listener.onMessage(data, msg);

  const createdOrder = await Order.findById(data.id);
  expect(createdOrder!.price).toEqual(data.ticket.price);
  expect(msg.ack).toHaveBeenCalled();
});

it("acks the message", async () => {
  const { data, msg, listener } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
