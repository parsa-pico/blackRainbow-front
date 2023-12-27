import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import React, { useEffect, useState } from "react";

export default function SubCategory({ subState, getOptions, flag }) {
  const [sub, setSub] = subState;
  const [options, setOptions] = useState([]);
  useEffect(() => {
    async function run() {
      if (flag && flag._id) {
        const data = await getOptions();
        setOptions(data);
      }
    }
    run();
  }, [flag]);
  return (
    <div>
      <FormControl fullWidth>
        <InputLabel id="sub-cat-label">زیر دسته بندی</InputLabel>
        <Select
          labelId="sub-cat-label"
          id="sub-cat"
          value={sub._id}
          onChange={(e) => {
            setSub({ title: e.target.name, _id: e.target.value });
          }}
          label="زیر دسته بندی"
        >
          {options &&
            options.length > 0 &&
            options.map((obj, i) => {
              return (
                <MenuItem key={i} name={obj.title} value={obj._id}>
                  {obj.title}
                </MenuItem>
              );
            })}
        </Select>
      </FormControl>
    </div>
  );
}
