// 文章详情数据类型
export type ArticleDetail = {
  art_id: string;
  title: string;
  pubdate: string;
  aut_id: string;
  aut_name: string;
  aut_photo: string;
  is_followed: boolean;
  attitude: number;
  content: string;
  is_collected: boolean;
  comm_count: number;
  like_count: number;
  read_count: number;
};
// 获取文章详情接口的参数类型
export type GetArticleDetailParams = string;
// 获取文章详情接口的响应类型
export type GetArticleDetailResponse = ArticleDetail;

// 收藏文章接口的参数类型
export type CollectArticleParams = { target: string };
// 收藏文章接口的响应类型
export type CollectArticleResponse = { target: string };

// 取消收藏文章接口的参数类型
export type UncollectArticleParams = { target: string };
// 取消收藏文章接口的响应类型
export type UncollectArticleResponse = null;

// 点赞文章接口的参数类型
export type LikeArticleParams = { target: string };
// 点赞文章接口的响应类型
export type LikeArticleResponse = { target: string };

// 取消点赞文章接口的参数类型
export type UnlikeArticleParams = { target: string };
// 取消点赞文章接口的响应类型
export type UnlikeArticleResponse = null;

// 关注作者接口的参数类型
export type FollowAuthorParams = { target: string };
// 关注作者接口的响应类型
export type FollowAuthorResponse = { target: string };

// 取消关注作者接口的参数类型
export type UnfollowAuthorParams = { target: string };
// 取消关注作者接口的响应类型
export type UnfollowAuthorResponse = null;

// 评论项的类型
export type ArtComment = {
  com_id: string;
  aut_id: string;
  aut_name: string;
  aut_photo: string;
  like_count: number;
  reply_count: number;
  pubdate: string;
  content: string;
  is_liking: boolean;
  is_followed: boolean;
};
// 文章评论的类型
export type ArticleComment = {
  total_count: number;
  end_id: string | null;
  last_id: string | null;
  results: ArtComment[];
};

// 获取文章评论接口的参数类型
export type GetArticleCommentsParams = {
  type: "a" | "c";
  source: string;
  limit?: number;
};
// 获取文章评论接口的响应类型
export type GetArticleCommentsResponse = ArticleComment;

// 获取更多评论接口的参数类型
export type GetMoreArticleCommentsParams = {
  type: "a" | "c";
  source: string;
  offset: string;
  limit?: number;
};
// 获取更多评论接口的响应类型
export type GetMoreArticleCommentsResponse = ArticleComment;
