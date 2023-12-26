import React from "react";
import { useEffect } from "react";
import { tryHTTP } from "../../Common/commonFuncs";
import httpService from "../../Services/httpService";
export default function Home() {
  useEffect(() => {
    tryHTTP(async () => {
      const { data } = await httpService.get("/carts");
      console.log(data);
    });
  }, []);
  return <div></div>;
}
