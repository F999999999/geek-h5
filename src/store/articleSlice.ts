import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {http} from "@/utils";
import {
  ArticleComment,
  ArticleDetail,
  CollectArticleParams,
  CollectArticleResponse,
  FollowAuthorParams,
  FollowAuthorResponse,
  GetArticleCommentsParams,
  GetArticleCommentsResponse,
  GetArticleDetailParams,
  GetArticleDetailResponse,
  GetMoreArticleCommentsParams,
  GetMoreArticleCommentsResponse,
  LikeArticleParams,
  LikeArticleResponse,
  UncollectArticleParams,
  UncollectArticleResponse,
  UnfollowAuthorParams,
  UnfollowAuthorResponse,
  UnlikeArticleParams,
  UnlikeArticleResponse,
} from "@/types/article";

// slice 名称
export const ARTICLE_FEATURE_KEY = "article";

// 初始状态类型
export type ArticleState = {
  articleDetail: ArticleDetail;
  articleComments: ArticleComment;
};
// 初始状态
export const initialState: ArticleState = {
  // 文章详情
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
  // 文章评论
  articleComments: {
    total_count: 0,
    end_id: null,
    last_id: null,
    results: [],
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

// 收藏文章
export const collectArticle = createAsyncThunk<
  CollectArticleResponse,
  CollectArticleParams
>("article/collectArticle", async (payload, thunkAPI) => {
  try {
    return await http.post("article/collections", payload);
  } catch (e) {
    return thunkAPI.rejectWithValue(e);
  }
});

// 取消收藏文章
export const uncollectArticle = createAsyncThunk<
  UncollectArticleResponse,
  UncollectArticleParams
>("article/uncollectArticle", async (payload, thunkAPI) => {
  try {
    return await http.delete(`article/collections/${payload.target}`);
  } catch (e) {
    return thunkAPI.rejectWithValue(e);
  }
});

// 点赞文章
export const likeArticle = createAsyncThunk<
  LikeArticleResponse,
  LikeArticleParams
>("article/likeArticle", async (payload, thunkAPI) => {
  try {
    return await http.post("article/likings", payload);
  } catch (e) {
    return thunkAPI.rejectWithValue(e);
  }
});

// 取消点赞文章
export const unlikeArticle = createAsyncThunk<
  UnlikeArticleResponse,
  UnlikeArticleParams
>("article/unlikeArticle", async (payload, thunkAPI) => {
  try {
    return await http.delete(`article/likings/${payload.target}`);
  } catch (e) {
    return thunkAPI.rejectWithValue(e);
  }
});

// 关注作者
export const followAuthor = createAsyncThunk<
  FollowAuthorResponse,
  FollowAuthorParams
>("article/followAuthor", async (payload, thunkAPI) => {
  try {
    return await http.post("/user/followings", payload);
  } catch (e) {
    return thunkAPI.rejectWithValue(e);
  }
});

// 取消关注作者
export const unfollowAuthor = createAsyncThunk<
  UnfollowAuthorResponse,
  UnfollowAuthorParams
>("article/unfollowAuthor", async (payload, thunkAPI) => {
  try {
    return await http.delete(`/user/followings/${payload.target}`);
  } catch (e) {
    return thunkAPI.rejectWithValue(e);
  }
});

// 获取文章评论
export const getArticleComments = createAsyncThunk<
  GetArticleCommentsResponse,
  GetArticleCommentsParams
>("article/getArticleComments", async (payload, thunkAPI) => {
  try {
    return await http.get("/comments", { params: payload });
  } catch (e) {
    return thunkAPI.rejectWithValue(e);
  }
});

// 获取更多文章评论
export const getMoreArticleComments = createAsyncThunk<
  GetMoreArticleCommentsResponse,
  GetMoreArticleCommentsParams
>("article/getMoreArticleComments", async (payload, thunkAPI) => {
  try {
    return await http.get("/comments", { params: payload });
  } catch (e) {
    return thunkAPI.rejectWithValue(e);
  }
});

export const { actions, reducer: articleReducer } = createSlice({
  name: ARTICLE_FEATURE_KEY,
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      // 获取文章详情
      .addCase(getArticle.fulfilled, (state, action) => {
        console.log("getArticle.fulfilled", action);
        state.articleDetail = action.payload;
      })
      // 收藏文章
      .addCase(collectArticle.fulfilled, (state, action) => {
        console.log("collectArticle.fulfilled", action);
        state.articleDetail.is_collected = true;
      })
      // 取消收藏文章
      .addCase(uncollectArticle.fulfilled, (state, action) => {
        console.log("uncollectArticle.rejected", action);
        state.articleDetail.is_collected = false;
      })
      // 点赞文章
      .addCase(likeArticle.fulfilled, (state, action) => {
        console.log("likeArticle.fulfilled", action);
        state.articleDetail.attitude = 1;
      })
      // 取消点赞文章
      .addCase(unlikeArticle.fulfilled, (state, action) => {
        console.log("unlikeArticle.fulfilled", action);
        state.articleDetail.attitude = -1;
      })
      // 关注作者
      .addCase(followAuthor.fulfilled, (state, action) => {
        console.log("followAuthor.fulfilled", action);
        state.articleDetail.is_followed = true;
      })
      // 取消关注作者
      .addCase(unfollowAuthor.fulfilled, (state, action) => {
        console.log("unfollowAuthor.fulfilled", action);
        state.articleDetail.is_followed = false;
      })
      // 获取文章评论
      .addCase(getArticleComments.fulfilled, (state, action) => {
        console.log("getArticleComments.fulfilled", action);
        state.articleComments = action.payload;
      })
      // 获取更多文章评论
      .addCase(getMoreArticleComments.fulfilled, (state, action) => {
        console.log("getMoreArticleComments.fulfilled", action);
        state.articleComments = {
          ...action.payload,
          results: [
            ...state.articleComments.results,
            ...action.payload.results,
          ],
        };
      });
  },
});

export default articleReducer;
