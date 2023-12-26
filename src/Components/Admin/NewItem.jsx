import { Button, Checkbox, FormControlLabel, TextField } from "@mui/material";
import React from "react";
import { useState } from "react";

export default function NewItem() {
  const [textFields, setTextFields] = useState([
    {
      name: "productName",
      label: "نام محصول",
      required: true,
    },

    {
      name: "price",
      label: "قیمت به تومان",
      type: "number",
      required: true,
    },
    {
      name: "stock",
      label: "موجودی انبار",
      type: "number",
      required: true,
    },
    { name: "brand", label: " برند" },
    { name: "description", label: "توضیحات محصول", multiline: true },
  ]);
  const [item, setItem] = useState({
    productName: "",
    stock: "",
    price: "",
    brand: "",
    private: false,
  });

  const handleChange = ({ target }) => {
    const itemCopy = { ...item };
    const name = target.name;
    itemCopy[name] = target.value;
    setItem(itemCopy);
  };

  return (
    <div className="page-wrapper">
      <div className="page">
        <h2>کالای جدید</h2>
        <form
          className="w-100"
          onSubmit={(e) => {
            e.preventDefault();
            console.log("hi");
          }}
        >
          {textFields.map((obj, i) => {
            const { name, type, label, required, ...rest } = obj;
            return (
              <TextField
                key={i}
                sx={{ display: "block" }}
                name={name}
                type={type || "text"}
                required={required}
                onChange={handleChange}
                value={item[name]}
                label={label}
                {...rest}
                variant="outlined"
                className="my-3 w-100"
              />
            );
          })}
          <FormControlLabel
            name="private"
            value={item.private}
            onChange={handleChange}
            control={<Checkbox />}
            label="فقط به اعضا نشان داده شود"
          />
          <div>
            <Button variant="outlined" className="w-100" type="submit">
              ثبت
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
