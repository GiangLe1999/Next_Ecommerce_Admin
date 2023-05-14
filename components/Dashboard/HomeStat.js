import { formatCurrency } from "@/lib/currency";
import axios from "axios";
import { subHours } from "date-fns";
import React, { useEffect, useState } from "react";
import Spinner from "../UI/Spinner";

const HomeStat = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);

    axios.get("/api/orders").then((res) => {
      setOrders(res.data);
      setIsLoading(false);
    });
  }, []);

  const todayOrders = orders.filter(
    (o) => new Date(o.createdAt) > subHours(new Date(), 24)
  );

  const weekOrders = orders.filter(
    (o) => new Date(o.createdAt) > subHours(new Date(), 24 * 7)
  );

  const monthOrders = orders.filter(
    (o) => new Date(o.createdAt) > subHours(new Date(), 24 * 30)
  );

  const ordersTotalRevenue = (orders) => {
    return orders.reduce((acc, cur) => {
      const orderPrice = cur.line_items.reduce((acc1, cur1) => {
        const itemsPrice = (cur1.quantity * cur1.price_data.unit_amount) / 100;
        return acc1 + itemsPrice;
      }, 0);

      return acc + orderPrice;
    }, 0);
  };

  return (
    <>
      {isLoading && (
        <div className="p-8">
          <Spinner />
        </div>
      )}
      {!isLoading && (
        <>
          {/* Orders */}
          <h2 className="title">Orders</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="section">
              <h3 className="subTitle">Today</h3>
              <div className="value">{todayOrders.length}</div>
              <div className="desc">
                {todayOrders.length}{" "}
                {todayOrders.length > 1 ? "orders" : "order"} today
              </div>
            </div>
            <div className="section">
              <h3 className="subTitle">This week</h3>
              <div className="value">{weekOrders.length}</div>
              <div className="desc">
                {weekOrders.length} {weekOrders.length > 1 ? "orders" : "order"}{" "}
                this week
              </div>
            </div>
            <div className="section">
              <h3 className="subTitle">This month</h3>
              <div className="value">{monthOrders.length}</div>
              <div className="desc">
                {monthOrders.length}{" "}
                {monthOrders.length > 1 ? "orders" : "order"} this month
              </div>
            </div>
          </div>

          {/* Revenue */}
          <h2 className="title mt-7">Revenue</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="section">
              <h3 className="subTitle">Today</h3>
              <div className="value">
                {formatCurrency(ordersTotalRevenue(todayOrders))}
              </div>
              <div className="desc">
                For {todayOrders.length}{" "}
                {todayOrders.length > 1 ? "orders" : "order"} today
              </div>
            </div>
            <div className="section">
              <h3 className="subTitle">This week</h3>
              <div className="value">
                {formatCurrency(ordersTotalRevenue(weekOrders))}
              </div>
              <div className="desc">
                For {weekOrders.length}{" "}
                {weekOrders.length > 1 ? "orders" : "order"} this week
              </div>
            </div>
            <div className="section">
              <h3 className="subTitle">This month</h3>
              <div className="value">
                {formatCurrency(ordersTotalRevenue(monthOrders))}
              </div>
              <div className="desc">
                For {monthOrders.length}{" "}
                {monthOrders.length > 1 ? "orders" : "order"} this month
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default HomeStat;
