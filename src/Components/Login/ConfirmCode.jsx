import React from "react";
import { Button, Input, TextField } from "@mui/material";
import Form from "react-bootstrap/Form";
import { tryHTTP } from "../../Common/commonFuncs";
import httpService from "../../Services/httpService";
import { ToastContainer, toast } from "react-toastify";
import { useToast } from "./../../context/toastContext";
import { useState } from "react";
import { useEffect } from "react";
export default function ConfirmCode({
  phoneNumber,
  countDownThresh,
  sendCode,
}) {
  useEffect(() => {
    setCountDown(countDownThresh);
  }, [countDownThresh]);
  const [countDown, setCountDown] = useState(countDownThresh);
  useEffect(() => {
    if (countDown > 0)
      setTimeout(() => {
        setCountDown(countDown - 1);
      }, 1000);
  }, [countDown]);

  const [code, setCode] = useState("");
  return (
    <div>
      <div className="mt-5 v-stack">
        <h3>کد تایید را وارد کنید </h3>
        <p className="mt-3" style={{ fontSize: "0.9rem" }}>
          برای شماره {phoneNumber} ارسال شد
        </p>
        <TextField
          id="standard-basic"
          label=" کد تایید"
          className="mb-5 w-100"
          variant="standard"
          value={code}
          onChange={({ target }) => {
            let number = target.value;
            setCode(number);
          }}
        />
        {countDown !== 0 && (
          <small>
            ارسال دوباره در
            <span className="mx-1 inline-block">{countDown} </span>
            ثانیه بعد
          </small>
        )}
        {countDown === 0 && (
          <Button
            onClick={sendCode}
            variant="text"
            className="w-100 justify-content-start mb-4"
          >
            دریافت مجدد کد تایید
          </Button>
        )}
        <Button onClick={() => {}} variant="outlined" className="w-100 mt-3">
          تایید
        </Button>
      </div>
    </div>
  );
}
