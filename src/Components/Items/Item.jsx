import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import http from "../../Services/httpService";
import { tryHTTP } from "../../Common/commonFuncs";

import ItemImage from "./ItemImage";
import ItemPath from "./ItemPath";
import ItemOptions from "./ItemOptions";
import ItemPurchase from "./ItemPurchase";
import { Chip } from "@mui/material";
import ItemTags from "./ItemTags";
export default function Item() {
  const params = useParams();
  const [itemData, setItemData] = useState({});
  const [selectedOptions, setSelectedOptions] = useState({});
  useEffect(() => {
    tryHTTP(async () => {
      const { itemId } = params;
      let { data } = await http.get(`/items/${itemId}`);
      data = data[0];
      console.log(data);
      if (data.pictures)
        data.pictures = data.pictures.map(
          (p) => `${process.env.REACT_APP_API_URL}/pictures/${p}`
        );
      setItemData(data);

      if (data.optionsData) {
        const obj = {};
        for (let optionObj of data.optionsData) {
          obj[optionObj.title] = optionObj.choices[0];
        }
        setSelectedOptions(obj);
      }
    });
  }, []);

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
        <h3 className="mt-2">{itemData.productName}</h3>
        <hr />
        <h6>ویژگی های کالا:</h6>
        <p className="item-desc">{itemData.description}</p>
        <ItemOptions
          selectedOptions={selectedOptions}
          setSelectedOptions={setSelectedOptions}
          itemOptions={itemData && itemData.optionsData}
        />
        <ItemTags tags={itemData.tags} />
      </div>
      <ItemPurchase itemData={itemData} />
    </div>
  );
}
