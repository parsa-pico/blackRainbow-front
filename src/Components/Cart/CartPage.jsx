import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { getPicture, getPrice, tryHTTP } from "../../Common/commonFuncs";
import { PurchaseIncrease } from "../Items/PurchaseIncrease";
import { Box, Button, Chip, Modal, Stepper, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import GetCart from "./GetCart";
import MyStepper from "./MyStepper";
import FillInfo from "./FillInfo";
import PaymentMehtod from "./PaymentMehtod";
import { fields } from "./baseFields";
import {
  getAnonymousId,
  getOrderInfo,
  setOrderInfoStroage,
} from "../../Services/authService";
import { toast } from "react-toastify";
import { useGlobalLoading } from "../../context/globalLoadingContext";

export default function CartPage() {
  const [loading, setLoading] = useState(false);
  const [cart, setCart] = useState([]);
  const [postPrice, setPostPrice] = useState(0);
  const [orderInfo, setOrderInfo] = useState(getOrderInfo() || {});
  const [globalLoading, setGlobalLoading] = useGlobalLoading();
  const nav = useNavigate();
  const totalSteps = 4;
  const [activeStep, setActiveStep] = React.useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeStep]);
  function handleSubmitPurchase() {
    tryHTTP(
      async (http) => {
        const order = { ...orderInfo };
        if (!order.description) delete order.description;
        const { data } = await http.post("/orders/submitPurchase", order);
        toast.success("خرید شما با موفقیت ثبت شد");
        setTimeout(() => {
          window.location = "/";
        }, 1000);
      },
      undefined,
      () => {
        setActiveStep(totalSteps - 2);
      }
    );
  }
  const handleNext = () => {
    if (getAnonymousId()) return nav("/login", { state: "/cart" });
    const newStep = activeStep + 1;
    setActiveStep(newStep);
    if (newStep === totalSteps - 1) handleSubmitPurchase();
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  useEffect(() => {
    getCart();
  }, []);
  function getTotalPrice() {
    let total = 0;
    if (cart && cart.length > 0)
      cart.forEach((obj) => (total += obj.price * obj.quantity));

    const cartTotal = total;
    total += postPrice;
    return {
      total: getPrice(total),
      cartTotal: getPrice(cartTotal),
      postPrice: getPrice(postPrice),
    };
  }
  function handleCart(quantity, itemData) {
    tryHTTP(
      async (http) => {
        setLoading(true);

        await http.post(`/carts/new/${itemData.itemId}`, {
          options: itemData.option,
          quantity,
        });
        await getCart();
      },
      () => {
        setLoading(false);
      }
    );
  }
  async function getCart() {
    tryHTTP(
      async (http) => {
        setGlobalLoading(true);
        const { data } = await http.get("/carts");
        setCart(data.cart);
        setPostPrice(data.postPrice);
        console.log(data);
      },
      () => {
        setGlobalLoading(false);
      }
    );
  }
  const handleChange = ({ target }) => {
    let value = target.value;

    if (target.type === "checkbox") value = target.checked;
    if (target.type === "number") {
      value = parseInt(value);
    }
    if (target.name === "paymentMethod") value = parseInt(value);
    const itemCopy = { ...orderInfo };
    const name = target.name;
    itemCopy[name] = value;

    setOrderInfo(itemCopy);
    setOrderInfoStroage(itemCopy);
  };

  function nextDisabled() {
    if (activeStep === totalSteps - 1) return true;
    if (activeStep === 1)
      for (let { name } of fields) {
        if (name !== "description" && !orderInfo[name]) return true;
      }

    if (
      activeStep === 2 &&
      orderInfo.paymentMethod === 2 &&
      !orderInfo.paymentPicture
    )
      return true;
  }
  return (
    <div className="cart-page-wrapper">
      <h1 className="mb-5">تکمیل خرید</h1>
      {cart.length === 0 && <h4>سبد خرید شما خالی است</h4>}

      {activeStep === 0 && cart.length > 0 && (
        <GetCart
          getTotalPrice={getTotalPrice}
          handleCart={handleCart}
          loading={loading}
          cart={cart}
        />
      )}
      {activeStep === 1 && (
        <FillInfo handleChange={handleChange} orderInfo={orderInfo} />
      )}
      {activeStep === 2 && (
        <PaymentMehtod
          setOrderInfo={setOrderInfo}
          getTotalPrice={getTotalPrice}
          handleChange={handleChange}
          orderInfo={orderInfo}
        />
      )}
      {cart.length > 0 && (
        <MyStepper
          nextDisabled={nextDisabled}
          orderInfo={orderInfo}
          totalSteps={totalSteps}
          activeStep={activeStep}
          handleBack={handleBack}
          handleNext={handleNext}
        />
      )}
    </div>
  );
}
