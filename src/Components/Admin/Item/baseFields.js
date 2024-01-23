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
    name: "offPrice",
    label: "قیمت پس از تخفیف به تومان",
    type: "number",
  },
  {
    name: "stock",
    label: "موجودی انبار",
    type: "number",
    required: true,
  },
  // { name: "brand", label: " برند" },
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
  description: "",
  // brand: "",
  stock: 100,
  price: "",
  brand: "",
  private: false,
  enabled: true,
  // category: categoryBase,
  // subCategory: subCategoryBase,
  // tags: [],
  // pictures: [],
  // customersPictures: [],
  // description: "",
  // options: [],
};
