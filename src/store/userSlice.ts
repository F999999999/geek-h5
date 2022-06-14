import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {clearTokenByLocalStorage, getTokenByLocalStorage, http, setTokenByLocalStorage,} from "@/utils";
import {
  GetMobileCodeParam,
  GetMobileCodeResponse,
  GetUserProfileResponse,
  GetUserResponse,
  LoginParams,
  LoginResponse,
  Token,
  UpdateUserPhotoParam,
  UpdateUserPhotoResponse,
  UpdateUserProfileParam,
  UserInfo,
  UserProfile,
} from "@/types/user"; // slice 名称

// slice 名称
export const USER_FEATURE_KEY = "user";

// 用户切片状态类型
export type UserSliceState = {
  token: Token;
  userInfo: UserInfo;
  profile: UserProfile;
};
// 属性的初始值
const initialState: UserSliceState = {
  token: {
    token: getTokenByLocalStorage().token || "",
    refresh_token: getTokenByLocalStorage().refresh_token || "",
  },
  userInfo: {
    art_count: 0,
    fans_count: 0,
    follow_count: 0,
    id: "",
    like_count: 0,
    name: "",
    photo: "",
  },
  profile: {
    id: "",
    photo: "",
    name: "",
    mobile: "",
    gender: 0,
    birthday: "",
    intro: "",
  },
};

// 获取手机验证码
export const getMobileCode = createAsyncThunk<
  GetMobileCodeResponse,
  GetMobileCodeParam
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
export const getUser = createAsyncThunk<GetUserResponse>(
  "user/getUser",
  async (payload, thunkAPI) => {
    try {
      return await http.get("/user");
    } catch (e) {
      return thunkAPI.rejectWithValue(e);
    }
  }
);

// 获取个人信息
export const getUserProfile = createAsyncThunk<GetUserProfileResponse>(
  "user/getUserProfile",
  async (payload, thunkAPI) => {
    try {
      return await http.get("/user/profile");
    } catch (e) {
      return thunkAPI.rejectWithValue(e);
    }
  }
);

// 更新个人信息
export const updateUserProfile = createAsyncThunk<null, UpdateUserProfileParam>(
  "user/updateUserProfile",
  async (payload, thunkAPI) => {
    try {
      return await http.patch("user/profile", payload);
    } catch (e) {
      return thunkAPI.rejectWithValue(e);
    }
  }
);

// 更新个人头像
export const updateUserPhoto = createAsyncThunk<
  UpdateUserPhotoResponse,
  UpdateUserPhotoParam
>("user/updateUserPhoto", async (payload, thunkAPI) => {
  try {
    return await http.patch("user/photo", payload);
  } catch (e) {
    return thunkAPI.rejectWithValue(e);
  }
});

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
      // 清空 localStorage 中的 token
      clearTokenByLocalStorage();
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
        state.userInfo = action.payload;
      })
      // 获取个人信息
      .addCase(getUserProfile.fulfilled, (state, action) => {
        console.log("getUserProfile.fulfilled", action);
        state.profile = action.payload;
      });
  },
});

// actions: 对象类型，用于存储 action creator 函数
export const { clearToken } = actions;

export default userReducer;
