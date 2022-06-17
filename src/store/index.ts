import { configureStore } from "@reduxjs/toolkit";
import userReducer, { USER_FEATURE_KEY } from "@/store/userSlice";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import homeReducer, { HOME_FEATURE_KEY } from "@/store/homeSlice";
import searchReducer, { SEARCH_FEATURE_KEY } from "@/store/searchSlice";

export const store = configureStore({
  // 是否开启浏览器的 redux 开发者调试工具
  devTools: process.env.NODE_ENV !== "production",
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // 禁用不可序列化数据警告
      serializableCheck: false,
    }),
  // 合并应用中的多个 reducer 函数, 组成最终的 Store 对象
  reducer: {
    [USER_FEATURE_KEY]: userReducer,
    [HOME_FEATURE_KEY]: homeReducer,
    [SEARCH_FEATURE_KEY]: searchReducer,
  },
});

// 从 store 自身推断 RootState 和 AppDispatch 的类型
export type RootState = ReturnType<typeof store.getState>;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
