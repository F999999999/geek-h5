import {createSlice} from "@reduxjs/toolkit";

// slice 名称
export const USER_FEATURE_KEY = "user";

// 属性的初始值
const initialState = {
  token: "",
};

export const { actions, reducer: userReducer } = createSlice({
  // name 属性用于指定 slice 的名称, 用于区分不同的 slice
  name: USER_FEATURE_KEY,
  // initialState 属性用于指定初始状态, 可以是一个函数, 在函数中可以访问到其他 slice 的 state
  initialState,
  // reducers 属性用于指定 slice 的 reducer 函数, 用于处理 action, 可以是一个函数, 在函数中可以访问到其他 slice 的 state
  reducers: {
    // 清空 token
    clearToken: (state) => {
      // 清空 state 中的 token
      state.token = "";
    },
  },
  // 通过 extraReducers 配置项处理异步 action
  extraReducers: {},
});

// actions: 对象类型，用于存储 action creator 函数
// { setToken: (payload) => ({ type: "user/setToken", payload }) }
export const { clearToken } = actions;

export default userReducer;
