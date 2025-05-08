import {
  Listener,
  NotFoundError,
  Subjects,
  TicketUpdatedEvent,
} from "@trc-ticketing/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";
import { QUEUE_GROUP_NAME } from "./queue-group-name";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  readonly subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  queueGroupName = QUEUE_GROUP_NAME;
  onMessage = async (data: TicketUpdatedEvent["data"], msg: Message) => {
    const ticket = await Ticket.findByEvent(data);
    if (!ticket) {
      throw new NotFoundError();
    }

    ticket.set({ title: data.title, price: data.price });
    await ticket.save();
    msg.ack();
  };
}
