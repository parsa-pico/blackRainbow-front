import React from "react";
import { Button } from "react-bootstrap";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import { getPrice } from "../../Common/commonFuncs";
export default function ItemPurchase({ itemData }) {
  return (
    <div className="item-purchase">
      <Button
        className="item-purchase-btn"
        disabled={!itemData || itemData.stock === 0}
      >
        افزودن به سبد خرید
        <AddShoppingCartIcon className="pe-2" />
      </Button>
      <div>{getPrice(itemData.price)}تومان</div>
    </div>
  );
}
