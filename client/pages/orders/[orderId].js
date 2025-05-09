import { useState, useEffect } from "react";
import useRequest from "../../hooks/useRequest";
import StripeCheckout from "react-stripe-checkout";
import { useRouter } from "next/router";

// public, but create secret for this anyway - deprecated must override in stripe
const STRIPE_PUBLISHABLE_KEY =
  "pk_test_51RMePePwvUY4zrdovIf0D7KwfUMVC2SFvnE9bcouYQF4gbW0KML894uKp5vlNQsaPJ4Fkd9qKIN8ofvypBPVR7XI00SLVKHSKS";
const OrderDetailsPage = ({ currentUser, order }) => {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(msLeft / 1000));
    };
    findTimeLeft();
    const timerId = setInterval(findTimeLeft, 1000);
    return () => {
      clearInterval(timerId);
    };
  }, []);

  const { doRequest: createPayment, errors } = useRequest({
    url: "/api/payments",
    method: "post",
    body: { orderId: order.id },
    onSuccess: (payment) => {
      console.log("success", payment);
      router.push("/orders");
    },
  });

  return (
    <div>
      <h1>Purchasing {order.title}</h1>
      <h4>Price {order.price}</h4>
      <h3>
        {timeLeft > 0
          ? `${timeLeft} Seconds until order expires`
          : "Order has expired"}
      </h3>
      {errors}

      <StripeCheckout
        token={(token) => {
          createPayment({ token: token.id });
        }}
        amount={order.ticket.price * 100}
        email={currentUser.email}
        stripeKey={STRIPE_PUBLISHABLE_KEY}
      />
    </div>
  );
};

OrderDetailsPage.getInitialProps = async (context, client, currentUser) => {
  const { orderId } = context.query;

  const { data } = await client.get(`/api/orders/${orderId}`);
  return { order: data };
};

export default OrderDetailsPage;
