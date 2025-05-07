import { Listener, Subjects, TicketCreatedEvent } from "@trc-ticketing/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";
import { QUEUE_GROUP_NAME } from "./queue-group-name";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName = QUEUE_GROUP_NAME;
  onMessage = async (data: TicketCreatedEvent["data"], msg: Message) => {
    const ticket = Ticket.build({
      id: data.id,
      title: data.title,
      price: data.price,
    });

    await ticket.save();
    msg.ack();
  };
}
