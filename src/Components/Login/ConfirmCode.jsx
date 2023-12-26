import React from "react";
import { Button, Input, TextField } from "@mui/material";
import Form from "react-bootstrap/Form";
import { tryHTTP } from "../../Common/commonFuncs";
import httpService from "../../Services/httpService";
import { ToastContainer, toast } from "react-toastify";
import { useToast } from "./../../context/toastContext";
import { useState } from "react";
import { useEffect } from "react";
import { LoadingButton } from "@mui/lab";
import { useLocation, useNavigate } from "react-router-dom";
export default function ConfirmCode({
  phoneNumber,
  countDownThresh,
  sendCode,
}) {
  const nav = useNavigate();
  const loc = useLocation();
  const [countDown, setCountDown] = useState(countDownThresh);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setCountDown(countDownThresh);
  }, [countDownThresh]);

  useEffect(() => {
    if (countDown > 0)
      setTimeout(() => {
        setCountDown(countDown - 1);
      }, 1000);
  }, [countDown]);

  function verify() {
    tryHTTP(
      async () => {
        setLoading(true);
        const { data: result } = await httpService.post(
          "/customers/login-sms",
          {
            phoneNumber,
            code,
          }
        );
        const navPath = loc.state || "/";
        window.location = navPath;
      },
      () => {
        setLoading(false);
      }
    );
  }
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

        <small style={{ opacity: countDown !== 0 ? 1 : 0 }}>
          ارسال دوباره در
          <span className="mx-1 inline-block">{countDown} </span>
          ثانیه دیگر
        </small>

        <Button
          style={{ opacity: countDown === 0 ? 1 : 0 }}
          disabled={countDown !== 0}
          onClick={sendCode}
          variant="text"
          className="w-100 justify-content-start mb-4"
        >
          دریافت مجدد کد تایید
        </Button>

        <LoadingButton
          onClick={verify}
          variant="outlined"
          className="w-100 mt-3"
          loading={loading}
        >
          <span>تایید</span>
        </LoadingButton>
      </div>
    </div>
  );
}
