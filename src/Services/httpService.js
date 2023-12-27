import axios from "axios";

axios.defaults.baseURL = process.env.REACT_APP_API_URL;

const axiosInstance = axios.create({
  withCredentials: true,
  // Other default configuration options can be added here
});

axiosInstance.interceptors.response.use(null, (error) => {
  const expectedError =
    error.response &&
    error.response.status >= 400 &&
    error.response.status < 500;

  if (!expectedError) {
    console.log("aaa");
    console.log(error);
    alert("خطای غیر منتظره");
  }
  return Promise.reject(error);
});
export default axiosInstance;
