import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {getTokenByLocalStorage, http, setTokenByLocalStorage} from "@/utils";
import {
  getMobileCodeParam,
  getMobileCodeResponse,
  getUserResponse,
  LoginParams,
  LoginResponse,
  Token,
  User,
} from "@/types/user";

// slice 名称
export const USER_FEATURE_KEY = "user";

// 用户切片状态类型
export type UserSliceState = { token: Token; profile: User };
// 属性的初始值
const initialState: UserSliceState = {
  token: {
    token: getTokenByLocalStorage().token || "",
    refresh_token: getTokenByLocalStorage().refresh_token || "",
  },
  profile: {
    art_count: 0,
    fans_count: 0,
    follow_count: 0,
    id: "",
    like_count: 0,
    name: "",
    photo: "",
  },
};

// 获取手机验证码
export const getMobileCode = createAsyncThunk<
  getMobileCodeResponse,
  getMobileCodeParam
>("user/getMobileCode", async (payload, thunkAPI) => {
  try {
    return await http.get(`/sms/codes/${payload}`);
  } catch (e) {
    return thunkAPI.rejectWithValue(e);
  }
});

// 用户登录
export const login = createAsyncThunk<LoginResponse, LoginParams>(
  "user/login",
  async (payload, thunkAPI) => {
    try {
      return await http.post("/authorizations", payload);
    } catch (e) {
      return thunkAPI.rejectWithValue(e);
    }
  }
);

// 获取用户信息
export const getUser = createAsyncThunk<getUserResponse>(
  "user/getUser",
  async (payload, thunkAPI) => {
    try {
      return await http.get("/user");
    } catch (e) {
      return thunkAPI.rejectWithValue(e);
    }
  }
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
      state.token.token = "";
      state.token.refresh_token = "";
    },
  },
  // 通过 extraReducers 配置项处理异步 action
  extraReducers: (builder) => {
    builder
      // 登录
      .addCase(login.fulfilled, (state, action) => {
        // 登录成功
        console.log("login.fulfilled", action);
        if (action.payload !== undefined) {
          state.token.token = action.payload.token;
          state.token.refresh_token = action.payload.refresh_token;
          setTokenByLocalStorage(action.payload);
        }
      })
      // 获取用户信息
      .addCase(getUser.fulfilled, (state, action) => {
        console.log("getUser.fulfilled", action);
        state.profile = action.payload;
      });
  },
});

// actions: 对象类型，用于存储 action creator 函数
export const { clearToken } = actions;

export default userReducer;
