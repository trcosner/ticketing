import { Publisher, OrderCanceledEvent, Subjects } from "@trc-ticketing/common";

export class OrderCanceledPublisher extends Publisher<OrderCanceledEvent> {
  readonly subject: Subjects.OrderCanceled = Subjects.OrderCanceled;
}
