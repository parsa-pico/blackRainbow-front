import React from "react";
import { useEffect } from "react";
import {
  getDate,
  getOrderStatus,
  getPicture,
  getPrice,
  tryHTTP,
} from "../../Common/commonFuncs";
import { useLocation, useParams } from "react-router-dom";
import { useState } from "react";
import { Table } from "react-bootstrap";
import GetCart from "../Cart/GetCart";
import { useGlobalLoading } from "../../context/globalLoadingContext";

export default function Order() {
  const [order, setOrder] = useState({});
  const [_, setGlobalLoading] = useGlobalLoading();
  const params = useParams();
  useEffect(() => {
    search();
  }, []);
  function search() {
    tryHTTP(
      async (http) => {
        setGlobalLoading(true);
        const { data } = await http.get("/orders/" + params.orderId);
        console.log(data);
        const { result, OrderStatus } = data;
        result.status = getOrderStatus(result, OrderStatus);

        result.paymentMethod =
          result.paymentMethod === 2 ? "کارت به کارت" : "پرداخت اینترنتی";
        setOrder(result);
      },
      () => {
        setGlobalLoading(false);
      }
    );
  }
  // useEffect(() => {
  //   console.log("order", order);
  // }, [order]);
  function getTotalPrice() {
    const { totalPrice, postPrice } = order;

    const cartTotal = totalPrice - postPrice;
    return {
      cartTotal: getPrice(cartTotal),
      total: getPrice(totalPrice),
      postPrice: getPrice(postPrice),
    };
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
              <td> شماره تماس</td>
              <td>{order.phoneNumber || "-"}</td>
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
            {/* <tr>
              <td>تاریخ آپدیت سفارش</td>
              <td>{getDate(order.updatedAt)}</td>
            </tr> */}
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
            {/* <tr>
              <td>هزینه باقی مانده</td>
              <td>{getPrice(order.remaningPrice) + " تومان"}</td>
            </tr> */}
            <tr>
              <td> کد رهگیری پست</td>
              <td>{order.postTrackingCode || "-"}</td>
            </tr>
            <tr>
              <td> بعدا ارسال شود</td>
              <td>{order.schedule ? getDate(order.schedule) : "-"}</td>
            </tr>
            <tr>
              <td> عکس فیش </td>
              <td>
                {order.paymentPicture ? (
                  <a target="_blank" href={getPicture(order.paymentPicture)}>
                    لینک
                  </a>
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
      </div>
    </div>
  );
}
