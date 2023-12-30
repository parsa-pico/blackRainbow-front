import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { getPicture, getPrice, tryHTTP } from "../../Common/commonFuncs";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Card,
  CardActionArea,
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

export default function GetItems() {
  const nav = useNavigate();
  const [items, setItems] = useState();
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const searchValue = searchParams.get("search") || "";

  const category = searchParams.get("category") || "";
  const subCategory = searchParams.get("subCategory") || "";

  function search() {
    tryHTTP(async (http) => {
      const { data } = await http.post("/items/get-by-keyword", {
        search: searchValue,
        category,
        subCategory,
      });

      setItems(data);
    });
    tryHTTP(async (http) => {
      const { data } = await http.get("/categories");
      setSelectedCategory(category);
      setSelectedSubCategory(subCategory);
      console.log(data);
      setCategories(data);
    });
  }
  useEffect(() => {
    search();
  }, []);

  function getSubCategoryItems() {
    const index = categories.findIndex((o) => o._id === selectedCategory);
    if (index !== -1)
      return categories[index].subCategories.map((obj) => {
        console.log(obj);
        return (
          <MenuItem key={obj._id} value={obj._id}>
            {obj.title}
          </MenuItem>
        );
      });
  }
  return (
    <div className="items-page-wrapper">
      {searchValue && <h3>نتایج برای "{searchValue}"</h3>}
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
          <div className="vstack">
            <FormControl
              sx={{ width: { xs: "100%", md: "50%", xl: "100%" } }}
              fullWidth
            >
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
            <FormControl
              className="my-2"
              sx={{ width: { xs: "100%", md: "50%", xl: "100%" } }}
              fullWidth
            >
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
            <Button
              onClick={() => {
                window.location = `/items?search=${searchValue}&category=${selectedCategory}&subCategory=${selectedSubCategory}`;
              }}
              variant="outlined"
            >
              فیلتر نتایج
            </Button>
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
                  <CardActionArea
                    // sx={{ display: "flex" }}
                    onClick={() => {
                      nav("/items/" + obj._id);
                    }}
                  >
                    <CardMedia
                      component="img"
                      // style={{ width: "100px" }}
                      image={getPicture(obj.pictures[0])}
                    />
                    <CardContent>
                      <Typography className="mb-5" gutterBottom component="div">
                        {obj.productName}
                      </Typography>
                      <div
                        style={{ justifyContent: "space-between" }}
                        className="hstack"
                      >
                        <div></div>
                        <Chip
                          size="lg"
                          variant="outlined"
                          color="success"
                          label={getPrice(obj.price) + " تومان"}
                        />
                      </div>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
        </Grid>
      </Grid>
    </div>
  );
}
