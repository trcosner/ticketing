import {
  Listener,
  NotFoundError,
  OrderCanceledEvent,
  Subjects,
} from "@trc-ticketing/common";
import { QUEUE_GROUP_NAME } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";

export class OrderCanceledListener extends Listener<OrderCanceledEvent> {
  readonly subject: Subjects.OrderCanceled = Subjects.OrderCanceled;
  queueGroupName = QUEUE_GROUP_NAME;

  onMessage = async (data: OrderCanceledEvent["data"], msg: Message) => {
    // Find the ticket that the order is reserving
    const ticket = await Ticket.findById(data.ticket.id);
    // If no ticket throw error
    if (!ticket) {
      throw new NotFoundError();
    }

    ticket.set({ orderId: undefined });
    //Save ticket
    await ticket.save();

    //Publish ticket update event
    new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      version: ticket.version + 1,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      orderId: ticket.orderId,
    });
    //Ack
    msg.ack();
  };
}
