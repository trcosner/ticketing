import express, { Request, Response } from "express";
import { body } from "express-validator";
import {
  requireAuth,
  validateRequest,
  BadRequestError,
  NotFoundError,
  NotAuthorizedError,
  OrderStatus,
} from "@trc-ticketing/common";
import { Order } from "../models/order";
import { stripe } from "../stripe";

const router = express.Router();

router.post(
  "/api/payments",
  requireAuth,
  [
    body("token").not().isEmpty().withMessage("requires token"),
    body("orderId").not().isEmpty().withMessage("requires orderid"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { orderId, token } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      throw new NotFoundError();
    }
    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }
    if (order.status === OrderStatus.Canceled) {
      throw new BadRequestError("Cannot pay for a canceled order");
    }
    await stripe.charges.create({
      amount: order.price * 100,
      currency: "usd",
      source: token,
    });

    res.status(201).send({ success: true });
  }
);

export { router as createChargeRouter };
