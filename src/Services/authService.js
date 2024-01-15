import jwtDecode from "jwt-decode";
// TODO: change this
const storage = localStorage;
export function getUser() {
  return JSON.parse(storage.getItem("userInfo"));
}
export function setUser(obj) {
  return storage.setItem("userInfo", JSON.stringify(obj));
}
export function setSessionId(id) {
  return storage.setItem("sessionId", id);
}
export function clearUser() {
  return storage.removeItem("userInfo");
}
// export function setAnonymousId(id) {
//   return storage.setItem("anonymous", id);
// }
export function getAnonymousId() {
  return getCookie("sessionId") || storage.getItem("sessionId");
}
function getCookie(cookieName) {
  const cookies = document.cookie.split(";");

  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split("=");
    if (name === cookieName) {
      return decodeURIComponent(value);
    }
  }

  return null;
}
export function getOrderInfo() {
  return JSON.parse(storage.getItem("orderInfo"));
}
export function setOrderInfoStroage(info) {
  storage.setItem("orderInfo", JSON.stringify(info));
}
export function getItemInfo() {
  const item = storage.getItem("itemInfo");
  return item ? JSON.parse(item) : null;
}
export function setItemInfo(info) {
  storage.setItem("itemInfo", JSON.stringify(info));
}
export function clearItemInfo() {
  storage.clear("itemInfo");
}
export function setHeroVideoDate() {
  storage.setItem("heroVideo", new Date());
}
export function getHeroVideoDate() {
  return new Date(storage.getItem("heroVideo"));
}
// export function getToken() {
//   return storage.getItem("token");
// }
// export function setToken(token) {
//   storage.setItem("token", token);
// }
// export function clearToken() {
//   storage.removeItem("token");
// }
// export function getDecodedToken() {
//   return jwtDecode(getToken());
// }
// export const authHeader = {
//   headers: { ["x-auth-token"]: getToken() },
// };
