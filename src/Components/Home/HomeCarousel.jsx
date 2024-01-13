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
import "react-multi-carousel/lib/styles.css";
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
        sortIndex: 3,
        page: 1,
      });
      setItems(data.result);
    });
  }
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "row",
        }}
      >
        <Typography fontFamily="titr" variant="h5" className="text-center">
          جدید ترین محصولات
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
          containerClass="container"
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
                <div className="mx-1" key={i}>
                  <Card>
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
                          <Chip
                            size="medium"
                            variant="outlined"
                            color="success"
                            label={getPrice(obj.price) + " تومان"}
                          />
                        </div>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </div>
              );
            })}
        </Carousel>
      </div>
    </div>
  );
}
