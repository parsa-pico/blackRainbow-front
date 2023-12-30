import React from "react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import PaymentsIcon from "@mui/icons-material/Payments";
import { Chip } from "@mui/material";
import { toast } from "react-toastify";
import InputFileUpload from "../../Common/commonComponents";
import { readFile, tryHTTP } from "../../Common/commonFuncs";
import { useState } from "react";

export default function PaymentMehtod({
  orderInfo,
  handleChange,
  getTotalPrice,
  setOrderInfo,
}) {
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const cardNumber = "6037991943291835";
  const cardOwner = "پارسا فروزمند";
  const onFileChange = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      tryHTTP(
        async (http) => {
          toast.info("در حال آپلود فیش");
          setLoading(true);
          const file = e.target.files[0];
          const formData = new FormData();
          setFile(URL.createObjectURL(file));

          formData.append("picture", file, file.name);
          const { data } = await http.post(
            "/pictures/payment-picutre",
            formData
          );
          const paymentPicture = data.fileName;
          setOrderInfo((obj) => ({ ...obj, paymentPicture }));
          toast.success("فیش آپلود شد");
        },
        () => {
          setLoading(false);
        },
        () => {
          const copy = { ...orderInfo };
          delete copy.paymentPicture;
          setOrderInfo(copy);
          setFile(null);
        }
      );
    }
  };
  return (
    <div className="vstack bg-dark payment-method-wrapper ">
      <h3 className="my-2">انتخاب نحوه پرداخت</h3>
      <FormControl className="mt-2">
        <FormLabel>نحوه پرداخت</FormLabel>
        <RadioGroup
          value={orderInfo.paymentMethod || ""}
          onChange={handleChange}
          name="paymentMethod"
        >
          <FormControlLabel
            value={1}
            disabled
            control={<Radio />}
            label={
              <div>
                <CreditCardIcon className="ms-2" />
                پرداخت اینترنتی (غیرفعال)
              </div>
            }
          />
          <FormControlLabel
            value={2}
            control={<Radio />}
            label={
              <div>
                <PaymentsIcon className="ms-2" />
                کارت به کارت
              </div>
            }
          />
        </RadioGroup>
      </FormControl>
      {orderInfo && orderInfo.paymentMethod === 2 && (
        <div className="mt-4 cart-payment-2">
          <p>لطفا هزینه نهایی را به شماره زیر کارت به کارت کنید</p>
          <p>سپس عکس فیش را آپلود کنید</p>
          <Chip
            onClick={() => {
              navigator.clipboard.writeText(cardNumber);
              toast.success("شماره کارت کپی شد", { autoClose: 2000 });
            }}
            label={cardNumber}
            variant="outlined"
          />

          <small className="me-3">{cardOwner}</small>
          <InputFileUpload
            disabled={loading}
            onChange={onFileChange}
            className="mt-3"
            label={"اپلود عکس فیش"}
            accept="image/*"
          />
          {/* <small>{orderInfo.paymentPicture}</small> */}
          {file && (
            <img
              className="mt-2"
              src={file}
              style={{ maxWidth: "20%", height: "auto" }}
            />
          )}
        </div>
      )}
      <h5 className="mt-3 ">
        هزینه نهایی :{getTotalPrice().total} {" تومان"}{" "}
      </h5>
    </div>
  );
}
