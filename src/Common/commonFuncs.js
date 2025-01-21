import { toast } from "react-toastify";

import httpService from "../Services/httpService.js";
import { AxiosError } from "axios";

export const persianDays = [
  "شنبه",
  "یکشنبه",
  "دوشنبه",
  "سه‌شنبه",
  "چهارشنبه",
  "پنجشنبه",
  "جمعه",
];
export function getBackUrl() {
  const url = process.env.REACT_APP_API_URL;

  if (!url) throw new Error("back end url not defined");
  else return url;
}
// export function handleLogout() {
//   clearToken();
//   window.location = `/`;
// }
export async function tryHTTP(func, doFinally, doCatch) {
  try {
    await func(httpService);
  } catch (e) {
    const expectedError =
      e.response && e.response.status >= 400 && e.response.status < 500;

    if (e && e instanceof AxiosError && e.response) {
      if (expectedError) {
        const msg =
          e.response.data.msg || e.response.data.message || e.response.data;

        toast.error(msg);
      }
    } else if (!e instanceof AxiosError) {
      console.log("here");

      alert(e.message);
    }

    if (doCatch) doCatch(e);
  } finally {
    if (doFinally) doFinally();
  }
}
// export async function tryLoadingHTTP(func, doFinally, doCatch) {
//   function f() {
//     setGlobalLoading(true);
//     func();
//   }
//   function doF() {
//     doFinally();
//     setGlobalLoading(false);
//   }
//   await tryHTTP(f, doF, doCatch);
// }
export function areDatesOnSameDay(date1, date2) {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}
export function readFile(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(reader.result), false);
    reader.readAsDataURL(file);
  });
}
export function getPrice(price) {
  return (price / 10).toLocaleString();
}
export function hasOptions(question) {
  return ["checkbox", "radio"].includes(question.type);
}
export function downloadCSV(content, filename) {
  const blob = new Blob([content], { type: "data:application/text" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}
export function toggleFullScreen(elementId) {
  const container = document.getElementById(elementId);
  if (document.fullscreenElement) {
    document.exitFullscreen();
    return;
  }

  if (container.requestFullscreen) return container.requestFullscreen();
  if (container.mozRequestFullScreen) return container.mozRequestFullScreen();
  if (container.webkitRequestFullscreen)
    return container.webkitRequestFullscreen();
  if (container.msRequestFullscreen) return container.msRequestFullscreen();
}
export function secondsToTime(seconds, maxSeconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = parseInt(seconds % 60);

  const maxHours = maxSeconds ? Math.floor(maxSeconds / 3600) : hours;

  const formattedHours = hours.toString().padStart(2, "0");
  const formattedMinutes = minutes.toString().padStart(2, "0");
  const formattedSeconds = remainingSeconds.toString().padStart(2, "0");

  if (maxHours > 0) {
    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  } else {
    return `${formattedMinutes}:${formattedSeconds}`;
  }
}
export function isEmptyObj(obj) {
  return Object.keys(obj).length === 0;
}
export function requestFullscreen(elementId) {
  const container = document.getElementById(elementId);
  if (container.requestFullscreen) container.requestFullscreen();
  else if (container.mozRequestFullScreen) container.mozRequestFullScreen();
  else if (container.webkitRequestFullscreen)
    container.webkitRequestFullscreen();
  else if (container.msRequestFullscreen) container.msRequestFullscreen();
}
export function searchText(value) {
  window.location = `/items/?search=${value}`;
}
export function getPicture(pictureName) {
  return `${getBackUrl()}/pictures/${pictureName}`;
}
export function getDate(dateValue) {
  let date = new Date(dateValue);
  date = date.toLocaleString("fa-IR").split(" ")[0].replace(/,/g, "").trim();
  return date;
}
export function getOrderStatus(result, OrderStatus) {
  return result.paymentMethod === 2 && result.status === 1
    ? { text: "در انتظار تایید پرداخت", color: "yellow" }
    : { text: OrderStatus[result.status], color: "" };
}
export function mapValue(value, fromMin, fromMax, toMin, toMax) {
  // Ensure the value is within the source range [fromMin, fromMax]
  const clampedValue = Math.min(Math.max(value, fromMin), fromMax);

  // Map the clamped value from the source range to the target range
  const mappedValue =
    ((clampedValue - fromMin) / (fromMax - fromMin)) * (toMax - toMin) + toMin;

  return mappedValue;
}
