import { Chip } from "@mui/material";
import React from "react";

export default function Tags({ tags, setTags }) {
  function handleDelete(i) {
    const tagsCopy = [...tags];
    tagsCopy.splice(i, 1);
    setTags(tagsCopy);
  }
  return (
    <div>
      {tags &&
        tags.length > 0 &&
        tags.map((tag, i) => {
          return (
            <Chip
              key={i}
              label={tag}
              variant="outlined"
              onDelete={() => handleDelete(i)}
            />
          );
        })}
    </div>
  );
}
