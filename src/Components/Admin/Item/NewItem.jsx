import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
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
import { useGlobalLoading } from "./../../../context/globalLoadingContext";
import { useCategories } from "../../../context/categoryContext";

export default function NewItem() {
  const textFields = fields;
  const [categories, setCategories] = useCategories();
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [searchParmas] = useSearchParams();
  const [itemId, setItemId] = useState(null);
  const [tag, setTag] = useState(categoryBase);
  const [tags, setTags] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [pictures, setPictures] = useState([]);
  const [customersPictures, setCustomersPictures] = useState([]);
  const [item, setItem] = useState(itemBase);
  const setGlobalLoading = useGlobalLoading()[1];
  function submitForm() {
    const obj = { ...item };
    obj.category = category;
    obj.subCategory = subCategory;
    obj.tags = tags;
    obj.options = selectedOptions.map((opt) => opt._id);
    obj.pictures = pictures.map((pic) => pic.uploadedFileName);
    obj.customersPictures = customersPictures.map(
      (pic) => pic.uploadedFileName
    );
    delete obj.sold;
    delete obj.views;
    if (!obj.brand) obj.brand = "";
    obj.price *= 10;
    console.log(obj);
    tryHTTP(
      async (http) => {
        setGlobalLoading(true);
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
      },
      () => {
        setGlobalLoading(false);
      }
    );
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
  // async function getSubCategory() {
  //   if (!category || !category._id) return [];
  //   const { data } = await httpSerivce.post("/categories/get-sub", {
  //     parentId: category._id,
  //   });
  //   return data;
  // }
  // async function getCategory(textValue) {
  //   const { data } = await httpSerivce.post("/categories/get-by-title", {
  //     title: textValue,
  //   });
  //   setSubCategory(subCategoryBase);
  //   return data;
  // }
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
        setCategory(data.categoryData._id);
        setSubCategory(data.subCategoryData._id);
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
  function getSubCategoryItems() {
    const index = categories.findIndex((o) => o._id === category);
    if (index !== -1)
      return categories[index].subCategories.map((obj) => {
        return (
          <MenuItem key={obj._id} value={obj._id}>
            {obj.title}
          </MenuItem>
        );
      });
  }
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
          <FormControl className="w-50 ms-2">
            <InputLabel id="category"> دسته بندی</InputLabel>
            <Select
              labelId="category"
              value={category}
              label="دسته بندی"
              onChange={(e) => {
                setSubCategory("");
                setCategory(e.target.value);
              }}
            >
              {categories.map((obj, index) => (
                <MenuItem key={obj._id} value={obj._id}>
                  {obj.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl className="my-2 w-50">
            <InputLabel id="sub-category"> زیر دسته بندی</InputLabel>
            <Select
              labelId="sub-category"
              value={subCategory}
              label="زیر دسته بندی"
              onChange={(e) => setSubCategory(e.target.value)}
            >
              {getSubCategoryItems()}
            </Select>
          </FormControl>
          {/* <Category
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
          /> */}
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
            withLogo={true}
          />
          <hr />
          <SelectPictures
            label="آپلود عکس مشتریان"
            pictures={customersPictures}
            setPictures={setCustomersPictures}
            withLogo={true}
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
