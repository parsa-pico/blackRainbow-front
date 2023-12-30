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
            const keyWord = link.parentId ? "subCategory" : "category";
            return (
              <Link
                key={i}
                underline="hover"
                color="inherit"
                href={`/items?${keyWord}=${link._id}`}
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
