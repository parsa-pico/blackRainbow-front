import React, { useState, useEffect } from "react";
import { useRef } from "react";
import Carousel from "react-multi-carousel";

export default function ItemImage({ picsData: pictures, itemData }) {
  const carouselRef = useRef();
  // const [index, setIndex] = useState(0);

  useEffect(() => {
    carouselRef.current.goToSlide(0);
  }, [pictures]);
  // const handleSelect = (selectedIndex, e) => {
  //   setIndex(selectedIndex);
  // };
  return (
    <div className="item-carousel">
      <Carousel
        ref={carouselRef}
        additionalTransfrom={0}
        arrows
        // containerClass="container"
        dotListClass=""
        draggable
        focusOnSelect
        itemClass=""
        keyBoardControl
        minimumTouchDrag={80}
        pauseOnHover
        renderArrowsWhenDisabled={false}
        renderButtonGroupOutside={false}
        // renderDotsOutside
        responsive={{
          desktop: {
            breakpoint: {
              max: 3000,
              min: 1024,
            },
            items: 1,
          },
          mobile: {
            breakpoint: {
              max: 464,
              min: 0,
            },
            items: 1,
          },
          tablet: {
            breakpoint: {
              max: 1024,
              min: 464,
            },
            items: 1,
          },
        }}
        containerClass="w-100"
        rewind={false}
        rewindWithAnimation={false}
        rtl
        shouldResetAutoplay
        showDots
        sliderClass=""
        slidesToSlide={1}
        swipeable
      >
        {pictures &&
          pictures.length > 0 &&
          pictures.map((link, i) => {
            return (
              <div className={"item-carousel-item "} key={i}>
                <img
                  name="item-img"
                  className="img-fluid item-carousel-img"
                  src={link}
                  alt={itemData && itemData.productName}
                />
              </div>
            );
          })}
      </Carousel>
    </div>
  );
}
