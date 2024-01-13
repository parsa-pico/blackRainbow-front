import React from "react";
import { useEffect, useState } from "react";
import { tryHTTP } from "../../Common/commonFuncs";
import httpService from "../../Services/httpService";
import { getAnonymousId } from "../../Services/authService";
import Hero from "./Hero";
import Cat from "./Cat";
import HomeCategories from "./HomeCategories";
import HomeCarousel from "./HomeCarousel";
import HomeVideo from "./HomeVideo";
import LazyLoad from "react-lazy-load";
export default function Home() {
  const [videoLoaded, setVideoLoaded] = useState();
  return (
    <div>
      <Hero videoLoaded={videoLoaded} setVideoLoaded={setVideoLoaded} />
      <Cat />
      <HomeCategories />
      {videoLoaded && (
        <LazyLoad offset={300}>
          <div className="p-1">
            <HomeCarousel />
          </div>
        </LazyLoad>
      )}

      <HomeVideo setVideoLoaded={setVideoLoaded} />
    </div>
  );
}
