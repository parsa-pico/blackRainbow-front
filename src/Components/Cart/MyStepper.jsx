import * as React from "react";
import { useTheme } from "@mui/material/styles";
import MobileStepper from "@mui/material/MobileStepper";
import Button from "@mui/material/Button";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import { useEffect } from "react";

export default function MyStepper({
  activeStep,
  handleNext,
  handleBack,
  totalSteps,
  orderInfo,
}) {
  useEffect(() => {
    console.log(orderInfo.paymentMethod);
  }, [orderInfo]);
  const theme = useTheme();
  const stepNames = ["ثبت اطلاعات", "تکمیل خرید", "پرداخت"];
  return (
    <MobileStepper
      variant="progress"
      steps={totalSteps}
      activeStep={activeStep}
      sx={{ position: "fixed", bottom: 0, zIndex: 99999 }}
      nextButton={
        <Button
          size="small"
          onClick={handleNext}
          disabled={activeStep === totalSteps - 1}
        >
          {activeStep === totalSteps - 2 && orderInfo.paymentMethod === "2"
            ? "ثبت خرید"
            : stepNames[activeStep]}
          {theme.direction === "rtl" ? (
            <KeyboardArrowLeft />
          ) : (
            <KeyboardArrowRight />
          )}
        </Button>
      }
      backButton={
        <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
          {theme.direction === "rtl" ? (
            <KeyboardArrowRight />
          ) : (
            <KeyboardArrowLeft />
          )}
          قبلی
        </Button>
      }
    />
  );
}
