// 频道数据类型
export type Channel = { id: number; name: string };
// 获取频道接口的响应类型
export type GetChannelResponse = { channels: Channel[] };

// 删除频道接口的参数类型
export type DelChannelParams = Channel["id"];
// 删除频道接口的响应类型
export type DelChannelResponse = null;

// 添加频道接口的参数类型
export type AddUserChannelParams = { id: number; seq: number }[];
// 添加频道接口的响应类型
export type AddUserChannelResponse = null;

// 文章列表类型
export type Articles = {
  pre_timestamp: string;
  results: {
    art_id: string;
    aut_id: string;
    aut_name: string;
    comm_count: number;
    cover: {
      type: 0 | 1 | 3;
      images: string[];
    };
    pubdate: string;
    title: string;
  }[];
};

// 获取文章列表接口的参数类型
export type GetArticleListParams = {
  channel_id: Channel["id"];
  timestamp: string;
};
// 获取文章列表接口的响应类型
export type GetArticleListResponse = Articles;
