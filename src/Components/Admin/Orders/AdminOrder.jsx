import React from "react";
import { useEffect } from "react";
import {
  getDate,
  getOrderStatus,
  getPicture,
  getPrice,
  tryHTTP,
} from "../../../Common/commonFuncs";
import { useLocation, useParams } from "react-router-dom";
import { useState } from "react";
import { Table } from "react-bootstrap";
import GetCart from "../../Cart/GetCart";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { toast } from "react-toastify";
import { LoadingButton } from "@mui/lab";

export default function AdminOrder() {
  const [order, setOrder] = useState({});
  const [status, setStatus] = useState(1);
  const [postTrackingCode, setPostTrackingCode] = useState("");
  const [OrderStatus, setOrderStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const params = useParams();
  useEffect(() => {
    search();
  }, []);
  function search() {
    tryHTTP(
      async (http) => {
        setLoading(true);
        const { data } = await http.get("/orders/" + params.orderId);

        const { result, OrderStatus: OrderStatus_ } = data;

        setStatus(result.status);
        result.status = getOrderStatus(result, OrderStatus_);
        setOrderStatus(OrderStatus_);
        result.paymentMethod =
          result.paymentMethod === 2 ? "کارت به کارت" : "پرداخت اینترنتی";

        setOrder(result);
        setPostTrackingCode(result.postTrackingCode || "");
      },
      () => {
        setLoading(false);
      }
    );
  }

  function getTotalPrice() {
    const { totalPrice, postPrice } = order;

    const cartTotal = totalPrice - postPrice;
    return {
      cartTotal: getPrice(cartTotal),
      total: getPrice(totalPrice),
      postPrice: getPrice(postPrice),
    };
  }
  function updateOrder() {
    tryHTTP(async (http) => {
      const obj = { status };
      if (postTrackingCode) obj.postTrackingCode = postTrackingCode;
      await http.put(`/orders/${order._id}`, obj);
      toast.success("وضعیت سفارش آپدیت شد");
      setTimeout(() => {
        window.location = "/admin/orders";
      }, 1000);
    });
  }

  return (
    <div className="page-wrapper " style={{ alignItems: "stretch" }}>
      <div className="page p-4">
        <h2 className="my-2">جزییات سفارش</h2>

        <Table striped>
          <tbody>
            <tr>
              <td>نام</td>
              <td>{order.firstName}</td>
            </tr>
            <tr>
              <td>نام خانوادگی</td>
              <td>{order.lastName}</td>
            </tr>
            <tr>
              <td>استان</td>
              <td>{order.province}</td>
            </tr>
            <tr>
              <td>شهر</td>
              <td>{order.city}</td>
            </tr>
            <tr>
              <td>آدرس</td>
              <td>{order.address}</td>
            </tr>
            <tr>
              <td>کد پستی</td>
              <td>{order.postalCode}</td>
            </tr>
            <tr>
              <td> توضیحات سفارش</td>
              <td>{order.description}</td>
            </tr>
            <tr>
              <td>تاریخ ثبت سفارش</td>
              <td>{getDate(order.createdAt)}</td>
            </tr>
            <tr>
              <td>تاریخ آپدیت سفارش</td>
              <td>{getDate(order.updatedAt)}</td>
            </tr>
            <tr>
              <td> روش پرداخت</td>
              <td>{order.paymentMethod}</td>
            </tr>
            <tr>
              <td> وضعیت پرداخت</td>
              <td>{order.status && order.status.text}</td>
            </tr>
            <tr>
              <td> هزینه پست</td>
              <td>{getPrice(order.postPrice) + " تومان"}</td>
            </tr>
            <tr>
              <td>هزینه کل</td>
              <td>{getPrice(order.totalPrice) + " تومان"}</td>
            </tr>
            <tr>
              <td>هزینه باقی مانده</td>
              <td>{getPrice(order.remaningPrice) + " تومان"}</td>
            </tr>
            <tr>
              <td> کد رهگیری پست</td>
              <td>{order.postTrackingCode || "-"}</td>
            </tr>
            <tr>
              <td> عکس فیش </td>
              <td>
                {order.paymentPicture ? (
                  <a href={getPicture(order.paymentPicture)}>لینک</a>
                ) : (
                  "-"
                )}
              </td>
            </tr>
          </tbody>
        </Table>
        <h4 className="my-2">جزییات سبد خرید</h4>
        <GetCart
          getTotalPrice={getTotalPrice}
          cart={order && order.items}
          readOnly
        />
        <div className="my-3" style={{ alignSelf: "flex-start" }}>
          <TextField
            className="my-3"
            label="کد رهگیری پست"
            value={postTrackingCode}
            onChange={({ target }) => setPostTrackingCode(target.value)}
          />
          <FormControl fullWidth>
            <InputLabel id="order-status">وضعیت سفارش</InputLabel>
            <Select
              labelId="order-status"
              value={OrderStatus ? status : ""}
              label="وضعیت سفارش"
              onChange={(e) => setStatus(parseInt(e.target.value))}
            >
              {OrderStatus &&
                Object.entries(OrderStatus).map(([value, text], i) => {
                  return (
                    <MenuItem key={i} value={parseInt(value)}>
                      {text}
                    </MenuItem>
                  );
                })}
            </Select>
          </FormControl>
        </div>
        <LoadingButton
          loading={loading}
          color="warning"
          variant="outlined"
          className="w-100 mt-2"
          onClick={updateOrder}
        >
          <span>آپدیت وضعیت سفارش</span>
        </LoadingButton>
      </div>
    </div>
  );
}
