import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import {
  getDate,
  tryHTTP,
  getPrice,
  getOrderStatus,
} from "../../../Common/commonFuncs";
import { Container, Form, Table } from "react-bootstrap";
import FolderIcon from "@mui/icons-material/Folder";
import { useNavigate } from "react-router-dom";
import { Button, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [phoneNumber, setPhoneNumber] = useState("");
  const nav = useNavigate();
  useEffect(() => {
    search();
  }, []);
  function search() {
    tryHTTP(async (http) => {
      let { data } = await http.post("/orders/admin-get", { phoneNumber });
      let { orders: orders_, OrderStatus } = data;
      console.log(OrderStatus);
      orders_ = orders_.map((obj, i) => ({
        ...obj,
        id: i,
        status: getOrderStatus(obj, OrderStatus),
      }));
      setOrders(orders_);
    });
  }

  return (
    <div className="">
      <div className="vstack ">
        <h1 style={{ textAlign: "center" }}>مدیریت سفارشات </h1>
        <Container className="d-flex mt-2" style={{ justifyContent: "center" }}>
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              search();
            }}
            className="nav-search-wrapper d-flex"
          >
            <Form.Control
              value={phoneNumber}
              onChange={({ target }) => setPhoneNumber(target.value)}
              placeholder="شماره موبایل"
              className="nav-search mb-2"
              aria-label="Search"
            />
            <Button type="submit" style={{ color: "var(--dark)" }}>
              <SearchIcon className="nav-search-icon" />
            </Button>
          </Form>
        </Container>
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
                      <td style={{ color: order.status.color }}>
                        {order.status.text}
                      </td>
                      <td>{getPrice(order.totalPrice)} </td>
                      <td
                        onClick={() => {
                          nav(`/admin/orders/${order._id}`);
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
