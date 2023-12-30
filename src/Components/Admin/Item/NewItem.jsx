import { Button } from "@mui/material";
import React, { useEffect } from "react";
import { useState } from "react";
import Category from "./Category";
import httpSerivce from "../../../Services/httpService";
import { getPicture, tryHTTP } from "../../../Common/commonFuncs";

import { toast } from "react-toastify";
import TextFields from "./TextFields";
import Tags from "./Tags";
import SelectOptions from "./SelectOptions";
import { fields, subCategoryBase, categoryBase, itemBase } from "./baseFields";
import SelectPictures from "./SelectPictures/SelectPictures";
import { useSearchParams } from "react-router-dom";

export default function NewItem() {
  const textFields = fields;
  const [category, setCategory] = useState(categoryBase);
  const [searchParmas] = useSearchParams();
  const [itemId, setItemId] = useState(null);
  const [subCategory, setSubCategory] = useState(subCategoryBase);
  const [tag, setTag] = useState(categoryBase);
  const [tags, setTags] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [pictures, setPictures] = useState([]);
  const [customersPictures, setCustomersPictures] = useState([]);
  const [item, setItem] = useState(itemBase);
  function submitForm() {
    const obj = { ...item };
    obj.category = category._id;
    obj.subCategory = subCategory._id;
    obj.tags = tags;
    obj.options = selectedOptions.map((opt) => opt._id);
    obj.pictures = pictures.map((pic) => pic.uploadedFileName);
    obj.customersPictures = customersPictures.map(
      (pic) => pic.uploadedFileName
    );

    if (!obj.brand) delete obj.brand;
    obj.price *= 10;
    console.log(obj);
    tryHTTP(async (http) => {
      if (!itemId) {
        await http.post("/items", obj);
        toast("آیتم اضافه شد");
        setTimeout(() => {
          window.location = "/items";
        }, 1000);
      } else {
        console.log(obj);
        await http.put(`/items/${itemId}`, obj);
        toast("آیتم ادیت شد");
      }
      // setTimeout(() => {
      //   window.location = "/items";
      // }, 1000);
    });
  }
  const handleChange = ({ target }) => {
    let value = target.value;
    if (target.type === "checkbox") value = target.checked;
    if (target.type === "number") {
      value = parseInt(value);
    }
    const itemCopy = { ...item };
    const name = target.name;
    itemCopy[name] = value;
    setItem(itemCopy);
  };
  async function insertCategory(title, parentId, isTag = false) {
    let data = {};
    await tryHTTP(async () => {
      const obj = { title };
      const api = isTag ? "/tags" : "/categories";
      if (parentId) obj.parentId = parentId;
      data = (await httpSerivce.post(api, obj)).data.obj;
      toast("دسته بندی اضافه شد");
    });
    return data;
  }
  async function getSubCategory() {
    if (!category || !category._id) return [];
    const { data } = await httpSerivce.post("/categories/get-sub", {
      parentId: category._id,
    });
    return data;
  }
  async function getCategory(textValue) {
    const { data } = await httpSerivce.post("/categories/get-by-title", {
      title: textValue,
    });
    setSubCategory(subCategoryBase);
    return data;
  }
  async function getTag(textValue) {
    const { data } = await httpSerivce.post("/tags/get-by-title", {
      title: textValue,
    });
    return data;
  }
  function appendTag(title) {
    if (title) setTags([...tags, title]);
  }
  useEffect(() => {
    if (tag && tag.title) appendTag(tag.title);
  }, [tag]);

  useEffect(() => {
    async function search() {
      const itemId = searchParmas.get("itemId");
      if (!itemId) return;
      setItemId(itemId);

      tryHTTP(async (http) => {
        let { data } = await http.get(`/items/${itemId}`);
        data = data[0];

        data.price /= 10;
        setCategory(data.categoryData);
        setSubCategory(data.subCategoryData);
        setTags(data.tags);
        setSelectedOptions(data.optionsData);
        const pics = data.pictures.map((pic) => {
          return { blob: getPicture(pic), uploadedFileName: pic };
        });
        const customersPics = data.customersPictures.map((pic) => {
          return { blob: getPicture(pic), uploadedFileName: pic };
        });
        setCustomersPictures(customersPics);
        setPictures(pics);
        //
        delete data.categoryData;
        delete data.subCategoryData;
        delete data.tags;
        delete data.optionsData;
        delete data.pictures;
        delete data._id;
        delete data.views;
        //
        console.log(data);
        setItem(data);
        console.log(data);
      });
    }
    search();
  }, []);
  return (
    <div className="page-wrapper" style={{ alignItems: "stretch" }}>
      <div className="page">
        {itemId ? <h2>ادیت کالا</h2> : <h2>کالای جدید</h2>}
        <form
          className="w-100"
          onSubmit={(e) => {
            e.preventDefault();
            submitForm();
          }}
        >
          <TextFields
            textFields={textFields}
            item={item}
            handleChange={handleChange}
          />

          <Category
            insertCategory={insertCategory}
            className="my-4"
            value={category}
            setValue={setCategory}
            label="دسته بندی"
            getOptions={getCategory}
          />
          <Category
            insertCategory={async (title) => {
              const data = await insertCategory(title, category._id);
              return data;
            }}
            canSearch={true}
            readOnly={!category || !category._id}
            flag={category}
            className="my-4"
            value={subCategory}
            setValue={setSubCategory}
            label="زیر دسته بندی"
            getOptions={getSubCategory}
          />
          <Category
            insertCategory={async (val) => {
              const data = await insertCategory(val, undefined, true);
              appendTag(data.title);
            }}
            className="my-4"
            value={tag}
            setValue={setTag}
            label="برچسب ها"
            getOptions={getTag}
          />
          <Tags tags={tags} setTags={setTags} />
          <hr />
          <SelectOptions
            selectedOptions={selectedOptions}
            setSelectedOptions={setSelectedOptions}
          />
          <hr />
          <SelectPictures
            label="آپلود عکس محصول "
            pictures={pictures}
            setPictures={setPictures}
          />
          <hr />
          <SelectPictures
            label="آپلود عکس مشتریان"
            pictures={customersPictures}
            setPictures={setCustomersPictures}
          />

          <div>
            <Button variant="outlined" className="w-100 mt-4" type="submit">
              {!itemId ? "ثبت" : "ادیت"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
