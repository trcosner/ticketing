const OrdersPage = ({ orders }) => {
  return (
    <ul>
      {orders.map((order) => {
        return (
          <li key={order.id}>
            {order.ticket.title} - {order.status}
          </li>
        );
      })}
    </ul>
  );
};

OrdersPage.getInitialProps = async (context, client) => {
  let orders;
  try {
    const { data } = await client.get("/api/orders");
    orders = data;
  } catch (e) {
    console.log("err", e);
  }

  return { orders };
};
export default OrdersPage;
