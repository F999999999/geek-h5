import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {http} from "@/utils";
import {ArticleDetail, GetArticleDetailParams, GetArticleDetailResponse,} from "@/types/article";

// slice 名称
export const ARTICLE_FEATURE_KEY = "article";

// 初始状态类型
export type ArticleState = {
  // 文章详情
  articleDetail: ArticleDetail;
};
// 初始状态
export const initialState: ArticleState = {
  articleDetail: {
    art_id: "",
    title: "",
    pubdate: "",
    aut_id: "",
    aut_name: "",
    aut_photo: "",
    is_followed: false,
    attitude: 0,
    content: "",
    is_collected: false,
    comm_count: 0,
    like_count: 0,
    read_count: 0,
  },
};

// 获取文章详情
export const getArticle = createAsyncThunk<
  GetArticleDetailResponse,
  GetArticleDetailParams
>("article/getArticle", async (payload, thunkAPI) => {
  try {
    return await http.get(`/articles/${payload}`);
  } catch (e) {
    return thunkAPI.rejectWithValue(e);
  }
});

export const { reducer: articleReducer } = createSlice({
  name: ARTICLE_FEATURE_KEY,
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(getArticle.fulfilled, (state, action) => {
      console.log("getArticle.fulfilled", action);
      state.articleDetail = action.payload;
    });
  },
});

export default articleReducer;
