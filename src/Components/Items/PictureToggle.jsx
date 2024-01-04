import * as React from "react";
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
import FormatAlignCenterIcon from "@mui/icons-material/FormatAlignCenter";
import FormatAlignRightIcon from "@mui/icons-material/FormatAlignRight";
import FormatAlignJustifyIcon from "@mui/icons-material/FormatAlignJustify";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { useEffect } from "react";

export default function PictureToggle({ itemData, setPictures }) {
  const [index, setIndex] = React.useState(1);

  useEffect(() => {
    if (index === 1) setPictures(itemData.pictures);
    if (index === 2) setPictures(itemData.customersPictures);
  }, [index]);
  const handleAlignment = (event, newIndex) => {
    if (newIndex !== null) setIndex(newIndex);
  };

  return (
    <ToggleButtonGroup
      className="mb-1"
      value={index}
      exclusive
      onChange={handleAlignment}
    >
      <ToggleButton value={1}>عکس های محصول</ToggleButton>
      <ToggleButton value={2}>عکس های ارسالی</ToggleButton>
    </ToggleButtonGroup>
  );
}
