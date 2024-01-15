import React from "react";
import HomeCategory from "./HomeCategory";
import { Typography } from "@mui/material";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
export default function HomeCategories() {
  const items = [
    {
      category: "659bbe5c29daece4c71db013",
      subCategory: "659bbe7029daece4c71db014",
    },
    {
      category: "659bbe5c29daece4c71db013",
      subCategory: "659bc39529daece4c71db017",
    },
    {
      category: "659bbe5c29daece4c71db013",
      subCategory: "659bc1c529daece4c71db016",
    },
    {
      category: "659bc4b329daece4c71db020",
    },
  ];
  return (
    <section>
      <div className="dflex-center mt-3 mb-1">
        <Typography fontFamily="titr" variant="h5" className="text-center ms-1">
          محبوب ترین ها
        </Typography>
        <FavoriteOutlinedIcon color="secondary" sx={{ marginBottom: "5px" }} />
      </div>
      <div className="home-categories-wrapper">
        {items.map((item, i) => (
          <HomeCategory item={item} key={i} imgSrc={`${i + 1}.jpg`} />
        ))}
      </div>
    </section>
  );
}
