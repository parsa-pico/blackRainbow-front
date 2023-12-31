import React from "react";

import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
export default function ItemPath({ links }) {
  return (
    <div className="item-path-wrapper">
      <Breadcrumbs separator=">" aria-label="breadcrumb">
        {links &&
          links.length > 0 &&
          links.map((link, i) => {
            let query = `category=${links[0]._id}`;
            if (i === 1) query += `&subCategory=${links[1]._id}`;
            return (
              <Link
                key={i}
                underline="hover"
                color="inherit"
                href={`/items?${query}`}
              >
                {link.title}
              </Link>
            );
          })}
        ,
      </Breadcrumbs>
    </div>
  );
}
