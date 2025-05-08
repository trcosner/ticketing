import {
  ExpirationCompleteEvent,
  Publisher,
  Subjects,
  TicketCreatedEvent,
} from "@trc-ticketing/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
