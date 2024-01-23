import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Chip,
  Typography,
} from "@mui/material";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import Carousel from "react-multi-carousel";

import { getPicture, getPrice, tryHTTP } from "../../Common/commonFuncs";
import { useNavigate } from "react-router-dom";

export default function HomeCarousel() {
  const nav = useNavigate();
  const [items, setItems] = useState([]);

  useEffect(() => {
    search();
  }, []);
  async function search() {
    tryHTTP(async (http) => {
      const { data } = await http.post("/items/get-by-keyword", {
        sortIndex: 5,
        page: 1,
      });
      setItems(data.result);
    });
  }
  return (
    <section>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "row",
        }}
      >
        <Typography fontFamily="titr" variant="h5" className="text-center">
          پرفروش ترین ها
        </Typography>
        <img
          src="/fire.webp"
          alt="fire"
          style={{
            width: "22px",
            marginBottom: "1rem",
            filter: "hue-rotate(3.142rad)",
          }}
        />
      </div>
      <div
        style={{
          paddingBottom: "30px",
          position: "relative",
        }}
      >
        <Carousel
          additionalTransfrom={0}
          arrows
          autoPlaySpeed={3000}
          centerMode={false}
          className=""
          dotListClass=""
          draggable
          focusOnSelect={false}
          itemClass=""
          keyBoardControl
          minimumTouchDrag={80}
          pauseOnHover
          renderArrowsWhenDisabled={false}
          renderButtonGroupOutside={false}
          renderDotsOutside
          responsive={{
            desktop: {
              breakpoint: {
                max: 3000,
                min: 1024,
              },
              items: 4,
            },
            mobile: {
              breakpoint: {
                max: 464,
                min: 0,
              },
              items: 2,
            },
            tablet: {
              breakpoint: {
                max: 1024,
                min: 464,
              },
              items: 3,
            },
          }}
          rewind={false}
          rewindWithAnimation={false}
          rtl
          shouldResetAutoplay
          showDots
          sliderClass=""
          slidesToSlide={2}
          swipeable
        >
          {items &&
            items.length > 0 &&
            items.map((obj, i) => {
              return (
                <div className=" mx-1" key={i}>
                  <Card className="home-carousel-card">
                    <CardActionArea
                      onClick={() => {
                        nav("/items/" + obj._id);
                      }}
                      // sx={{ display: "flex" }}
                    >
                      <CardMedia
                        className="pointer"
                        component="img"
                        // style={{ width: "100px" }}
                        image={getPicture(obj.pictures[0])}
                      />
                      <CardContent>
                        <Typography
                          fontFamily={"yekan"}
                          fontSize="medium"
                          className="mb-5"
                          gutterBottom
                          variant="h6"
                        >
                          {obj.productName}
                        </Typography>
                        <div
                          style={{ justifyContent: "space-between" }}
                          className="hstack"
                        >
                          <div></div>
                          <div className="items-prices">
                            <Chip
                              size="medium"
                              variant="outlined"
                              color={
                                !obj.originalPrice ? "secondary" : "success"
                              }
                              label={getPrice(obj.price) + " تومان"}
                            />
                            {obj.originalPrice && (
                              <small className="items-original-price mt-1">
                                {getPrice(obj.originalPrice) + " تومان"}
                              </small>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </div>
              );
            })}
        </Carousel>
      </div>
    </section>
  );
}
