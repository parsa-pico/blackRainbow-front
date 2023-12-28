export const fields = [
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
];
export const categoryBase = { title: "", _id: "" };
export const subCategoryBase = {
  title: "",
  _id: "",
  parentId: "",
};
export const itemBase = {
  productName: "",
  stock: "",
  price: "",
  brand: "",
  private: false,
  // category: categoryBase,
  // subCategory: subCategoryBase,
  // tags: [],
  // pictures: [],
  // customersPictures: [],
  // description: "",
  // options: [],
};
