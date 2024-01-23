import React, { useEffect, useState } from "react";
import { tryHTTP } from "../Common/commonFuncs";

export default function SiteMap() {
  const [data, setData] = useState("");
  useEffect(() => {
    tryHTTP(async (http) => {
      const { data: result } = await http.get("/sitemap");
      document.write(result);
    });
  }, []);
  return <></>;
}
