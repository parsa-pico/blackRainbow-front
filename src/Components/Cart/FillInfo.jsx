import React from "react";
import {
  Checkbox,
  ClickAwayListener,
  FormControlLabel,
  TextField,
} from "@mui/material";
import { fields } from "./baseFields";
import PersianDatePicker from "@skhazaei/persian-date-picker";
import { useState } from "react";
import HelpIcon from "@mui/icons-material/Help";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
export default function FillInfo({
  orderInfo,
  handleChange,
  setScheduleDate,
  scheduleDate,
  postPrice,
}) {
  const [open, setOpen] = React.useState(false);
  function getMindate() {
    const currentDate = new Date();

    // Add one day
    currentDate.setDate(currentDate.getDate() + 1);
    return currentDate;
  }
  const handleTooltipClose = () => {
    setOpen(false);
  };

  const handleTooltipOpen = () => {
    setOpen(true);
  };

  return (
    <div className="vstack bg-dark cart-fill-info">
      <h4 className="my-3 mb-1">اطلاعات تحویل گیرنده</h4>
      <small className="my-3 mt-1">
        لطفا اطلاعات زیر را به صورت فارسی پر کنید
      </small>
      {postPrice !== 0 && (
        <div className="d-flex ">
          <FormControlLabel
            onChange={(e, checked) => {
              if (checked) setScheduleDate(getMindate());
              else setScheduleDate(null);
            }}
            control={<Checkbox />}
            label="بعدا ارسال شود"
          />
          {!scheduleDate && (
            <ClickAwayListener onClickAway={handleTooltipClose}>
              <Tooltip
                onClose={handleTooltipClose}
                open={open}
                disableFocusListener
                disableHoverListener
                disableTouchListener
                title="میتوانید تا قبل از تاریخ ارسال ، سفارش جدید بدون هزینه پست ثبت کنید"
              >
                <IconButton onClick={handleTooltipOpen}>
                  <HelpIcon />
                </IconButton>
              </Tooltip>
            </ClickAwayListener>
          )}
          {scheduleDate && (
            <div style={{ zIndex: "9999" }}>
              <PersianDatePicker
                selectedDay={scheduleDate}
                minDate={getMindate()}
                onSelectDay={setScheduleDate}
              />
            </div>
          )}
        </div>
      )}
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
