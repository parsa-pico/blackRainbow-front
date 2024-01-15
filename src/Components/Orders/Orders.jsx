import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { getDate, getOrderStatus, tryHTTP } from "../../Common/commonFuncs";
import { DataGrid } from "@mui/x-data-grid";
import { Table } from "react-bootstrap";
import { getPrice } from "./../../Common/commonFuncs";
import FolderIcon from "@mui/icons-material/Folder";
import { useNavigate } from "react-router-dom";
import { useGlobalLoading } from "./../../context/globalLoadingContext";
export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [_, setGlobalLoading] = useGlobalLoading();
  const nav = useNavigate();
  useEffect(() => {
    search();
  }, []);
  function search() {
    tryHTTP(
      async (http) => {
        setGlobalLoading(true);
        let { data } = await http.get("/orders");
        let { orders: orders_, OrderStatus } = data;
        console.log(OrderStatus);
        orders_ = orders_.map((obj, i) => ({
          ...obj,
          id: i,
          status: getOrderStatus(obj, OrderStatus),
        }));
        setOrders(orders_);
      },
      () => {
        setGlobalLoading(false);
      }
    );
  }

  return (
    <div className="">
      <div className="">
        <h1 style={{ textAlign: "center" }}>سفارشات من</h1>
        <div className="order-table-wrapper">
          <Table
            style={{ textAlign: "center" }}
            className="order-table"
            hover
            size="md"
          >
            <thead>
              <tr>
                <th>#</th>
                <th>تاریخ سفارش </th>
                <th>وضعیت پرداخت</th>
                <th>هزینه کل</th>
                <th> مشاهده جزیییات</th>
              </tr>
            </thead>
            <tbody>
              {orders &&
                orders.length > 0 &&
                orders.map((order, i) => {
                  const date = getDate(order.createdAt);
                  return (
                    <tr key={i}>
                      <td>{i}</td>
                      <td>{date}</td>
                      <td>{order.status && order.status.text}</td>
                      <td>{getPrice(order.totalPrice)} </td>
                      <td
                        onClick={() => {
                          nav(`/orders/${order._id}`);
                        }}
                      >
                        <FolderIcon />
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  );
}
