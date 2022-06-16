import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {http} from "@/utils";
import {
  AddUserChannelParams,
  AddUserChannelResponse,
  Articles,
  Channel,
  DelChannelParams,
  DelChannelResponse,
  GetArticleListParams,
  GetArticleListResponse,
  GetChannelResponse,
} from "@/types/home";

// slice 名称
export const HOME_FEATURE_KEY = "home";

// 用户频道列表 key
export const CHANNEL_KEY = "geek-channels";

// 初始状态类型
export type HomeState = {
  // 频道列表
  channels: Channel[];
  // 当前选中的频道
  channelActiveKey: Channel["id"];
  // 当前频道的文章列表
  channelArticles: { [key in string]: Articles };
};
// 初始状态
export const initialState: HomeState = {
  channels: JSON.parse(localStorage.getItem(CHANNEL_KEY) || "[]"),
  channelActiveKey: 0,
  channelArticles: {},
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

// 根据频道id获取文章列表
export const getArticleListByChannelId = createAsyncThunk<
  GetArticleListResponse,
  GetArticleListParams
>("home/getArticleListByChannelId", async (payload, thunkAPI) => {
  try {
    return await http.get("/articles", { params: payload });
  } catch (e) {
    return thunkAPI.rejectWithValue(e);
  }
});

// 获取更多文章
export const getNewestArticleList = createAsyncThunk<
  GetArticleListResponse,
  GetArticleListParams
>("home/getMoreArticles", async (payload, thunkAPI) => {
  try {
    return await http.get("/articles", { params: payload });
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
      // 获取用户频道列表
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
      // 获取所有频道列表
      .addCase(getAllChannels.fulfilled, (state, action) => {
        console.log("getAllChannel.fulfilled", action);
        // 保存到 state 中
        state.channels = action.payload.channels;
        // 保存到 localStorage 中
        localStorage.setItem(
          CHANNEL_KEY,
          JSON.stringify(action.payload.channels)
        );
      })
      // 根据频道id获取文章列表
      .addCase(getArticleListByChannelId.fulfilled, (state, action) => {
        console.log("getArticleListByChannelId.fulfilled", action);
        // 追加数据
        state.channelArticles[state.channelActiveKey] = {
          pre_timestamp: action.payload.pre_timestamp,
          results: [
            ...(state.channelArticles[state.channelActiveKey]?.results ?? []),
            ...action.payload.results,
          ],
        };
      })
      // 获取更多文章
      .addCase(getNewestArticleList.fulfilled, (state, action) => {
        console.log("getNewestArticleList.fulfilled", action);
        // 重置数据
        state.channelArticles[state.channelActiveKey] = action.payload;
      });
  },
});

export const { toggleChannel } = actions;

export default homeReducer;
