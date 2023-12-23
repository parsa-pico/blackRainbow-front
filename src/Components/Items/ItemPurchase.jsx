import React from "react";
import Button from "@mui/material/Button";
export default function ItemPurchase({ itemData }) {
  return (
    <div className="item-purchase">
      <Button disabled={!itemData || itemData.stock === 0} variant="outlined">
        افزودن به سبد خرید
      </Button>
    </div>
  );
}
