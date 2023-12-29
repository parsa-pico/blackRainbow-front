import { Chip, Grid } from "@mui/material";
import React from "react";
import { searchText } from "../../Common/commonFuncs";

export default function ItemTags({ tags }) {
  return (
    <div>
      <small>برچسب ها :</small>
      <Grid container>
        {tags &&
          tags.length > 0 &&
          tags.map((tag, i) => {
            return (
              <Grid className="my-1" xs={2} md={1} key={i} item>
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
    </div>
  );
}
