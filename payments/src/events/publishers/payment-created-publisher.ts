import {
  Publisher,
  Subjects,
  PaymentCreatedEvent,
} from "@trc-ticketing/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
