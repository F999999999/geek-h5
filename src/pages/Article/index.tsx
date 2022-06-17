import styles from "./index.module.scss";

import dayjs from "dayjs";
// 导入本地化格式插件
import localizedFormat from "dayjs/plugin/localizedFormat";
// 导入对 HTML 格式字符串消毒的包
import DOMPurify from "dompurify";
// 导入 lodash 的节流函数
import { throttle } from "lodash";

import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { ARTICLE_FEATURE_KEY, getArticle } from "@/store/articleSlice";
import classNames from "classnames";
import { NavBar } from "antd-mobile";
import Icon from "@/components/Icon";

dayjs.extend(localizedFormat);

const Article = () => {
  const params = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const {
    articleDetail: {
      content,
      is_followed,
      aut_name,
      aut_photo,
      comm_count,
      like_count,
      pubdate,
      read_count,
      title,
    },
  } = useAppSelector((state) => state[ARTICLE_FEATURE_KEY]);

  // 文章可滚动区域的 ref 对象
  const wrapperRef = useRef<HTMLDivElement>(null);
  // 导航栏作者信息的 ref 对象
  const authorRef = useRef<HTMLDivElement>(null);
  // 评论信息的 DOM 对象的 ref
  const commentRef = useRef<HTMLDivElement>(null);
  // 文章是否加载中的状态
  const [loading, setLoading] = useState(true);
  // 导航栏中作者信息是否展示
  const [isShowNavAuthor, setIsShowNavAuthor] = useState(false);

  // 文章数据
  useEffect(() => {
    params.id && dispatch(getArticle(params.id));
    setLoading(false);
  }, [dispatch, params.id]);

  // 导航栏中展示作者信息
  useEffect(() => {
    if (loading) return;

    const wrapperDOM = wrapperRef.current!;

    // 创建一个节流函数
    const handleScroll = throttle(() => {
      const { bottom } = authorRef.current!.getBoundingClientRect();
      // 44 是 NavBar 的高度，因为 NavBar 会挡住页面内容，所以，此处需要减去它的高度
      if (bottom - 44 <= 0) {
        setIsShowNavAuthor(true);
      } else {
        setIsShowNavAuthor(false);
      }
    }, 200);

    wrapperDOM.addEventListener("scroll", handleScroll);
    return () => wrapperDOM.removeEventListener("scroll", handleScroll);
  }, [loading]);

  // 渲染文章详情
  const renderArticle = () => {
    return (
      <div className="wrapper" ref={wrapperRef}>
        {/* 文章详情 */}
        <div className="article-wrapper">
          <div className="header">
            <h1 className="title">{title}</h1>

            <div className="info">
              <span>{pubdate}</span>
              <span>{read_count} 阅读</span>
              <span>{comm_count} 评论</span>
            </div>

            <div className="author" ref={authorRef}>
              <img
                src={
                  aut_photo || "http://geek.itheima.net/images/user_head.jpg"
                }
                alt=""
              />
              <span className="name">{aut_name}</span>
              <span
                className={classNames("follow", is_followed ? "followed" : "")}
              >
                {is_followed ? "已关注" : "关注"}
              </span>
            </div>
          </div>

          <div className="content">
            {/* 文章详情 */}
            <div
              className="content-html dg-html"
              // 使用 DOMPurify 对 HTML 格式字符串内容进行消毒
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(content),
              }}
            />
            <div className="date">发布文章时间：{pubdate}</div>
          </div>
        </div>

        {/* 文章评论 */}
        <div className="comment" ref={commentRef}>
          <div className="comment-header">
            <span>全部评论（{comm_count}）</span>
            <span>{like_count} 点赞</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.root}>
      <div className="root-wrapper">
        {/* 导航栏 */}
        <NavBar
          onBack={() => navigate(-1)}
          right={
            <span>
              <Icon type="icongengduo" />
            </span>
          }
        >
          {isShowNavAuthor && (
            <div className="nav-author">
              <img
                src={
                  aut_photo || "http://geek.itheima.net/images/user_head.jpg"
                }
                alt=""
              />
              <span className="name">{aut_name}</span>
              <span
                className={classNames("follow", is_followed ? "followed" : "")}
              >
                {is_followed ? "已关注" : "关注"}
              </span>
            </div>
          )}
        </NavBar>
        {/* 文章详情 */}
        {renderArticle()}
      </div>
    </div>
  );
};

export default Article;
