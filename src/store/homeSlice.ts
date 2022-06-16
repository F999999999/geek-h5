import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {http} from "@/utils";
import {Channel, GetChannelResponse} from "@/types/hoes";

// slice 名称
export const HOME_FEATURE_KEY = "home";

// 用户频道列表 key
const CHANNEL_KEY = "geek-channels";

// 初始状态类型
export type HomeState = {
  channels: Channel[];
};
// 初始状态
export const initialState: HomeState = {
  channels: JSON.parse(localStorage.getItem(CHANNEL_KEY) || "[]"),
};

// 获取所有频道列表
export const getAllChannels = createAsyncThunk<GetChannelResponse>(
  "home/getAllChannel",
  async (payload, thunkAPI) => {
    try {
      return await http.get("/channels");
    } catch (e) {
      return thunkAPI.rejectWithValue(e);
    }
  }
);

// 获取用户的频道列表
export const getUserChannel = createAsyncThunk<GetChannelResponse>(
  "home/getUserChannel",
  async (payload, thunkAPI) => {
    try {
      return await http.get("/user/channels");
    } catch (e) {
      return thunkAPI.rejectWithValue(e);
    }
  }
);

export const { actions, reducer: homeReducer } = createSlice({
  name: HOME_FEATURE_KEY,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUserChannel.fulfilled, (state, action) => {
        console.log("getUserChannel.fulfilled", action);
        // 保存到 state 中
        state.channels = action.payload.channels;
        // 保存到 localStorage 中
        localStorage.setItem(
          CHANNEL_KEY,
          JSON.stringify(action.payload.channels)
        );
      })
      .addCase(getAllChannels.fulfilled, (state, action) => {
        console.log("getAllChannel.fulfilled", action);
        // 保存到 state 中
        state.channels = action.payload.channels;
        // 保存到 localStorage 中
        localStorage.setItem(
          CHANNEL_KEY,
          JSON.stringify(action.payload.channels)
        );
      });
  },
});

export default homeReducer;
