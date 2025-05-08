import { Listener, Subjects, OrderCreatedEvent } from "@trc-ticketing/common";
import { Message } from "node-nats-streaming";
import { QUEUE_GROUP_NAME } from "./queue-group-name";
import { Order } from "../../models/order";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = QUEUE_GROUP_NAME;
  onMessage = async (data: OrderCreatedEvent["data"], msg: Message) => {
    const order = Order.build({
      id: data.id,
      userId: data.userId,
      status: data.status,
      version: data.version,
      price: data.ticket.price,
    });
    await order.save();
    msg.ack();
  };
}
