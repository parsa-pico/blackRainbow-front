import { useCartCount } from "../../context/cartCountContext";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import AddIcon from "@mui/icons-material/Add";
import MinusIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";
import { getPrice, tryHTTP } from "../../Common/commonFuncs";
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";
import { Button } from "@mui/material";
import { LoadingButton } from "@mui/lab";

export function PurchaseIncrease({
  quantity,
  handleCart,
  loading,
  className,
  fontSize,
}) {
  const [cartCount, setCartCount] = useCartCount();
  return (
    <div className={"purchase-btns " + className}>
      <Button
        disabled={loading}
        onClick={() => {
          handleCart(quantity + 1);
        }}
        className="p-0"
      >
        <AddIcon fontSize={fontSize} />
      </Button>

      <div className="item-purchase-middle">
        {loading ? (
          <MoreHorizOutlinedIcon fontSize={fontSize} />
        ) : (
          <small>{quantity}</small>
        )}
      </div>

      <Button
        disabled={loading}
        onClick={() => {
          const newQuantity = quantity - 1;
          handleCart(newQuantity);
          if (newQuantity === 0) setCartCount((c) => c - 1);
        }}
        className="p-0"
      >
        {quantity === 1 ? (
          <DeleteIcon fontSize={fontSize} />
        ) : (
          <MinusIcon fontSize={fontSize} />
        )}
      </Button>
    </div>
  );
}
