import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {http, setTokenByLocalStorage} from "@/utils";
import {getMobileCodeParam, getMobileCodeResponse, LoginParams, LoginResponse, Token,} from "@/types/user";

// slice 名称
export const USER_FEATURE_KEY = "user";

// 用户切片状态类型
export type userSliceState = Token;
// 属性的初始值
const initialState: userSliceState = {
  token: "",
  refresh_token: "",
};

// 获取手机验证码
export const getMobileCode = createAsyncThunk<
  getMobileCodeResponse,
  getMobileCodeParam
>("user/getMobileCode", async (payload) => {
  return await http.get(`/sms/codes/${payload}`);
});

// 用户登录
export const login = createAsyncThunk<LoginResponse, LoginParams>(
  "user/login",
  (payload) => http.post("/authorizations", payload)
);

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
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state, action) => {
        console.log("login.pending", action);
      })
      .addCase(login.fulfilled, (state, action) => {
        // 登录成功
        console.log("login.fulfilled", action);
        if (action.payload !== undefined) {
          state.token = action.payload.token;
          state.refresh_token = action.payload.refresh_token;
          setTokenByLocalStorage(action.payload);
        }
      })
      .addCase(login.rejected, (state, action) => {
        console.log("login.rejected", action);
      });
  },
});

// actions: 对象类型，用于存储 action creator 函数
export const { clearToken } = actions;

export default userReducer;
