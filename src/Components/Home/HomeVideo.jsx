import React from "react";

export default function HomeVideo({ setVideoLoaded }) {
  return (
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
  );
}
