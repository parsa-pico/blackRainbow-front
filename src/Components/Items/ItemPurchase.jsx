import React from "react";
import { Button } from "react-bootstrap";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
export default function ItemPurchase({ itemData }) {
  function getPrice() {
    return (itemData.price / 10).toLocaleString();
  }
  return (
    <div className="item-purchase">
      <Button
        className="item-purchase-btn"
        disabled={!itemData || itemData.stock === 0}
      >
        افزودن به سبد خرید
        <AddShoppingCartIcon className="pe-2" />
      </Button>
      <div>{getPrice()}تومان</div>
    </div>
  );
}
