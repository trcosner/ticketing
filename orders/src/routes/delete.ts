import {
  NotAuthorizedError,
  NotFoundError,
  OrderStatus,
  requireAuth,
} from "@trc-ticketing/common";
import express, { Request, Response } from "express";
import { Order } from "../models/order";
import { OrderCanceledPublisher } from "../events/publishers/order-canceled-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();
// update this to PATCH and return a different status id
router.delete(
  "/api/orders/:orderId",
  requireAuth,
  async (req: Request, res: Response) => {
    const userId = req.currentUser!.id;
    const orderId = req.params.orderId;
    const order = await Order.findById(orderId).populate("ticket");
    if (!order) {
      throw new NotFoundError();
    }
    if (order.userId !== userId) {
      throw new NotAuthorizedError();
    }
    order.set({ status: OrderStatus.Canceled });
    await order.save();

    //publish an order:canceled event
    new OrderCanceledPublisher(natsWrapper.client).publish({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.id,
      },
    });

    res.status(204).send(order);
  }
);

export { router as deleteOrderRouter };
