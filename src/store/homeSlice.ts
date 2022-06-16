import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {http} from "@/utils";
import {
  AddUserChannelParams,
  AddUserChannelResponse,
  Channel,
  DelChannelParams,
  DelChannelResponse,
  GetChannelResponse,
} from "@/types/home";

// slice 名称
export const HOME_FEATURE_KEY = "home";

// 用户频道列表 key
export const CHANNEL_KEY = "geek-channels";

// 初始状态类型
export type HomeState = {
  channels: Channel[];
  channelActiveKey: Channel["id"];
};
// 初始状态
export const initialState: HomeState = {
  channels: JSON.parse(localStorage.getItem(CHANNEL_KEY) || "[]"),
  channelActiveKey: 0,
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

// 删除频道
export const delChannel = createAsyncThunk<
  DelChannelResponse,
  DelChannelParams
>("home/delChannel", async (payload, thunkAPI) => {
  try {
    return await http.delete(`/user/channels/${payload}`);
  } catch (e) {
    return thunkAPI.rejectWithValue(e);
  }
});

// 添加频道
export const addUserChannel = createAsyncThunk<
  AddUserChannelResponse,
  AddUserChannelParams
>("home/addChannel", async (payload, thunkAPI) => {
  try {
    return await http.patch("/user/channels", { channels: payload });
  } catch (e) {
    return thunkAPI.rejectWithValue(e);
  }
});

export const { actions, reducer: homeReducer } = createSlice({
  name: HOME_FEATURE_KEY,
  initialState,
  reducers: {
    // 切换频道
    toggleChannel(state, action: PayloadAction<number>) {
      state.channelActiveKey = action.payload;
    },
  },
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

export const { toggleChannel } = actions;

export default homeReducer;
