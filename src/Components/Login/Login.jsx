import { Button, Input, TextField } from "@mui/material";
import React from "react";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Form from "react-bootstrap/Form";
import { tryHTTP } from "../../Common/commonFuncs";
import httpService from "../../Services/httpService";
import { ToastContainer, toast } from "react-toastify";
import { useToast } from "./../../context/toastContext";
import LoadingButton from "@mui/lab/LoadingButton";
import { useState } from "react";
import { useEffect } from "react";
import ConfirmCode from "./ConfirmCode";
import { Suspense } from "react";

export default function Login() {
  const { toast } = useToast();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [countDownThresh, setCountDownThresh] = useState(100);

  function sendCode() {
    tryHTTP(
      async () => {
        setLoading(true);
        const { data: result } = await httpService.post(
          "/customers/send-code",
          {
            phoneNumber,
          }
        );
        console.log(result);
        setCountDownThresh(result.codeExpires);
        setCodeSent(true);
      },
      () => {
        setLoading(false);
      },
      (e) => {
        if (e.response.status === 429) {
          console.log(e.response.data.codeExpires);
          setCountDownThresh(e.response.data.codeExpires);
          setCodeSent(true);
        }
      }
    );
  }

  return (
    <div className="login-page-wrapper">
      <div className="login-page">
        {codeSent && (
          <ArrowForwardIcon
            onClick={() => {
              setCodeSent(false);
            }}
            className="login-back"
          />
        )}
        <img
          className="login-logo"
          src="/logo.png"
          onClick={() => {
            window.location = "/";
          }}
          alt=""
        />
        {codeSent && (
          <ConfirmCode
            sendCode={sendCode}
            countDownThresh={countDownThresh}
            phoneNumber={phoneNumber}
          />
        )}
        {!codeSent && (
          <div className="mt-5 v-stack w-100">
            <h3>ورود|ثبت نام</h3>
            <p>لطفا شماره موبایل خود را وارد کنید</p>
            <TextField
              id="standard-basic"
              label="شماره همراه"
              className="mb-5 w-100"
              variant="standard"
              value={phoneNumber}
              onChange={({ target }) => {
                let number = target.value;
                if (number && number[0] !== "0") number = "0" + number;
                setPhoneNumber(number);
              }}
            />

            <LoadingButton
              loading={loading}
              onClick={sendCode}
              variant="outlined"
              className="w-100"
            >
              <span>ورود</span>
            </LoadingButton>
          </div>
        )}
      </div>
    </div>
  );
}
