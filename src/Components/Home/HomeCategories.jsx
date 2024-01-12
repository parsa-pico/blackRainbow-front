import React from "react";
import HomeCategory from "./HomeCategory";

export default function HomeCategories() {
  const items = [{}, {}, {}, {}];
  return (
    <div className="home-categories-wrapper">
      {items.map((item, i) => (
        <HomeCategory imgSrc={`${i + 1}.jpg`} />
      ))}
    </div>
  );
}
