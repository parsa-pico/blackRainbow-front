import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import http from "../../Services/httpService";
import { getPicture, tryHTTP } from "../../Common/commonFuncs";

import ItemImage from "./ItemImage";
import ItemPath from "./ItemPath";
import ItemOptions from "./ItemOptions";
import ItemPurchase from "./ItemPurchase";
import { Button, Chip, Typography } from "@mui/material";
import ItemTags from "./ItemTags";
import { getUser } from "../../Services/authService";
import { useGlobalLoading } from "../../context/globalLoadingContext";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { toast } from "react-toastify";
export default function Item() {
  const nav = useNavigate();
  const params = useParams();
  const user = getUser();
  const [itemData, setItemData] = useState({});
  const [cartItem, setCartItem] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [loading, setLoading] = useState(false);
  const [globalLoading, setGlobalLoading] = useGlobalLoading();
  function getItem() {
    tryHTTP(
      async () => {
        setGlobalLoading(true);
        setLoading(true);
        const { itemId } = params;
        let { data } = await http.get(`/items/${itemId}`);

        data = data[0];
        console.log(data);
        if (data.pictures)
          data.pictures = data.pictures.map((p) => getPicture(p));
        setItemData(data);

        if (data.optionsData) {
          const obj = {};
          for (let optionObj of data.optionsData) {
            obj[optionObj.title] = optionObj.choices[0];
          }
          setSelectedOptions(obj);
          const { data: cartItemData } = await http.get(`/carts/${itemId}`);
          console.log(cartItemData);
          setCartItem(cartItemData);
        }
      },
      () => {
        setLoading(false);
        setGlobalLoading(false);
      }
    );
  }
  function getLiked() {
    if (user)
      tryHTTP(async () => {
        const { itemId } = params;
        let { data } = await http.get(`/likes/${itemId}`);
        console.log(data);
        setItemData((obj) => ({ ...obj, liked: data }));
      });
  }

  useEffect(() => {
    getItem();
    getLiked();
  }, []);

  function handleCart(quantity_) {
    tryHTTP(
      async (http) => {
        setLoading(true);

        const quantity = cartItem ? quantity_ : 1;
        const { data } = await http.post(`/carts/new/${itemData._id}`, {
          options: selectedOptions,
          quantity,
        });
        setCartItem(data.obj);
        console.log(data);
      },
      () => {
        setLoading(false);
      }
    );
  }

  function likeItem() {
    if (user)
      tryHTTP(
        async (http) => {
          setGlobalLoading(true);

          await http.post(`/likes/${itemData._id}`);
          setItemData((obj) => ({ ...obj, liked: true }));
        },
        () => {
          setGlobalLoading(false);
        }
      );
    else {
      toast.dark("ابتدا وارد حساب خود شوید");
    }
  }
  function dislikeItem() {
    if (user)
      tryHTTP(
        async (http) => {
          setGlobalLoading(true);

          await http.delete(`/likes/${itemData._id}`);
          setItemData((obj) => ({ ...obj, liked: false }));
        },
        () => {
          setGlobalLoading(false);
        }
      );
    else {
      toast.dark("ابتدا وارد حساب خود شوید");
    }
  }
  return (
    <div className="item-wrapper container mt-2">
      <ItemPath
        links={
          Object.keys(itemData).length > 0 && [
            itemData.categoryData,
            itemData.subCategoryData,
          ]
        }
      />
      <div className="item-upper my-5">
        <ItemImage picsData={itemData.pictures} />

        <div style={{ justifyContent: "space-between" }} className="hstack">
          <div>
            <Typography className="my-2" gutterBottom variant="h3">
              {itemData.productName}
            </Typography>
            {itemData.brand && (
              <Typography
                className="my-2"
                gutterBottom
                color="whitesmoke"
                variant="h6"
              >
                برند {itemData.brand}
              </Typography>
            )}
          </div>

          <div className="pointer">
            {itemData.liked ? (
              <FavoriteIcon onClick={dislikeItem} />
            ) : (
              <FavoriteBorderIcon onClick={likeItem} />
            )}
          </div>
        </div>
        <hr />

        <h6>ویژگی های محصول:</h6>
        <p className="item-desc">{itemData.description}</p>
        <ItemOptions
          selectedOptions={selectedOptions}
          setSelectedOptions={setSelectedOptions}
          itemOptions={itemData && itemData.optionsData}
        />
        <ItemTags tags={itemData.tags} />

        {user && user.isAdmin && (
          <div className="my-3">
            <table>
              <tbody>
                <tr>
                  <td>{itemData.views}</td>
                  <td>بازدید</td>
                </tr>
                <tr>
                  <td>{itemData.sold}</td>
                  <td>فروش</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
        {user && user.isAdmin && (
          <Button
            onClick={() => {
              nav(`/admin/new-item?itemId=${itemData._id}`);
            }}
            className="mt-2"
            variant="outlined"
            color="warning"
          >
            ادیت کالا
          </Button>
        )}
      </div>
      <ItemPurchase
        loading={loading}
        cartItem={cartItem}
        handleCart={handleCart}
        itemData={itemData}
      />
    </div>
  );
}
