import React from "react";
import { useEffect, useState } from "react";
import { areDatesOnSameDay, tryHTTP } from "../../Common/commonFuncs";
import httpService from "../../Services/httpService";
import { getHeroVideoDate, setHeroVideoDate } from "../../Services/authService";
import Hero from "./Hero";
import Cat from "./Cat";
import HomeCategories from "./HomeCategories";
import HomeCarousel from "./HomeCarousel";
import HomeVideo from "./HomeVideo";
import LazyLoad from "react-lazy-load";
import { useGlobalLoading } from "./../../context/globalLoadingContext";
import { Typography } from "@mui/material";
import BoltIcon from "@mui/icons-material/Bolt";
export default function Home() {
  const [showVideo, setShowVideo] = useState(false);
  const [_, setGlobalLoading] = useGlobalLoading();
  const [videoLoaded, setVideoLoaded] = useState(false);

  useEffect(() => {
    function run() {
      const videoShown = getHeroVideoDate();
      if (!videoShown) {
        setShowVideo(true);

        setHeroVideoDate();
        return;
      }
      const sameDay = areDatesOnSameDay(videoShown, new Date());
      if (!sameDay) {
        setShowVideo(true);
        setHeroVideoDate();
      } else {
        setShowVideo(false);
        setVideoLoaded(true);
      }
    }
    run();
  }, []);
  useEffect(() => {
    if (!videoLoaded) setGlobalLoading(true);
    else setGlobalLoading(false);
  }, [videoLoaded]);
  return (
    <div>
      <Hero
        showLoadingVideo={showVideo}
        videoLoaded={videoLoaded}
        setVideoLoaded={setVideoLoaded}
      />

      {videoLoaded && (
        <>
          <Cat />
          <HomeCategories />

          <div className="p-1">
            <HomeCarousel
              sortIndex={3}
              title={
                <>
                  <Typography
                    fontFamily="titr"
                    variant="h5"
                    className="text-center"
                  >
                    جدید ترین ها
                  </Typography>
                  <BoltIcon color="success" />
                </>
              }
            />
            <HomeCarousel
              sortIndex={5}
              title={
                <>
                  <Typography
                    fontFamily="titr"
                    variant="h5"
                    className="text-center"
                  >
                    پرفروش ترین ها
                  </Typography>
                  <img
                    src="/fire.webp"
                    alt="fire"
                    style={{
                      width: "22px",
                      paddingBottom: "1rem",
                      filter: "hue-rotate(3.142rad)",
                    }}
                  />
                </>
              }
            />
          </div>
        </>
      )}

      {showVideo && <HomeVideo setVideoLoaded={setVideoLoaded} />}
    </div>
  );
}
