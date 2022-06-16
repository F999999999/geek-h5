import styles from "./index.module.scss";
import { useAppDispatch, useAppSelector } from "@/store";
import { useNavigate } from "react-router-dom";
import {
  getArticleListByChannelId,
  getNewestArticleList,
  HOME_FEATURE_KEY,
} from "@/store/homeSlice";
import { InfiniteScroll, PullToRefresh } from "antd-mobile";
import ArticleItem from "@/components/ArticleItem";

type Props = {
  channelId: number;
};

const ArticleList = ({ channelId }: Props) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // 获取当前频道的文章列表数据
  const { channelArticles } = useAppSelector(
    (state) => state[HOME_FEATURE_KEY]
  );

  // 注意：此处的 频道对应的 文章列表数据，可能是不存在的，所以，此处设置默认值
  const currentChannelArticle = channelArticles[channelId] ?? {
    pre_timestamp: Date.now() + "",
    results: [],
  };

  // pre_timestamp 时间戳
  // results 该频道的文章列表数据
  const { pre_timestamp, results } = currentChannelArticle;

  // 加载更多数据
  const loadMore = async () => {
    await dispatch(
      getArticleListByChannelId({
        channel_id: channelId,
        timestamp: pre_timestamp,
      })
    );
  };

  // 下拉刷新数据
  const onRefresh = async () => {
    await dispatch(
      getNewestArticleList({
        channel_id: channelId,
        timestamp: Date.now() + "",
      })
    );
  };

  // 是否加载更多数据的条件：
  // 如果 pre_timestamp 值为 null 说明没有更多数据了
  // 此时， hasMore 值为 false，那么，InfiniteScroll 组件就不会再次获取数据了
  const hasMore = pre_timestamp !== null;

  return (
    <div className={styles.root}>
      <PullToRefresh onRefresh={onRefresh}>
        {/* 文章列表中的每一项 */}
        {results.map((item, index) => {
          const {
            art_id,
            title,
            aut_name,
            comm_count,
            pubdate,
            cover: { type, images },
          } = item;
          const articleData = {
            title,
            aut_name,
            comm_count,
            pubdate,
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
        })}

        {/*
        因为每个频道都有自己的文章列表，所以，我们直接将 无限滚动组件 加到 ArticleList 组件中

        loadMore 用来加载更多数据的函数，该函数需要返回一个 Promise 对象
        hasMore 表示是否还有更多数据，如果为 true，那么会继续加载数据；否则，不再继续加载数据
      */}
        <InfiniteScroll loadMore={loadMore} hasMore={hasMore} />
      </PullToRefresh>
    </div>
  );
};

export default ArticleList;
