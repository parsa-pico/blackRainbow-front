import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import React, { useEffect } from "react";
import { useState } from "react";
import Category from "./Category";
import httpSerivce from "../../../Services/httpService";
import { tryHTTP } from "../../../Common/commonFuncs";
import SubCategory from "./SubCategory";
import { toast } from "react-toastify";
import TextFields from "./TextFields";
import Tags from "./Tags";
export default function NewItem() {
  const [textFields, setTextFields] = useState([
    {
      name: "productName",
      label: "نام محصول",
      required: true,
    },

    {
      name: "price",
      label: "قیمت به تومان",
      type: "number",
      required: true,
    },
    {
      name: "stock",
      label: "موجودی انبار",
      type: "number",
      required: true,
    },
    { name: "brand", label: " برند" },
    {
      name: "description",
      label: "توضیحات محصول",
      multiline: true,
      required: true,
    },
  ]);
  const categoryBase = { title: "", _id: "" };
  const subCategoryBase = {
    title: "",
    _id: "",
    parentId: "",
  };
  const [category, setCategory] = useState(categoryBase);
  const [subCategory, setSubCategory] = useState(subCategoryBase);
  const [tag, setTag] = useState(categoryBase);

  const [tags, setTags] = useState([]);

  const [item, setItem] = useState({
    productName: "",
    stock: "",
    price: "",
    brand: "",
    private: false,
    category: categoryBase,
    subCategory: subCategoryBase,
  });

  const handleChange = ({ target }) => {
    const itemCopy = { ...item };
    const name = target.name;
    itemCopy[name] = target.value;
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
  return (
    <div className="page-wrapper">
      <div className="page">
        <h2>کالای جدید</h2>
        <form
          className="w-100"
          onSubmit={(e) => {
            e.preventDefault();
            console.log("hi");
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
          <div>
            <Button variant="outlined" className="w-100 mt-4" type="submit">
              ثبت
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
