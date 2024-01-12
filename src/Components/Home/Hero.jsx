import React, { useEffect, useRef, useState } from "react";
import { Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Hero({ videoLoaded, setVideoLoaded }) {
  const nav = useNavigate();
  const [showVideo, setShowVideo] = useState(false);
  const videoElement = useRef();
  useEffect(() => {
    const nav = document.getElementById("my-nav");
    nav.style.opacity = "0";
    document.body.style.overflow = "hidden";
    // const pushTop = document.getElementById("push-top");
    // pushTop.style.display = "none";
    if (videoLoaded)
      setTimeout(() => {
        const heroVideo = document.getElementById("hero-img");
        document.getElementById("hero-btn").style.zIndex = 1;
        // element.style.display = "none";
        heroVideo.style.animation = "hero-fade 1.5s forwards";
        // pushTop.style.display = "block";
        setTimeout(() => {
          nav.style.opacity = "1";
        }, 500);

        document.body.style.overflow = "";
        setTimeout(() => {
          document.getElementById("cat").style.display = "block";
        }, 1000);
        setTimeout(() => {
          heroVideo.style.display = "none";
        }, 1500);
      }, 1500);
  }, [videoLoaded]);

  return (
    <>
      <div className="w-100 hero-wrapper">
        <Typography fontFamily={"Anton"} className="hero-heading" variant="h2">
          Black <br></br> Rainbow
        </Typography>
        {videoLoaded && (
          <>
            {!showVideo && (
              <img className="hero-real-img" src="/hero-img.jpg" alt="" />
            )}
            {/* {showVideo && (
              <video
                ref={videoElement}
                className="hero-real-img"
                src="/hero-moving.mp4"
              />
            )} */}
            <Button
              onClick={() => {
                // setShowVideo(!showVideo);
                // videoElement.current.play();
                nav("/items");
              }}
              variant="contained"
              color="secondary"
              id="hero-btn"
              className="w-50"
            >
              خرید کنید
            </Button>
          </>
        )}
      </div>
    </>
  );
}
