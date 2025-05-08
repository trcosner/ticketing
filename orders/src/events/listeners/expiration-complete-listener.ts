import {
  BadRequestError,
  ExpirationCompleteEvent,
  Listener,
  NotFoundError,
  OrderStatus,
  Subjects,
} from "@trc-ticketing/common";
import { Message } from "node-nats-streaming";
import { QUEUE_GROUP_NAME } from "./queue-group-name";
import { Order } from "../../models/order";
import { OrderCanceledPublisher } from "../publishers/order-canceled-publisher";

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
  readonly subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
  queueGroupName = QUEUE_GROUP_NAME;
  onMessage = async (data: ExpirationCompleteEvent["data"], msg: Message) => {
    const order = await Order.findById(data.orderId).populate("ticket");
    if (!order) {
      return new BadRequestError("Order not found");
    }

    order.set({ status: OrderStatus.Canceled });
    await order.save();
    new OrderCanceledPublisher(this.client).publish({
      id: order.id,
      version: order.version,
      ticket: { id: order.ticket.id },
    });
    msg.ack();
  };
}
