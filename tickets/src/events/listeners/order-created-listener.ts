import {
  Listener,
  Subjects,
  OrderCreatedEvent,
  NotFoundError,
} from "@trc-ticketing/common";
import { Message } from "node-nats-streaming";
import { QUEUE_GROUP_NAME } from "./queue-group-name";
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = QUEUE_GROUP_NAME;
  onMessage = async (data: OrderCreatedEvent["data"], msg: Message) => {
    // Find the ticket that the order is reserving
    const ticket = await Ticket.findById(data.ticket.id);
    // If no ticket throw error
    if (!ticket) {
      throw new NotFoundError();
    }
    //Mark the tiket as being reserved by setting its orderid property
    ticket.set({ orderId: data.id });
    //Save ticket
    await ticket.save();

    //Publish ticket update event
    new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      version: ticket.version,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      orderId: ticket?.orderId,
    });
    //Ack
    msg.ack();
  };
}
