import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import http from "../../Services/httpService";
import { getPicture, tryHTTP } from "../../Common/commonFuncs";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ItemImage from "./ItemImage";
import ItemPath from "./ItemPath";
import ItemOptions from "./ItemOptions";
import ItemPurchase from "./ItemPurchase";
import { Button, Chip, Typography } from "@mui/material";
import ItemTags from "./ItemTags";
import { getUser } from "../../Services/authService";
import { useGlobalLoading } from "../../context/globalLoadingContext";
import { toast } from "react-toastify";
import PictureToggle from "./PictureToggle";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
export default function Item() {
  const loc = useLocation();
  const nav = useNavigate();
  const params = useParams();
  const user = getUser();
  const [itemData, setItemData] = useState({});
  const [cartItem, setCartItem] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [loading, setLoading] = useState(false);
  const [pictures, setPictures] = useState([]);
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
        if (data.pictures) {
          data.pictures = data.pictures.map((p) => getPicture(p));
          setPictures(data.pictures);
        }
        if (data.customersPictures)
          data.customersPictures = data.customersPictures.map((p) =>
            getPicture(p)
          );
        //
        const ogTitleMeta = document.querySelector('meta[property="og:title"]');
        const ogDescriptionMeta = document.querySelector(
          'meta[property="og:description"]'
        );

        // document.title = data.productName;
        // if (ogTitleMeta) {
        //   ogTitleMeta.setAttribute("content", data.productName);
        // }
        const pageDescription = `بلک رینبو | خرید ${data.productName}`;
        if (ogDescriptionMeta) {
          ogDescriptionMeta.setAttribute("content", pageDescription);
        }
        document
          .querySelector('meta[name="description"]')
          .setAttribute("content", pageDescription);
        //
        setItemData(data);

        if (data.optionsData) {
          const obj = {};
          for (let optionObj of data.optionsData) {
            obj[optionObj.title] = optionObj.choices[0];
          }
          setSelectedOptions(obj);
          const { data: cartItemData } = await http.get(`/carts/${itemId}`);

          setCartItem(cartItemData);
        }
      },
      () => {
        setLoading(false);
        setGlobalLoading(false);
      }
    );
  }
  useEffect(() => {
    getItem();
  }, []);
  // function getLiked() {
  //   if (user)
  //     tryHTTP(async () => {
  //       const { itemId } = params;
  //       let { data } = await http.get(`/likes/${itemId}`);

  //       data = data.toString() === "true" ? true : false;
  //       console.log("result", data);
  //       setItemData((obj) => ({ ...obj, liked: data }));
  //     });
  // }

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
      toast.dark("لطفا ابتدا وارد حساب خود شوید");
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
  useEffect(() => {
    console.log(itemData);
  }, [itemData]);
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
        <div className="item-upper-image">
          {itemData &&
            itemData.customersPictures &&
            itemData.customersPictures.length > 0 && (
              <PictureToggle itemData={itemData} setPictures={setPictures} />
            )}
          <ItemImage picsData={pictures} />
        </div>
        <div className="w-100">
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
                <BookmarkIcon fontSize="large" onClick={dislikeItem} />
              ) : (
                <BookmarkBorderIcon fontSize="large" onClick={likeItem} />
              )}
            </div>
          </div>
          <hr />

          <Typography gutterBottom color="whitesmoke" variant="h5">
            ویژگی های محصول:
          </Typography>
          <p className="item-desc">{itemData.description}</p>
          <ItemOptions
            selectedOptions={selectedOptions}
            setSelectedOptions={setSelectedOptions}
            itemOptions={itemData && itemData.optionsData}
          />
          <ItemTags tags={itemData.tags} />
          <Button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              toast.success("لینک محصول کپی شد", { autoClose: 1000 });
            }}
            className="mt-3 w-50"
            variant="outlined"
            color="secondary"
          >
            <ContentCopyIcon />
            اشتراک گذاری
          </Button>
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
                  <tr>
                    <td>محصول</td>
                    <td>{itemData.enabled ? "فعال" : "غیر فعال"}</td>
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
