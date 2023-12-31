import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { getPicture, getPrice, tryHTTP } from "../../Common/commonFuncs";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Card,
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
export default function GetLikedItems() {
  const nav = useNavigate();
  const [items, setItems] = useState();
  const [globalLoading, setGlobalLoading] = useGlobalLoading();
  function search() {
    tryHTTP(
      async (http) => {
        setGlobalLoading(true);
        const { data } = await http.get("/likes");

        console.log(data);
        setItems(data);
      },
      () => {
        setGlobalLoading(false);
      }
    );
  }
  useEffect(() => {
    search();
  }, []);

  return (
    <div>
      <Typography
        fontFamily={"yekan"}
        textAlign="center"
        className="mb-5"
        gutterBottom
        variant="h4"
      >
        لیست علاقه مندی ها
      </Typography>
      <div className="liked-items-grid">
        {items &&
          items.length > 0 &&
          items.map((obj, index) => (
            <div key={index}>
              <Card>
                <div
                // sx={{ display: "flex" }}
                >
                  <CardMedia
                    onClick={() => {
                      nav("/items/" + obj._id);
                    }}
                    component="img"
                    // style={{ width: "100px" }}
                    image={getPicture(obj.pictures[0])}
                  />
                  <CardContent>
                    <Typography
                      fontFamily={"yekan"}
                      className="mb-5"
                      gutterBottom
                      variant="h6"
                    >
                      {obj.productName}
                    </Typography>
                    <div
                      style={{ justifyContent: "space-between" }}
                      className="hstack"
                    >
                      <div></div>
                      <Chip
                        size="medium"
                        variant="outlined"
                        color="success"
                        label={getPrice(obj.price) + " تومان"}
                      />
                    </div>
                  </CardContent>
                </div>
              </Card>
            </div>
          ))}
      </div>
    </div>
  );
}
