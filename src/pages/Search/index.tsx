import styles from "./index.module.scss";
import { NavBar, SearchBar } from "antd-mobile";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  clearSuggestion,
  getSuggestion,
  SEARCH_FEATURE_KEY,
  SEARCH_HISTORY_KEY,
} from "@/store/searchSlice";
import Icon from "@/components/Icon";
// 导入 ahooks 中提供的 防抖函数hook
import { useDebounceFn } from "ahooks";
import classNames from "classnames";

const SearchPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { suggestion } = useAppSelector((state) => state[SEARCH_FEATURE_KEY]);

  // 搜索框的内容
  const [searchText, setSearchText] = useState("");
  // 搜索历史
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  useEffect(() => {
    const localHistory = JSON.parse(
      localStorage.getItem(SEARCH_HISTORY_KEY) ?? "[]"
    ) as string[];
    setSearchHistory(localHistory);
  }, []);

  // 防抖
  const { run: debounceFn } = useDebounceFn(
    (value) => {
      dispatch(getSuggestion(value));
    },
    {
      wait: 500,
    }
  );

  // 搜索内容发生更改
  const onSearchChange = (value: string) => {
    setSearchText(value);
    if (value.trim() === "") {
      return dispatch(clearSuggestion());
    }
    // 调用防抖函数
    debounceFn(value);
  };

  // 跳转到搜索结果页面
  const onSearch = (searchValue: string) => {
    // 清除搜索联想关键词
    dispatch(clearSuggestion());
    // 将搜索内容存储到历史记录中
    saveHistories(searchValue);
    // 跳转到搜索结果页面
    navigate(`/search/result?query=${searchValue}`);
  };

  // 存储搜索历史
  const saveHistories = (searchValue: string) => {
    // 从本地缓存中获取到历史记录
    let localHistory = JSON.parse(
      localStorage.getItem(SEARCH_HISTORY_KEY) ?? "[]"
    ) as string[];
    // 判断本地缓存中是否有历史记录数据
    if (localHistory.length === 0) {
      // 如果没有 直接添加当前搜索内容到历史记录中
      localHistory = [searchValue];
    } else {
      // 如果有 判断是否包含当前搜索内容
      if (localHistory.indexOf(searchValue) > -1) {
        // 包含 将其移动到第一个
        localHistory = [
          searchValue,
          ...localHistory.filter((item) => item !== searchValue),
        ];
      } else {
        // 没有包含 直接添加到历史记录中
        localHistory = [searchValue, ...localHistory];
      }
    }
    // 将最新的历史记录存储到 localStorage 中
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(localHistory));
    // 更新搜索历史
    setSearchHistory(localHistory);
  };

  // 删除单个历史记录
  const onDeleteHistory = (value: string) => {
    // 获取本地历史记录
    const localHistory = JSON.parse(
      localStorage.getItem(SEARCH_HISTORY_KEY) ?? "[]"
    ) as string[];
    // 删除指定的历史记录
    const newHistory = localHistory.filter((item) => item !== value);
    // 存储到本地
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(newHistory));
    // 更新历史记录
    setSearchHistory(newHistory);
  };

  // 清空所有历史记录
  const onClearAllHistory = () => {
    // 清空本地历史记录
    localStorage.removeItem(SEARCH_HISTORY_KEY);
    // 清空历史记录
    setSearchHistory([]);
  };

  // 联想词分割
  const highlightSuggestion = suggestion.map((item) => {
    // 将搜索内容以及返回的联想关键词结果，全部转化为小写再比较，屏蔽大小写的差异
    const lowerSearchText = searchText.toLowerCase();
    const lowerSuggestionItem = item.toLowerCase();

    // 先找到与关键词匹配的内容，所在的位置
    const searchIndex = lowerSuggestionItem.indexOf(lowerSearchText);

    // 根据关键词的位置，将搜索结果分为 左、中、右 三部分
    // 左：0 -> searchIndex
    // 中：searchIndex -> searchIndex + lowerSearchText.length
    // 右：searchIndex + lowerSearchText.length -> 最后
    const left = item.slice(0, searchIndex);
    const search = item.slice(
      searchIndex,
      searchIndex + lowerSearchText.length
    );
    const right = item.slice(searchIndex + lowerSearchText.length);

    return {
      left,
      search,
      right,
      // 原始数据，也就是搜索联想出来的关键词内容
      raw: item,
    };
  });

  return (
    <div className={styles.root}>
      <NavBar
        className="navbar"
        onBack={() => navigate(-1)}
        right={
          <span className="search-text" onClick={() => onSearch(searchText)}>
            搜索
          </span>
        }
      >
        <SearchBar
          value={searchText}
          placeholder="请输入关键字搜索"
          onChange={onSearchChange}
        />
      </NavBar>

      {/* 历史记录 */}
      {/* 历史记录 和 搜索联想关键词列表 是二选一，所以，此处判断是否有 联想关键词列表 如果没有就展示历史记录 */}
      {
        <div
          className="history"
          style={{
            display:
              searchHistory.length <= 0 || highlightSuggestion.length > 0
                ? "none"
                : "block",
          }}
        >
          <div className="history-header">
            <span>搜索历史</span>
            <span onClick={onClearAllHistory}>
              <Icon type="iconbtn_del" />
              清除全部
            </span>
          </div>

          <div className="history-list">
            {searchHistory.map((item, index) => (
              <span
                key={index}
                className="history-item"
                onClick={() => onDeleteHistory(item)}
              >
                <span className="text-overflow">{item}</span>
                <Icon type="iconbtn_essay_close" />
              </span>
            ))}
          </div>
        </div>
      }

      {/* 搜索联想数据 */}
      <div
        className={classNames("search-result", {
          show: suggestion.length > 0,
        })}
      >
        {highlightSuggestion.map((item, index) => (
          <div
            key={index}
            className="result-item"
            onClick={() => onSearch(item.raw)}
          >
            <Icon className="icon-search" type="iconbtn_search" />
            <div className="result-value text-overflow">
              {/* span 包裹的内容会有高亮效果 */}
              {item.left}
              <span>{item.search}</span>
              {item.right}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchPage;
