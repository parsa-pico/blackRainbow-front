import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { getPicture, getPrice, tryHTTP } from "../../Common/commonFuncs";
import { PurchaseIncrease } from "../Items/PurchaseIncrease";
import { Chip, Stepper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import GetCart from "./GetCart";
import MyStepper from "./MyStepper";
import FillInfo from "./FillInfo";
import PaymentMehtod from "./PaymentMehtod";

export default function CartPage() {
  const [loading, setLoading] = useState(false);
  const [cart, setCart] = useState([]);
  const [orderInfo, setOrderInfo] = useState({});
  const nav = useNavigate();
  const totalSteps = 4;
  const [activeStep, setActiveStep] = React.useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeStep]);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    console.log("h");
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  useEffect(() => {
    getCart();
  }, []);
  function getTotalPrice() {
    const postPrice = 350000;
    let total =
      cart && cart.length > 0
        ? cart.reduce((a, b) => a.price + b.price * b.quantity)
        : 0;
    const cartTotal = total;
    total += 350000; //TODO: make this something that backend tells
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
    tryHTTP(async (http) => {
      const { data } = await http.get("/carts");
      setCart(data);
      console.log(data);
    });
  }
  const handleChange = ({ target }) => {
    let value = target.value;

    if (target.type === "checkbox") value = target.checked;
    if (target.type === "number") {
      value = parseInt(value);
    }
    const itemCopy = { ...orderInfo };
    const name = target.name;
    console.log(name, value);
    itemCopy[name] = value;
    setOrderInfo(itemCopy);
  };
  return (
    <div className="cart-page-wrapper">
      <h1 className="mb-5">تکمیل خرید</h1>
      {activeStep === 0 && (
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
      <MyStepper
        orderInfo={orderInfo}
        totalSteps={totalSteps}
        activeStep={activeStep}
        handleBack={handleBack}
        handleNext={handleNext}
      />
    </div>
  );
}
