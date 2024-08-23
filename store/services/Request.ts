import { GetItemFromLocalStorage } from "@/utils/localStorageFunc";
import axios from "axios";

const token = GetItemFromLocalStorage("token");
const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

const instance = axios.create({
  baseURL: baseUrl,
  timeout: 1000 * 60,
  responseType: "json",
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

instance.interceptors.request.use(
  function (config) {
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

const Request = async (options: any) => {
  try {
    const response = await instance(options);
    return response;
  } catch (error) {
    return Promise.reject(error);
  }
};

export default Request;
