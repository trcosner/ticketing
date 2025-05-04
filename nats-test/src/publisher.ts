import { randomBytes } from "crypto";
import nats from "node-nats-streaming";

console.clear();
const clientId = randomBytes(4).toString("hex");

const stan = nats.connect("ticketing", clientId, {
  url: "http://localhost:4222",
});

stan.on("connect", () => {
  console.log("Publisher connected to NATS");

  stan.on("close", () => {
    console.log("NATS connection closed!");
    process.exit();
  });

  const data = JSON.stringify({
    id: "123",
    title: "concert",
    price: 20,
  });

  stan.publish("ticket:created", data, () => {
    console.log("Event published.");
  });
});

process.on("SIGINT", () => stan.close());
process.on("SIGTERM", () => stan.close());
