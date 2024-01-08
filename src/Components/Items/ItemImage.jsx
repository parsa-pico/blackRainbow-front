import React, { useState, useEffect } from "react";
import { Carousel } from "react-bootstrap";
export default function ItemImage({ picsData }) {
  const [pictures, setPictures] = useState([]);
  const baseInterval = 2500;
  const [imgInterval, setImgInterval] = useState(baseInterval);
  const [index, setIndex] = useState(0);
  useEffect(() => {
    setPictures(picsData);
    setIndex(0);
  }, [picsData]);
  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex);
  };
  return (
    <div>
      <Carousel
        onTouchStart={() => {
          setImgInterval(null);
        }}
        onTouchEnd={() => {
          setImgInterval(baseInterval);
        }}
        activeIndex={index}
        onSelect={handleSelect}
        className="relative item-carousel"
        interval={imgInterval}
      >
        {pictures &&
          pictures.length > 0 &&
          pictures.map((link, i) => (
            <Carousel.Item className="item-carousel-item" key={i}>
              <img className="img-fluid item-carousel-img" src={link} alt="" />
            </Carousel.Item>
          ))}
      </Carousel>
    </div>
  );
}
