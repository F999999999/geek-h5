import axios from "axios";
import {
  clearTokenByLocalStorage,
  getTokenByLocalStorage,
  setTokenByLocalStorage,
} from "@/utils/auth";
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
  async (e) => {
    // 响应失败时，会执行此处的回调函数
    if (!e.response) {
      // 网路超时
      Toast.show({
        content: "网络繁忙，请稍后再试",
        duration: 1000,
      });
    }

    // token 过期，登录超时
    if (e.response.status === 401) {
      // 获取 续期token
      const { refresh_token } = getTokenByLocalStorage();
      // 判断是否有续期token
      if (refresh_token) {
        // 保存上次的请求数据
        const oldReqConfig = e.response.config;
        // 发送请求获取新的 token
        const res: { token: string } = await http.put("/authorizations", null, {
          headers: {
            Authorization: "Basic " + refresh_token,
          },
        });
        // 保存新的 token
        setTokenByLocalStorage({ token: res.token, refresh_token });
        // 设置请求头 Authorization 使其携带新获取的 token
        oldReqConfig.headers.Authorization = "Basic " + res.token;
        // 请求重发
        try {
          return Promise.resolve(await http.request(oldReqConfig));
        } catch (err) {
          return Promise.reject(err);
        }
      }

      // 续期token过期或无续期token 无法获取新的token 跳转到登录页面重新登录
      Toast.show({
        content: "登录超时，请重新登录",
        duration: 1000,
        afterClose: () => {
          // 清空 token
          clearTokenByLocalStorage();
          // 跳转到登录页面
          customHistory.push("/login", {
            redirectURL: customHistory.location.pathname,
          });
        },
      });
    }
    return Promise.reject(e);
  }
);

export { http };
