import { Checkbox, FormControlLabel, TextField } from "@mui/material";
import React from "react";

export default function TextFields({ textFields, item, handleChange }) {
  return (
    <div>
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
    </div>
  );
}
