import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { getPicture, getPrice, tryHTTP } from "../../Common/commonFuncs";
import { PurchaseIncrease } from "../Items/PurchaseIncrease";
import { Chip } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function GetCart({
  cart,
  handleCart,
  loading,
  readOnly,
  getTotalPrice,
}) {
  const nav = useNavigate();

  return (
    <div className="vstack p-5 bg-dark">
      <h2 style={{ textAlign: "center" }}>سبد محصولات</h2>
      {cart &&
        cart.length > 0 &&
        cart.map((item, i) => {
          return (
            <div key={i} className="cart-item-container bg-dark my-3">
              <div className="cart-img-purchase">
                <img
                  onClick={() => {
                    nav("/items/" + item.itemId);
                  }}
                  src={getPicture(item.picture)}
                  className="img-fluid cart-img pointer"
                />
                {!readOnly && (
                  <div className="cart-purchase-wrapper">
                    <PurchaseIncrease
                      handleCart={(q) => handleCart(q, item)}
                      fontSize="small"
                      className="bg-dark"
                      quantity={item.quantity}
                      loading={loading}
                    />
                  </div>
                )}
              </div>
              <div className="cart-item-desc me-2">
                <h3 className="cart-item-title mt-2">{item.productName}</h3>
                <div className="mt-1">
                  <p className="mb-1">
                    قیمت واحد:
                    <div>{getPrice(item.price)} تومان</div>
                    {item.originalPrice && (
                      <small className="items-original-price mt-1">
                        {getPrice(item.originalPrice)} تومان
                      </small>
                    )}
                  </p>
                  {readOnly && <p>تعداد:{item.quantity}</p>}
                  <div className="mb-5">
                    {item.options &&
                      Object.entries(item.options).map(([key, value], i) => {
                        return (
                          <div key={i}>
                            <div>
                              {key}:{value}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
                <Chip
                  size="small"
                  label={getPrice(item.price * item.quantity) + " تومان"}
                  className="cart-item-price"
                ></Chip>
              </div>
            </div>
          );
        })}
      <div>
        <h6 className="my-2">
          مجموع هزینه اقلام :{getTotalPrice().cartTotal} {" تومان"}{" "}
        </h6>
        <h6 className="my-2">
          هزینه پست :{getTotalPrice().postPrice} {" تومان"}{" "}
        </h6>
        <h5 className="mt-3">
          هزینه نهایی :{getTotalPrice().total} {" تومان"}{" "}
        </h5>
      </div>
    </div>
  );
}
