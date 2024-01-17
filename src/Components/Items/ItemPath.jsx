import React from "react";

import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import { useNavigate } from "react-router-dom";
export default function ItemPath({ links }) {
  const nav = useNavigate();
  return (
    <div className="item-path-wrapper">
      <Breadcrumbs separator=">" aria-label="breadcrumb">
        {links &&
          links.length > 1 &&
          links.map((link, i) => {
            if (links[1]) {
              let query = `category=${links[0]._id}`;
              if (i === 1) query += `&subCategory=${links[1]._id}`;
              return (
                <Link
                  key={i}
                  className="pointer"
                  underline="hover"
                  color="inherit"
                  onClick={() => {
                    nav(`/items?${query}`);
                  }}
                >
                  {link.title}
                </Link>
              );
            }
          })}
        ,
      </Breadcrumbs>
    </div>
  );
}
