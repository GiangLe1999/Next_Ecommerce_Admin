import axios from "axios";
import React, { useEffect, useState } from "react";

import Spinner from "@/components/UI/Spinner";
import prettyDate from "@/lib/date";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    axios.get("/api/orders").then((res) => {
      setOrders(res.data);
      setIsLoading(false);
    });
  }, []);

  return (
    <>
      <h1>Orders</h1>
      <table className="basic">
        <thead>
          <tr>
            <th className="w-1/4">Date</th>
            <th className="w-1/12 text-center">Paid</th>
            <th className="w-2/5">Recipient</th>
            <th>Products</th>
          </tr>
        </thead>
        <tbody>
          {isLoading && (
            <tr>
              <td colSpan={4}>
                <div className="p-10 text-center w-full">
                  <Spinner />
                </div>
              </td>
            </tr>
          )}
          {orders.length > 0 &&
            orders.map((order) => (
              <tr key={order._id}>
                <td className="w-1/4">{prettyDate(order.createdAt)}</td>
                <td
                  className={`w-1/12 font-bold ${
                    order.paid ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {order.paid ? "YES" : "NO"}
                </td>
                <td className="w-2/5">
                  <p className="mb-2">
                    <b>Name: &nbsp;</b>
                    {order.name}
                  </p>
                  <p className="mb-2">
                    <b>Email: &nbsp;</b>
                    {order.email}
                  </p>
                  <p className="mb-2">
                    <b>City: &nbsp;</b>
                    {order.city} {order.postalCode}
                  </p>
                  <p className="mb-2">
                    <b>Country: &nbsp;</b>
                    {order.country}
                  </p>
                  <p className="mb-2">
                    <b>Street Adress: &nbsp;</b>
                    {order.streetAddress}
                  </p>
                </td>
                <td>
                  {order.line_items.map((l) => (
                    <>
                      <p className="mb-2">
                        <b>{l.price_data?.product_data.name}</b> - {l.quantity}
                        &nbsp;items
                      </p>
                    </>
                  ))}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </>
  );
};

export default Orders;
