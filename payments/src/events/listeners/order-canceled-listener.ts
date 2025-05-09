import {
  Listener,
  NotFoundError,
  OrderCanceledEvent,
  OrderStatus,
  Subjects,
} from "@trc-ticketing/common";
import { QUEUE_GROUP_NAME } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";

export class OrderCanceledListener extends Listener<OrderCanceledEvent> {
  readonly subject: Subjects.OrderCanceled = Subjects.OrderCanceled;
  queueGroupName = QUEUE_GROUP_NAME;

  onMessage = async (data: OrderCanceledEvent["data"], msg: Message) => {
    const orders = await Order.find();
    console.log({ orders });
    console.log({ data });
    const order = await Order.findOne({
      _id: data.id,
      version: data.version - 1,
    });
    console.log({ order });
    if (!order) {
      throw new NotFoundError();
    }

    order.set({ status: OrderStatus.Canceled });
    await order.save();
    msg.ack();
  };
}
