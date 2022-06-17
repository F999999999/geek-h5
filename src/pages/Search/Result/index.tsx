import styles from "./index.module.scss";

import { NavBar } from "antd-mobile";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { getSearchResult, SEARCH_FEATURE_KEY } from "@/store/searchSlice";
import ArticleItem from "@/components/ArticleItem";

const Result = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const location = useLocation();
  // 获取查询参数
  const params = new URLSearchParams(location.search);
  // 获取查询内容
  const query = params.get("query");

  // 搜索结果
  const { searchReducer } = useAppSelector(
    (state) => state[SEARCH_FEATURE_KEY]
  );

  useEffect(() => {
    // 获取搜索结果
    if (query) dispatch(getSearchResult({ q: query }));
  }, [dispatch, query]);

  // 渲染搜索结果
  const renderArticleList = () => {
    return searchReducer.results.map((item, index) => {
      const {
        title,
        pubdate,
        comm_count,
        aut_name,
        art_id,
        cover: { type, images },
      } = item;

      const articleData = {
        title,
        pubdate,
        comm_count,
        aut_name,
        type,
        images,
      };

      return (
        <div
          key={index}
          className="article-item"
          onClick={() => navigate(`/articles/${art_id}`)}
        >
          <ArticleItem {...articleData} />
        </div>
      );
    });
  };

  // 如果需要实现分页效果，可以通过以下方式来判断是否有更多数据
  // const hasMore = page * per_page < total_count
  // 然后，loadMore 时，每次，都让 page + 1 来获取下一页数据

  return (
    <div className={styles.root}>
      <NavBar onBack={() => navigate(-1)}>搜索结果</NavBar>
      <div className="article-list">{renderArticleList()}</div>
    </div>
  );
};

export default Result;
