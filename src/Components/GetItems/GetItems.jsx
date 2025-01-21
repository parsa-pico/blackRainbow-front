import React, { lazy } from "react";
import { useState } from "react";
import { useEffect } from "react";
import { getPicture, getPrice, tryHTTP } from "../../Common/commonFuncs";
import { useNavigate, useSearchParams } from "react-router-dom";
import Pagination from "@mui/material/Pagination";
import {
  Card,
  Checkbox,
  Modal,
  Box,
  TextField,
  FormControlLabel,
  div,
  CardContent,
  CardMedia,
  Chip,
  Grid,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Button,
} from "@mui/material";
import { useGlobalLoading } from "../../context/globalLoadingContext";
import { useCategories } from "../../context/categoryContext";
import LazyLoad from "react-lazy-load";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import { getUser } from "../../Services/authService";
import { toast } from "react-toastify";

export default function GetItems({ setSearchValue }) {
  const user = getUser();
  const nav = useNavigate();
  const [items, setItems] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useCategories();
  console.log(items);

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [selectedSortIndex, setSelectedSortIndex] = useState("");
  const [selectedEnabled, setSelectedEnabled] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [count, setCount] = useState(0);
  const [globalLoading, setGlobalLoading] = useGlobalLoading();
  const searchValue = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const subCategory = searchParams.get("subCategory") || "";
  const enabled = searchParams.get("enabled") || "true";
  const sortIndex =
    parseInt(searchParams.get("sortIndex")) || (searchValue ? 1 : 2);
  const currentPage = parseInt(searchParams.get("page")) || 1;

  const [operation, setOperation] = useState("");
  const [amount, setAmount] = useState("");
  const [priceChangeModal, setPriceChangeModal] = useState(false);
  const [applyDiscountModal, setApplyDiscountModal] = useState(false);
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    setItems([]);
    console.log("im here");

    setSelectedEnabled(enabled === "true");
    search();
    setSearchValue(searchValue);
  }, [searchParams]);
  const handleConfirmOperation = async () => {
    await tryHTTP(
      async (http) => {
        const response = await http.post("/items/update-price-by-keyword", {
          search: searchValue,
          category: selectedCategory,
          subCategory: selectedSubCategory,
          operation,
          amount: parseFloat(amount),
        });
        toast.success(response.data.message);
        setPriceChangeModal(false);
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      },

      () => {
        setGlobalLoading(false);
      }
    );
  };
  const handleSetDiscount = async () => {
    if (!discount || discount <= 0 || discount >= 100) {
      alert("تخفیف باید بین صفر و صد باشد");
      return;
    }
    await tryHTTP(
      async (http) => {
        const response = await http.post("/items/set-discount", {
          search: searchValue,
          category: selectedCategory,
          subCategory: selectedSubCategory,
          discount: discount / 100,
        });
        toast.success(response.data.message);
        setApplyDiscountModal(false);
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      },

      () => {
        setGlobalLoading(false);
      }
    );
  };

  const handleRemoveDiscount = async () => {
    await tryHTTP(
      async (http) => {
        const response = await http.post("/items/remove-discount", {
          search: searchValue,
          category: selectedCategory,
          subCategory: selectedSubCategory,
        });
        toast.success(response.data.message);
        setApplyDiscountModal(false);
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      },

      () => {
        setGlobalLoading(false);
      }
    );
  };
  const handleRoundPrices = async () => {
    await tryHTTP(
      async (http) => {
        const response = await http.post("/items/round-prices", {});
        toast.success(response.data.message);

        setTimeout(() => {
          window.location.reload();
        }, 2000);
      },

      () => {
        setGlobalLoading(false);
      }
    );
  };
  function search() {
    tryHTTP(
      async (http) => {
        setGlobalLoading(true);
        const { data } = await http.post("/items/get-by-keyword", {
          search: searchValue,
          category,
          enabled,
          subCategory,
          sortIndex,
          page: currentPage,
        });

        setCount(data.count);
        setTotalPages(data.totalPages);

        setItems(data.result);
        setSelectedCategory(category);
        setSelectedSubCategory(subCategory);
        setSelectedSortIndex(sortIndex);
      },
      () => {
        setGlobalLoading(false);
      }
    );
  }
  function getCategoryTitle(categoryId) {
    const category = categories.find((o) => o._id === categoryId);
    return category ? category.title : "دسته‌بندی نامشخص";
  }

  function getSubCategoryTitle(categoryId, subCategoryId) {
    const category = categories.find((o) => o._id === categoryId);
    if (category) {
      const subCategory = category.subCategories.find(
        (sub) => sub._id === subCategoryId
      );
      return subCategory ? subCategory.title : "زیر دسته‌بندی نامشخص";
    }
    return "زیر دسته بندی نامشخص";
  }

  function getSubCategoryItems() {
    const index = categories.findIndex((o) => o._id === selectedCategory);
    if (index !== -1 && categories[index].subCategories)
      return categories[index].subCategories.map((obj) => {
        return (
          <MenuItem key={obj._id} value={obj._id}>
            {obj.title}
          </MenuItem>
        );
      });
  }
  function handleFilter(pageNumber) {
    // window.location = `/items?search=${searchValue}&category=${selectedCategory}&subCategory=${selectedSubCategory}&sortIndex=${selectedSortIndex}&page=${
    //   pageNumber || 1
    // }`;

    const query = `search=${searchValue}&category=${selectedCategory}&subCategory=${selectedSubCategory}&enabled=${selectedEnabled}&sortIndex=${selectedSortIndex}&page=${
      pageNumber || 1
    }`;

    setSearchParams(query);
  }
  function likeItem(itemData, i) {
    if (user)
      tryHTTP(
        async (http) => {
          setGlobalLoading(true);

          await http.post(`/likes/${itemData._id}`);
          const copy = [...items];
          copy[i] = { ...items[i], liked: true };

          setItems(copy);
        },
        () => {
          setGlobalLoading(false);
        }
      );
    else {
      toast.dark("لطفا ابتدا وارد حساب خود شوید");
    }
  }
  function dislikeItem(itemData, i) {
    if (user)
      tryHTTP(
        async (http) => {
          setGlobalLoading(true);

          await http.delete(`/likes/${itemData._id}`);
          const copy = [...items];
          copy[i] = { ...items[i], liked: false };

          setItems(copy);
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
    <div className="items-page-wrapper">
      <Typography
        fontFamily={"yekan"}
        className="mb-5"
        gutterBottom
        variant="h6"
      >
        جستجوی محصولات
      </Typography>
      {searchValue && (
        <h3>
          {count} نتیجه برای "{searchValue}"
        </h3>
      )}
      {!searchValue && <h3>{count}محصول در این دسته</h3>}
      <Grid
        columns={{ xs: 2, md: 2, lg: 5 }}
        spacing={{ xs: 0, lg: 1 }}
        container
        className="items-page"
      >
        <Grid
          xs={2}
          md={1}
          lg={1}
          item
          className="items-page-filters-wrapper mb-4 bg-dark"
        >
          <h6 className="my-2 mb-4"> فیلتر ها </h6>
          <div className="vstack w-100">
            {user && user.isAdmin && (
              <FormControlLabel
                onChange={(e, checked) => setSelectedEnabled(checked)}
                control={<Checkbox checked={selectedEnabled} />}
                label="کالا های فعال"
              />
            )}

            <FormControl fullWidth>
              <InputLabel id="category"> دسته بندی</InputLabel>
              <Select
                labelId="category"
                value={selectedCategory}
                label="دسته بندی"
                onChange={(e) => {
                  setSelectedSubCategory("");
                  setSelectedCategory(e.target.value);
                }}
              >
                {categories.map((obj, index) => (
                  <MenuItem key={obj._id} value={obj._id}>
                    {obj.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl className="my-2" fullWidth>
              <InputLabel id="sub-category"> زیر دسته بندی</InputLabel>
              <Select
                labelId="sub-category"
                value={selectedSubCategory}
                label="زیر دسته بندی"
                onChange={(e) => setSelectedSubCategory(e.target.value)}
              >
                {getSubCategoryItems()}
              </Select>
            </FormControl>
            <FormControl className="my-2" fullWidth>
              <InputLabel id="sub-category">مرتب سازی بر اساس</InputLabel>
              <Select
                labelId="sub-category"
                value={selectedSortIndex}
                label="مرتب سازی بر اساس"
                onChange={(e) => setSelectedSortIndex(parseInt(e.target.value))}
              >
                {searchValue && <MenuItem value={1}>مرتبط ترین</MenuItem>}
                <MenuItem value={2}>پربازدید ترین</MenuItem>
                <MenuItem value={5}>پرفروش ترین</MenuItem>
                <MenuItem value={3}> جدید ترین</MenuItem>
                <MenuItem value={6}>ارزان ترین</MenuItem>
                <MenuItem value={7}>گران ترین</MenuItem>
                <MenuItem value={8}>تخفیف ها</MenuItem>
              </Select>
            </FormControl>
            <Button onClick={() => handleFilter()} variant="outlined">
              فیلتر نتایج
            </Button>
            <Button
              onClick={() => {
                nav(`/items?search=${searchValue}`);
              }}
              color="error"
              className="mt-4"
              variant="outlined"
            >
              حذف فیلتر ها
            </Button>
            {user && user.isAdmin && (
              <div className="mb-2">
                <Typography className="mt-4" variant="h6">
                  تغییر قیمت محصولات
                </Typography>
                <FormControl fullWidth className="mt-2">
                  <InputLabel id="operation-label">عملیات</InputLabel>
                  <Select
                    labelId="operation-label"
                    value={operation}
                    onChange={(e) => setOperation(e.target.value)}
                  >
                    <MenuItem value="sum">جمع</MenuItem>
                    <MenuItem value="multiply">ضرب</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  fullWidth
                  className="mt-2"
                  type="number"
                  label="مقدار(به تومان)"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
                <Button
                  className="mt-2"
                  variant="contained"
                  color="primary"
                  disabled={!operation || !amount}
                  onClick={() => setPriceChangeModal(true)}
                >
                  تایید تغییر قیمت
                </Button>
                <Typography className="mt-4" variant="h6">
                  بخش تخفیف ها
                </Typography>
                <TextField
                  fullWidth
                  className="mt-2"
                  type="number"
                  label="درصد تخفیف"
                  value={discount}
                  onChange={(e) => setDiscount(parseInt(e.target.value))}
                />
                <Button
                  sx={{ display: "block" }}
                  className="mt-2"
                  variant="contained"
                  color="primary"
                  disabled={discount == 0}
                  onClick={() => setApplyDiscountModal(true)}
                >
                  تایید تخفیف
                </Button>

                <hr />
                <Button
                  sx={{ display: "block" }}
                  className="mt-2"
                  variant="contained"
                  color="error"
                  disabled={discount !== 0}
                  onClick={() => setApplyDiscountModal(true)}
                >
                  برداشتن تخفیف
                </Button>
                <hr />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleRoundPrices}
                  sx={{ mt: 2 }}
                >
                  گرد کردن قیمت‌ها
                </Button>
              </div>
            )}
          </div>
        </Grid>
        <Grid
          xs={2}
          md={2}
          lg={3}
          container
          item
          spacing={1}
          columns={{ xs: 1, sm: 2, md: 3, lg: 4 }}
        >
          {items &&
            items.length > 0 &&
            items.map((obj, index) => (
              <Grid item xs={1} sm={1} md={1} lg={1} key={index}>
                <Card>
                  <div
                  // sx={{ display: "flex" }}
                  >
                    <LazyLoad offset={1000}>
                      <CardMedia
                        onClick={() => {
                          nav("/items/" + obj._id);
                        }}
                        className="pointer"
                        component="img"
                        // style={{ width: "100px" }}
                        image={getPicture(obj.pictures[0])}
                      />
                    </LazyLoad>

                    <CardContent>
                      <Typography
                        onClick={() => {
                          nav("/items/" + obj._id);
                        }}
                        fontFamily={"titr"}
                        className="mb-5 pointer"
                        gutterBottom
                        variant="h5"
                      >
                        {obj.productName}
                      </Typography>
                      <div
                        style={{ justifyContent: "space-between" }}
                        className="hstack"
                      >
                        <div>
                          {obj.liked ? (
                            <BookmarkIcon
                              fontSize="medium"
                              onClick={() => dislikeItem(obj, index)}
                            />
                          ) : (
                            <BookmarkBorderIcon
                              fontSize="medium"
                              onClick={() => likeItem(obj, index)}
                            />
                          )}
                        </div>
                        <div className="items-prices">
                          <Chip
                            size="medium"
                            variant="outlined"
                            color={!obj.originalPrice ? "secondary" : "success"}
                            label={getPrice(obj.price) + " تومان"}
                          />
                          {obj.originalPrice && (
                            <small className="items-original-price mt-1">
                              {getPrice(obj.originalPrice) + " تومان"}
                            </small>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              </Grid>
            ))}
        </Grid>
      </Grid>
      <div className="mt-4 item-pagination-wrapper">
        <Pagination
          className="item-pagination bg-dark"
          count={totalPages}
          page={currentPage}
          onChange={(e, value) => {
            handleFilter(value);
          }}
        />
      </div>
      <Modal open={priceChangeModal} onClose={() => setPriceChangeModal(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6">تایید تغییر قیمت</Typography>
          <Typography className="mt-2">
            عملیات: {operation === "sum" ? "جمع" : "ضرب"}
          </Typography>
          <Typography>
            مقدار:
            {"  "}
            {parseInt(amount).toLocaleString("en-US")}
            {"  "}
            تومان
          </Typography>
          <Typography>
            دسته‌بندی:{" "}
            {selectedCategory ? getCategoryTitle(selectedCategory) : "همه"}{" "}
            <br />
            زیر دسته‌بندی:{" "}
            {selectedSubCategory
              ? getSubCategoryTitle(selectedCategory, selectedSubCategory)
              : "همه"}
            <br />
            کلمه جستجو: {searchValue || "بدون کلمه"}
          </Typography>
          <div className="hstack mt-4" style={{ justifyContent: "flex-end" }}>
            <Button
              color="error"
              onClick={() => setPriceChangeModal(false)}
              variant="outlined"
            >
              لغو
            </Button>
            <Button
              color="primary"
              className="ms-2"
              onClick={handleConfirmOperation}
              variant="contained"
            >
              تایید
            </Button>
          </div>
        </Box>
      </Modal>
      <Modal
        open={applyDiscountModal}
        onClose={() => setApplyDiscountModal(false)}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          {discount !== 0 ? (
            <Typography variant="h6">تایید اعمال تخفیف </Typography>
          ) : (
            <Typography variant="h6">تایید برداشتن تخفیف </Typography>
          )}

          {discount !== 0 && <Typography>درصد تخفیف: {discount}</Typography>}
          <Typography>
            دسته‌بندی:{" "}
            {selectedCategory ? getCategoryTitle(selectedCategory) : "همه"}{" "}
            <br />
            زیر دسته‌بندی:{" "}
            {selectedSubCategory
              ? getSubCategoryTitle(selectedCategory, selectedSubCategory)
              : "همه"}
            <br />
            کلمه جستجو: {searchValue || "بدون کلمه"}
          </Typography>
          <div className="hstack mt-4" style={{ justifyContent: "flex-end" }}>
            <Button
              color="error"
              onClick={() => setApplyDiscountModal(false)}
              variant="outlined"
            >
              لغو
            </Button>
            {discount !== 0 ? (
              <Button
                color="primary"
                className="ms-2 mx-2"
                onClick={handleSetDiscount}
                variant="contained"
              >
                اعمال تخفیف
              </Button>
            ) : (
              <Button
                color="primary"
                className="ms-2 mx-2"
                onClick={handleRemoveDiscount}
                variant="contained"
              >
                برداشتن تخفیف
              </Button>
            )}
          </div>
        </Box>
      </Modal>
    </div>
  );
}
