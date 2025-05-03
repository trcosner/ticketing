import {
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
  validateRequest,
} from "@trc-ticketing/common";
import { body } from "express-validator";
import express, { Request, Response } from "express";
import { Ticket } from "../models/ticket";

const router = express.Router();

router.put(
  "/api/tickets/:id",
  requireAuth,
  [
    body("title").not().isEmpty().withMessage("Title is required"),
    body("price").not().isEmpty().withMessage("Price is required"),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("Price must be greater than 0"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, price } = req.body;
    const { id } = req.params;
    const ticket = await Ticket.findById(id);
    if (!ticket) {
      throw new NotFoundError();
    }

    if (ticket.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    await ticket.set({
      title,
      price,
    });

    await ticket.save();

    res.status(200).send(ticket);
  }
);

export { router as updateTicketRouter };
