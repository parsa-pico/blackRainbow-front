import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import { useEffect, useState } from "react";
import httpSerivce from "../../../Services/httpService";
import { tryHTTP } from "../../../Common/commonFuncs";

export default function Category({
  value,
  setValue,
  label,
  getOptions,
  canSearch: myReadOnly,
  flag,
  insertCategory,
  ...rest
}) {
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = useState([]);
  const [textValue, setTextValue] = useState("");
  const [loading, setLoading] = useState(false);
  const newID = "newId";
  const timeout = 500; //millis

  // const [sendTimeout, setSendTimeout] = useState(timeout);

  const [timeoutId, setTimeoutId] = useState(null);

  useEffect(() => {
    if (myReadOnly) {
      getOptionsWrapper();
    }
  }, [flag]);

  // useEffect(() => {
  //   if (loading && !canSearch) {
  //     if (sendTimeout === 0) {
  //       getOptionsWrapper(textValue);
  //     } else {
  //       setTimeout(
  //         () => {
  //           const t = Math.max(sendTimeout - timeout, 0);
  //           setSendTimeout(t);
  //         },
  //         timeout >= 1 ? 1000 : timeout * 1000
  //       );
  //     }
  //   }
  // }, [loading, sendTimeout]);

  function inputChanged(value) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    if (!myReadOnly) setLoading(true);
    // setSendTimeout(timeout);

    setTextValue(value);

    const newTimeoutId = setTimeout(!myReadOnly && getOptionsWrapper, timeout);
    setTimeoutId(newTimeoutId);
  }
  function getOptionsWrapper() {
    tryHTTP(
      async () => {
        const data = await getOptions(textValue);
        console.log(data);
        setOptions(data);
      },
      () => {
        // if (!myReadOnly) setSendTimeout(timeout);
        setLoading(false);
      }
    );
  }

  // useEffect(() => {
  //   if (!open) {
  //     setOptions([]);
  //   }
  // }, [open]);
  useEffect(() => {
    console.log("here");
    // Cleanup function to clear the timeout when the component unmounts or inputValue changes
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [timeoutId]);
  const filter = createFilterOptions();
  return (
    <Autocomplete
      {...rest}
      // inputValue={readOnly ? "" : undefined}
      sx={{ width: 300 }}
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      clearOnBlur
      filterOptions={(options_, params) => {
        const filtered = filter(options_, params);

        // Suggest the creation of a new value
        if (
          params.inputValue !== "" &&
          !options.find((opt) => opt.title === params.inputValue)
        ) {
          const obj = {
            _id: newID,
            title: `اضافه کردن"${params.inputValue}"`,
            newVal: params.inputValue,
          };
          filtered.push(obj);
        }

        return filtered;
      }}
      value={value}
      onClose={() => {
        setOpen(false);
      }}
      onChange={async (e, newVal) => {
        if (newVal && newVal._id === newID) {
          const result = await insertCategory(newVal.newVal);
          if (!result) {
            setTextValue("");
            setValue({ _id: "", title: "" });
          } else {
            setTextValue(result.title);
            setValue(result);
          }
          return;
        }
        return setValue(newVal);
      }}
      isOptionEqualToValue={(option, value) => {
        return option._id === value._id || value._id === newID || !value._id;
      }}
      getOptionLabel={(option) => option.title}
      options={options}
      loading={loading}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          value={textValue}
          onChange={({ target }) => inputChanged(target.value)}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    ></Autocomplete>
  );
}
