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
  Grid,
  Typography,
} from "@mui/material";

export default function GetItems() {
  const nav = useNavigate();
  const [items, setItems] = useState();
  const [searchParams] = useSearchParams();
  function search() {
    tryHTTP(async (http) => {
      const search = searchParams.get("search");
      const { data } = await http.post("/items/get-by-keyword", { search });
      console.log(data);
      setItems(data);
    });
  }
  useEffect(() => {
    search();
  }, []);
  return (
    <div className="items-page-wrapper">
      <div className="items-page">
        <div className="items-page-filters-wrapper">{/* فیلتر ها  */}</div>
        <Grid
          container
          spacing={{ xs: 2, md: 3 }}
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
                        <small>{getPrice(obj.price)}تومان</small>
                      </div>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
        </Grid>
      </div>
    </div>
  );
}
