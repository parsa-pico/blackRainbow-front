import React from "react";
import { Checkbox, FormControlLabel, TextField } from "@mui/material";
import { fields } from "./baseFields";

export default function FillInfo({ orderInfo, handleChange }) {
  return (
    <div className="vstack bg-dark cart-fill-info">
      <h4 className="my-3 mb-1">اطلاعات تحویل گیرنده</h4>
      <small className="my-3 mt-1">
        لطفا اطلاعات زیر را به صورت فارسی پر کنید
      </small>
      <TextFields
        handleChange={handleChange}
        item={orderInfo}
        textFields={fields}
      />
    </div>
  );
}

function TextFields({ textFields, item, handleChange }) {
  return (
    <div>
      {textFields.map((obj, i) => {
        const { name, type, label, required, ...rest } = obj;
        return (
          <TextField
            key={i}
            fullWidth
            sx={{ display: "block", width: "100%" }}
            name={name}
            type={type || "text"}
            required={required}
            onChange={handleChange}
            value={item[name]}
            label={label}
            {...rest}
            variant="outlined"
            className="my-3"
          />
        );
      })}
    </div>
  );
}
