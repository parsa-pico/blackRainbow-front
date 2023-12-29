import React from "react";

import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import AddIcon from "@mui/icons-material/Add";
import MinusIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";
import { getPrice, tryHTTP } from "../../Common/commonFuncs";
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";
import { Button } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useCartCount } from "../../context/cartCountContext";
import { PurchaseIncrease } from "./PurchaseIncrease";
export default function ItemPurchase({
  itemData,
  cartItem,
  handleCart,
  loading,
}) {
  const outOfStock = itemData.stock === 0;
  const [cartCount, setCartCount] = useCartCount();
  return (
    <div className="item-purchase">
      {!cartItem && (
        <LoadingButton
          loading={loading}
          variant="outlined"
          onClick={() => {
            handleCart();
            setCartCount((c) => c + 1);
          }}
          className="item-purchase-btn"
          disabled={outOfStock}
        >
          {outOfStock ? (
            <span>ناموجود</span>
          ) : (
            <span>
              افزودن به سبد خرید
              <AddShoppingCartIcon className="pe-2" />
            </span>
          )}
        </LoadingButton>
      )}
      {cartItem && itemData.stock !== 0 && (
        <PurchaseIncrease
          loading={loading}
          handleCart={handleCart}
          quantity={cartItem.quantity}
        />
      )}
      <div>{getPrice(itemData.price)}تومان</div>
    </div>
  );
}
