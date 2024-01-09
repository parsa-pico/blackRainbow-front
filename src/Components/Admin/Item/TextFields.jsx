import { Checkbox, FormControlLabel, TextField } from "@mui/material";
import React from "react";

export default function TextFields({ textFields, item, handleChange }) {
  return (
    <div className="w-100">
      {textFields.map((obj, i) => {
        const { name, type, label, required, ...rest } = obj;
        return (
          <TextField
            fullWidth
            key={i}
            sx={{ display: "block" }}
            name={name}
            type={type || "text"}
            required={required}
            onChange={handleChange}
            value={item[name] || ""}
            label={label}
            {...rest}
            variant="outlined"
            className="my-3 "
          />
        );
      })}
      <FormControlLabel
        name="private"
        checked={item.private || false}
        onChange={handleChange}
        control={<Checkbox />}
        label="فقط به اعضا نشان داده شود"
      />
      <div className="my-2">
        <FormControlLabel
          name="enabled"
          checked={item.enabled || false}
          onChange={handleChange}
          control={<Checkbox />}
          label="محصول فعال"
        />
      </div>
    </div>
  );
}
