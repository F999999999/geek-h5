import styles from "./index.module.scss";
import { useParams } from "react-router-dom";

import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { ARTICLE_FEATURE_KEY, getArticle } from "@/store/articleSlice";
import classNames from "classnames";

import dayjs from "dayjs";
// 导入本地化格式插件
import localizedFormat from "dayjs/plugin/localizedFormat";
// 导入对 HTML 格式字符串消毒的包
import DOMPurify from "dompurify";

dayjs.extend(localizedFormat);

const Article = () => {
  const params = useParams();
  const dispatch = useAppDispatch();
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

  useEffect(() => {
    params.id && dispatch(getArticle(params.id));
  }, [dispatch, params.id]);

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

  return <div className={styles.root}>{renderArticle()}</div>;
};

export default Article;
