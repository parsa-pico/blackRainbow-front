import React, { useEffect, useRef, useState } from 'react';
import { Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function Hero({
  showLoadingVideo,
  videoLoaded,
  setVideoLoaded,
}) {
  const nav = useNavigate();

  useEffect(() => {
    if (!showLoadingVideo) return;

    const nav = document.getElementById('my-nav');
    nav.style.opacity = '0';
    document.body.style.overflow = 'hidden';
    // const pushTop = document.getElementById("push-top");
    // pushTop.style.display = "none";
    if (videoLoaded)
      setTimeout(() => {
        const heroVideo = document.getElementById('hero-img');
        document.getElementById('hero-btn').style.zIndex = 1;
        // element.style.display = "none";
        heroVideo.style.animation = 'hero-fade 1.5s forwards';
        // pushTop.style.display = "block";
        setTimeout(() => {
          nav.style.opacity = '1';
        }, 500);

        document.body.style.overflow = '';
        setTimeout(() => {
          document.getElementById('cat').style.display = 'block';
        }, 1000);
        setTimeout(() => {
          heroVideo.style.display = 'none';
        }, 1500);
      }, 1500);
  }, [videoLoaded]);

  return (
    <>
      <header className="w-100 hero-wrapper">
        <Typography fontFamily={'Anton'} className="hero-heading" variant="h2">
          Black <br></br> Rainbow
        </Typography>
        {videoLoaded && (
          <>
            <img className={'hero-real-img '} src="/hero-img.jpg" alt="" />

            <Button
              onClick={() => {
                nav('/items');
              }}
              style={{ zIndex: videoLoaded ? 1 : -1 }}
              variant="contained"
              color="secondary"
              id="hero-btn"
              className="w-50"
            >
              خرید کنید
            </Button>
          </>
        )}
      </header>
    </>
  );
}
