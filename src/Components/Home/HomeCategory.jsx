import { map, round } from "lodash";
import React from "react";
import { useEffect } from "react";
import { useRef } from "react";
import { useState } from "react";
import { mapValue } from "./../../Common/commonFuncs";
import { Chip, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function HomeCategory({ item, imgSrc }) {
  const nav = useNavigate();
  const [percentageVisible, setPercentageVisible] = useState(0);
  const targetRef = useRef(null);

  const handleIntersection = (entries) => {
    const entry = entries[0];
    const visibleRatio = entry.intersectionRatio * 100;

    setPercentageVisible(visibleRatio);
  };

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1], // Trigger at specific intersection ratios
    };

    const observer = new IntersectionObserver(handleIntersection, options);

    if (targetRef.current) {
      observer.observe(targetRef.current);
    }

    return () => {
      if (targetRef.current) {
        observer.unobserve(targetRef.current);
      }
    };
  }, []);
  const maxBlurAmount = 2.5;
  const filterAmount = 100 - percentageVisible;

  const blurAmount = round(
    mapValue(percentageVisible, 0, 100, maxBlurAmount, 0),
    2
  );
  function goto_() {
    const { subCategory, category } = item;
    let link = `items?category=${category}`;
    if (subCategory) link += `&subCategory=${subCategory}`;
    nav(link);
  }
  return (
    <div
      onClick={() => {
        goto_();
      }}
      className="home-category-wrapper"
    >
      <img
        style={{
          filter: `grayscale(${filterAmount}%)  blur(${blurAmount}px)`,
        }}
        ref={targetRef}
        src={imgSrc}
        className="home-category"
        alt=""
      />
      {/* <Typography
        variant="h3"
        fontFamily={"titr"}
        // fontWeight={"bold"}
        sx={{
          textShadow:
            " 0 0 10px rgba(0, 0, 0, 0.8), 0 0 20px rgba(0, 0, 0, 0.6), 0 0 30px rgba(0, 0, 0, 0.4)",
        }}
        className="home-category-label"
      >
        {label}
      </Typography> */}
    </div>
  );
}
