import React from "react";

import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
export default function ItemPath({ links }) {
  console.log(links);
  return (
    <div>
      <Breadcrumbs aria-label="breadcrumb">
        {links &&
          links.length > 0 &&
          links.map((link, i) => {
            return (
              <Link
                key={i}
                underline="hover"
                color="inherit"
                href={`/categories/${link._id}`}
              >
                {link.title}
              </Link>
            );
          })}
      </Breadcrumbs>
    </div>
  );
}
