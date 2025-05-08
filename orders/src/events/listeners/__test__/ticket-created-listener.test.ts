import { TicketCreatedEvent } from "@trc-ticketing/common";
import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper";
import { TicketCreatedListener } from "../ticket-created-listener";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";

const setup = async () => {
  const data: TicketCreatedEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 10,
    userId: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };
  return { data, msg };
};

it("creates and saves a ticket", async () => {
  const { data, msg } = await setup();
  const listener = new TicketCreatedListener(natsWrapper.client);
  await listener.onMessage(data, msg);

  const ticket = await Ticket.findById(data.id);
  expect(ticket).toBeDefined();
  expect(ticket!.title).toEqual(data.title);
  expect(ticket!.price).toEqual(data.price);
  expect(msg.ack).toHaveBeenCalled();
});

it("acks the message", async () => {
  const { data, msg } = await setup();
  const listener = new TicketCreatedListener(natsWrapper.client);
  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
