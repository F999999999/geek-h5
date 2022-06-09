import { Token } from "@/types/user";

const TOKEN_KEY = "geek-h5-token";

// 获取token
export const getTokenByLocalStorage = () =>
  JSON.parse(localStorage.getItem(TOKEN_KEY) || "{}");
// 存储token
export const setTokenByLocalStorage = (token: Token) =>
  localStorage.setItem(TOKEN_KEY, JSON.stringify(token));
// 清除token
export const clearTokenByLocalStorage = () =>
  localStorage.removeItem(TOKEN_KEY);
// 是否登录
export const isAuth = () => !!getTokenByLocalStorage();
