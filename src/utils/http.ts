import axios from "axios";
import { clearTokenByLocalStorage, getTokenByLocalStorage } from "@/utils/auth";
import { Toast } from "antd-mobile";
import { customHistory } from "@/utils/history";

const http = axios.create({
  baseURL: process.env.REACT_APP_URL,
  timeout: 5000,
});

// 请求拦截器
http.interceptors.request.use((config) => {
  // 除了登录请求外，其他请求统一添加 token
  if (!config.url?.startsWith("/authorizations")) {
    // 获取 token
    const { token } = getTokenByLocalStorage();
    if (token) {
      // 使用 非空断言 来排除 headers 类型中的 undefined 类型
      config.headers!.Authorization = "Basic " + token;
    }
  }
  return config;
});

// 响应拦截器
http.interceptors.response.use(
  (res) => {
    return res?.data?.data || res;
  },
  (e) => {
    // 响应失败时，会执行此处的回调函数
    if (!e.response) {
      // 网路超时
      Toast.show({
        content: "网络繁忙，请稍后再试",
        duration: 1000,
      });
    }

    if (e.response.status === 401) {
      // token 过期，登录超时
      Toast.show({
        content: "登录超时，请重新登录",
        duration: 1000,
        afterClose: () => {
          // 清空 token
          clearTokenByLocalStorage();
          // 跳转到登录页面
          customHistory.push("/login", {
            from: customHistory.location.pathname,
          });
        },
      });
    }
    return Promise.reject(e);
  }
);

export { http };
