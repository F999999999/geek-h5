import { configureStore } from "@reduxjs/toolkit";
import userSlice, { USER_FEATURE_KEY } from "@/store/userSlice";

export const store = configureStore({
  // 是否开启浏览器的 redux 开发者调试工具
  devTools: process.env.NODE_ENV !== "production",
  // 合并应用中的多个 reducer 函数, 组成最终的 Store 对象
  reducer: {
    [USER_FEATURE_KEY]: userSlice,
  },
});

// 从 store 自身推断 RootState 和 AppDispatch 的类型
export type RootState = ReturnType<typeof store.getState>;
// 推断类型: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
