// 获取联想词接口的参数类型
export type getSuggestionParams = string;
// 获取联想词接口的响应类型
export type getSuggestionResponse = { options: string[] };

// 搜索结果
export type SearchResult = {
  page: number;
  per_page: number;
  total_count: number;
  results: {
    art_id: string;
    aut_id: string;
    aut_name: string;
    collect_count: number;
    comm_count: number;
    cover: { type: 0 | 1 | 3; images?: string[] };
    like_count: number;
    pubdate: string;
    title: string;
  }[];
};

// 获取搜索结果接口的参数类型
export type getSearchResultParams = {
  q: string;
  page?: number;
  per_page?: number;
};
// 获取搜索结果接口的响应类型
export type getSearchResultResponse = SearchResult;
