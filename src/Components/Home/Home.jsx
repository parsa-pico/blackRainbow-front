import React from "react";
import { useEffect, useState } from "react";
import { tryHTTP } from "../../Common/commonFuncs";
import httpService from "../../Services/httpService";
import { getAnonymousId } from "../../Services/authService";
import Hero from "./Hero";
import Cat from "./Cat";
import HomeCategories from "./HomeCategories";
export default function Home() {
  const [videoLoaded, setVideoLoaded] = useState();
  return (
    <div>
      <Hero videoLoaded={videoLoaded} setVideoLoaded={setVideoLoaded} />
      <Cat />
      <HomeCategories />
      <video
        onLoadedData={() => {
          console.log("here");
          setVideoLoaded(true);
        }}
        muted
        autoPlay
        id="hero-img"
        className="img-fluid"
        src="/avc_hero - Trim.mp4"
      />
    </div>
  );
}
