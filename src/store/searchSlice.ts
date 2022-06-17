import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {http} from "@/utils";
import {
  getSearchResultParams,
  getSearchResultResponse,
  getSuggestionParams,
  getSuggestionResponse,
  SearchResult,
} from "@/types/search";

// slice 名称
export const SEARCH_FEATURE_KEY = "search";

// 搜索历史 key
export const SEARCH_HISTORY_KEY = "geek-h5-search-history";

// 初始状态类型
export type SearchState = {
  suggestion: string[];
  searchReducer: SearchResult;
};

// 初始状态
export const initialState: SearchState = {
  // 联想词列表
  suggestion: [],
  // 搜索结果
  searchReducer: {
    page: 0,
    per_page: 0,
    total_count: 0,
    results: [],
  },
};

// 获取联想词
export const getSuggestion = createAsyncThunk<
  getSuggestionResponse,
  getSuggestionParams
>("search/getSuggestion", async (payload, thunkAPI) => {
  try {
    return await http.get("/suggestion", { params: { q: payload } });
  } catch (e) {
    return thunkAPI.rejectWithValue(e);
  }
});

// 获取搜索结果
export const getSearchResult = createAsyncThunk<
  getSearchResultResponse,
  getSearchResultParams
>("search/getSearchResult", async (payload, thunkAPI) => {
  try {
    return await http.get("/search", { params: payload });
  } catch (e) {
    return thunkAPI.rejectWithValue(e);
  }
});

export const { actions, reducer: searchReducer } = createSlice({
  name: SEARCH_FEATURE_KEY,
  initialState,
  reducers: {
    // 清空联想词
    clearSuggestion: (state) => {
      state.suggestion = [];
    },
  },
  extraReducers(builder) {
    builder
      // 获取联想词
      .addCase(getSuggestion.fulfilled, (state, action) => {
        console.log("getSuggestion.fulfilled", action);
        state.suggestion =
          action.payload.options[0] === null ? [] : action.payload.options;
      })
      // 获取搜索结果
      .addCase(getSearchResult.fulfilled, (state, action) => {
        console.log("getSearchResult.fulfilled", action);
        state.searchReducer = action.payload;
      });
  },
});

export const { clearSuggestion } = actions;

export default searchReducer;
