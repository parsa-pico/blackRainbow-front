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
          {/* <LazyLoad offset={300}> */}
          <div className="p-1">
            <HomeCarousel />
          </div>
          {/* </LazyLoad> */}
        </>
      )}

      {showVideo && <HomeVideo setVideoLoaded={setVideoLoaded} />}
    </div>
  );
}
