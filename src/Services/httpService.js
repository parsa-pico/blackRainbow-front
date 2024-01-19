import axios from "axios";
import { toast } from "react-toastify";

axios.defaults.baseURL = process.env.REACT_APP_API_URL;
axios.defaults.withCredentials = true;
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
    console.log(error);
    toast.error("خطای غیر منتظره", { autoClose: 1000 });
  }
  return Promise.reject(error);
});
export default axiosInstance;
