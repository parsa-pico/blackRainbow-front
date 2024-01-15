import { Chip, Grid } from "@mui/material";
import React from "react";
import { searchText } from "../../Common/commonFuncs";

export default function ItemTags({ tags }) {
  return (
    <div>
      {tags && tags.length > 0 && (
        <>
          <small>تگ ها :</small>
          <Grid container columns={{ xs: 12, sm: 12, md: 12 }}>
            {tags.map((tag, i) => {
              return (
                <Grid className="my-1" xs={4} sm={3} md={2} key={i} item>
                  <Chip
                    onClick={() => {
                      searchText(tag);
                    }}
                    label={tag}
                  />
                </Grid>
              );
            })}
          </Grid>
        </>
      )}
    </div>
  );
}
