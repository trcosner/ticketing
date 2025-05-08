import { OrderStatus } from "@trc-ticketing/common";
import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface OrderAttrs {
  id: string;
  userId: string;
  status: OrderStatus;
  price: number;
  version: number;
}

interface OrderModel extends mongoose.Model<OrderDoc> {
  build: (attrs: OrderAttrs) => OrderDoc;
}

interface OrderDoc extends mongoose.Document {
  userId: string;
  status: OrderStatus;
  price: number;
  version: number;
}

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(OrderStatus),
      default: OrderStatus.Created,
    },
  },
  {
    versionKey: false,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

orderSchema.pre("save", async function (done) {
  done();
});

orderSchema.set("versionKey", "version");
orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.statics.build = (attrs: OrderAttrs) =>
  new Order({
    _id: attrs.id,
    version: attrs.version,
    price: attrs.price,
    userId: attrs.userId,
    status: attrs.status,
  });

const Order = mongoose.model<OrderDoc, OrderModel>("Order", orderSchema);

export { Order, OrderStatus };
