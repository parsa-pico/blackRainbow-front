import React from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";

export default function ItemOptions({
  itemOptions,
  setSelectedOptions,
  selectedOptions,
}) {
  function handleChange(e) {
    const { name, value } = e.target;

    const copy = { ...selectedOptions };
    copy[name] = value;
    console.log(copy);
    setSelectedOptions(copy);
  }
  return (
    <div>
      <hr />
      <p>گزینه های محصول:</p>
      {itemOptions &&
        itemOptions.length > 0 &&
        itemOptions.map((optionObj, i) => {
          return (
            <Box key={i} sx={{ minWidth: 120 }}>
              <FormControl className="mb-5" fullWidth>
                <InputLabel id={"demo-simple-select-label" + i}>
                  {optionObj.title}
                </InputLabel>
                <Select
                  dir="rtl"
                  name={optionObj.title}
                  value={selectedOptions[optionObj.title]}
                  label={optionObj.title}
                  onChange={handleChange}
                >
                  {optionObj.choices.map((c, j) => (
                    <MenuItem key={j} value={c}>
                      {c}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          );
        })}
    </div>
  );
}
