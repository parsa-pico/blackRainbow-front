import { randomNumberBetween } from "@mui/x-data-grid/utils/utils";
import { random } from "lodash";
import React, { useEffect, useRef, useState } from "react";

const Cat = () => {
  const [left, setLeft] = useState(0);
  const [offset, setOfsset] = useState(1);
  const [showCat, setShowCat] = useState(true);
  const windowWidth = document.body.clientWidth;
  const catRef = useRef();
  const timeOut = 100;
  useEffect(() => {
    if (showCat)
      setTimeout(async () => {
        const catElement = catRef.current;
        let offCopy = offset;
        if (left > windowWidth) {
          catElement.style.transform = "rotateY(180deg)";
          offCopy = -1;
        } else if (left <= -50) {
          catElement.style.transform = "";
          offCopy = 1;
        }
        setOfsset(offCopy);

        setLeft(left + offCopy);
      }, timeOut);
  }, [left]);

  return (
    <div
      onClick={() => {
        catRef.current.style.animation = "cat-fade 0.2s ease-in-out forwards";
        setTimeout(() => {
          catRef.current.style.display = "none";
          setShowCat(false);
        }, 1000);
      }}
      style={{ left: left + "px" }}
      ref={catRef}
      id="cat"
      className="cat"
    >
      <img src="/cat.gif" alt="" />
    </div>
  );
};

export default Cat;
