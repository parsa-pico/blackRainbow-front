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
import { useGlobalLoading } from "../../../context/globalLoadingContext";
export default function GetCustomers() {
  const setGlobalLoading = useGlobalLoading()[1];
  const [customers, setCustomers] = useState([]);
  const [phoneNumber, setPhoneNumber] = useState("");
  const nav = useNavigate();
  useEffect(() => {
    search();
  }, []);
  function search() {
    tryHTTP(
      async (http) => {
        setGlobalLoading(true);
        let api = "/customers";
        if (phoneNumber) api += `?phoneNumber=${phoneNumber}`;
        let { data } = await http.get(api, { phoneNumber });

        setCustomers(data);
      },
      () => {
        setGlobalLoading(false);
      }
    );
  }

  return (
    <div className="">
      <div className="vstack ">
        <h1 style={{ textAlign: "center" }}> مدیریت کاربران </h1>
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
                <th>شماره موبایل</th>
                <th>تعداد سفارشات</th>
                <th>مشاهده سفارشات</th>
              </tr>
            </thead>
            <tbody>
              {customers &&
                customers.length > 0 &&
                customers.map((customer, i) => {
                  return (
                    <tr key={i}>
                      <td>{i}</td>
                      <td>{customer.phoneNumber}</td>
                      <td>{customer.ordersCount}</td>
                      <td
                        className="pointer"
                        onClick={() => {
                          nav(
                            `/admin/orders?phoneNumber=${customer.phoneNumber}`
                          );
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
