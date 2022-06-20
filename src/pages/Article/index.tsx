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
import {
  addArticleComment,
  ARTICLE_FEATURE_KEY,
  collectArticle,
  followAuthor,
  getArticle,
  getArticleComments,
  getMoreArticleComments,
  likeArticle,
  likeArticleComment,
  uncollectArticle,
  unfollowAuthor,
  unlikeArticle,
  unlikeArticleComment,
  unlikeComment,
} from "@/store/articleSlice";
import classNames from "classnames";
import { InfiniteScroll, NavBar, Popup, Toast } from "antd-mobile";
import Icon from "@/components/Icon";
import CommentFooter from "@/pages/Article/components/CommentFooter";
import NoneComment from "@/components/NoneComment";
import CommentItem from "@/pages/Article/components/CommentItem";
import CommentInput from "@/pages/Article/components/CommentInput";
import { ArtComment } from "@/types/article";
import Reply from "@/pages/Article/components/Reply";

dayjs.extend(localizedFormat);

// 导航栏高度
const NAV_BAR_HEIGTH = 45;

type CommentReply = {
  visible: boolean;
  commentItem: ArtComment;
};

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
      is_collected,
      attitude,
      art_id,
      aut_id,
    },
    articleComments: { end_id, last_id, results },
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
  // 当前是否展示评论信息的 ref
  const isShowComment = useRef(false);
  // 文章评论弹出层展示或隐藏的状态
  const [showArticleComment, setShowArticleComment] = useState(false);
  // 控制文章评论回复弹出层的展示或隐藏的状态
  const [commentReply, setCommentReply] = useState<CommentReply>({
    visible: false,
    commentItem: {} as ArtComment,
  });

  useEffect(() => {
    if (params.id) {
      // 文章数据
      dispatch(getArticle(params.id));
      // 评论数据
      dispatch(getArticleComments({ type: "a", source: params.id }));
      setLoading(false);
    }
  }, [dispatch, params.id]);

  // 导航栏中展示作者信息
  useEffect(() => {
    // 判断是否正在加载文章数据
    if (loading) return;
    const wrapperDOM = wrapperRef.current!;
    // 创建一个节流函数
    const handleScroll = throttle(() => {
      const { bottom } = authorRef.current!.getBoundingClientRect();
      // 减去 NavBar 的高度
      bottom - NAV_BAR_HEIGTH <= 0
        ? setIsShowNavAuthor(true)
        : setIsShowNavAuthor(false);
    }, 200);

    wrapperDOM.addEventListener("scroll", handleScroll);
    return () => wrapperDOM.removeEventListener("scroll", handleScroll);
  }, [loading]);

  // 点击跳转到评论内容
  const onShowComment = () => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const comment = commentRef.current;
    if (!comment) return;

    const commentTop = comment.getBoundingClientRect().top;
    // 判断是否展示评论信息
    if (!isShowComment.current) {
      // 展示评论信息
      wrapper.scrollTo({
        // wrapper.scrollTop 表示已经滚动的距离
        top: commentTop - NAV_BAR_HEIGTH + wrapper.scrollTop,
        behavior: "smooth",
      });
      isShowComment.current = true;
    } else {
      // 已经展示评论信息 返回页面顶部
      wrapper.scrollTo(0, 0);
      isShowComment.current = false;
    }
  };

  // 收藏或取消收藏文章
  const onCollected = async () => {
    if (is_collected) {
      // 取消收藏
      await dispatch(uncollectArticle({ target: art_id }));
    } else {
      // 收藏
      await dispatch(collectArticle({ target: art_id }));
    }
    Toast.show({
      content: is_collected ? "已取消收藏" : "已收藏",
      duration: 800,
    });
  };

  // 点赞或取消点赞文章
  const onLike = async () => {
    if (attitude === 1) {
      // 取消点赞
      await dispatch(unlikeArticle({ target: art_id }));
    } else {
      // 点赞
      await dispatch(likeArticle({ target: art_id }));
    }
    Toast.show({
      content: attitude === 1 ? "已取消点赞" : "已点赞",
      duration: 800,
    });
  };

  // 关注或取消关注作者
  const onFollowAuthor = async () => {
    if (is_followed) {
      // 取消关注
      await dispatch(unfollowAuthor({ target: aut_id }));
    } else {
      // 关注
      await dispatch(followAuthor({ target: aut_id }));
    }
    Toast.show({
      content: is_followed ? "已取消关注" : "已关注",
      duration: 800,
    });
  };

  // 是否需要加载更多评论
  const hasMore = end_id !== last_id;
  // 加载更多评论
  const loadMoreComments = async () => {
    if (!params.id || !last_id) return;
    await dispatch(
      getMoreArticleComments({ type: "a", source: params.id, offset: last_id })
    );
  };

  // 隐藏文章评论弹出层
  const onArticleCommentHide = () => setShowArticleComment(false);

  // 发表评论
  const onAddComment = async (value: string) => {
    await dispatch(addArticleComment({ target: art_id, content: value }));
    // 隐藏评论框
    onArticleCommentHide();
  };

  // 对评论点赞
  const onThumbUp = (com_id: string, is_liking: boolean) => {
    if (is_liking) {
      // 取消点赞
      dispatch(unlikeArticleComment({ target: com_id })).then(() =>
        dispatch(unlikeComment(com_id))
      );
    } else {
      // 点赞
      dispatch(likeArticleComment({ target: com_id }));
    }
  };

  // 打开评论回复弹出层
  const onCommentReplyShow = (commentItem: ArtComment) => {
    setCommentReply({
      visible: true,
      commentItem,
    });
  };

  // 关闭评论回复弹出层
  const onCommentReplyHide = () =>
    setCommentReply({
      ...commentReply,
      visible: false,
    });

  // 渲染评论回复的弹出层
  const renderCommentReply = () => {
    return (
      <Popup
        className="reply-popup"
        position="right"
        visible={commentReply.visible}
      >
        <div className="comment-popup-wrapper">
          <Reply
            onClose={onCommentReplyHide}
            commentItem={commentReply.commentItem}
            onReplyThumbUp={onThumbUp}
            articleId={params.id ?? ""}
          />
        </div>
      </Popup>
    );
  };

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
                onClick={onFollowAuthor}
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

          {/* 评论列表 */}
          {results.length === 0 ? (
            <NoneComment />
          ) : (
            <div className="comment-list">
              {results.map((item) => (
                <CommentItem
                  {...item}
                  key={item.com_id}
                  onThumbUp={() => onThumbUp(item.com_id, item.is_liking)}
                  onReplyShow={() => onCommentReplyShow(item)}
                />
              ))}

              <InfiniteScroll hasMore={hasMore} loadMore={loadMoreComments} />
            </div>
          )}
        </div>
      </div>
    );
  };

  // 渲染文章的评论弹出层
  const renderArticleComment = () => {
    return (
      <Popup
        bodyStyle={{
          height: "100%",
        }}
        position="bottom"
        visible={showArticleComment}
        destroyOnClose
      >
        <CommentInput
          onClose={onArticleCommentHide}
          onAddComment={onAddComment}
        />
      </Popup>
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
                onClick={onFollowAuthor}
              >
                {is_followed ? "已关注" : "关注"}
              </span>
            </div>
          )}
        </NavBar>
        {/* 文章详情和评论 */}
        {renderArticle()}
        {/* 底部评论栏 */}
        <CommentFooter
          placeholder={comm_count === 0 ? "抢沙发" : "去评论"}
          comm_count={comm_count}
          onShowComment={onShowComment}
          is_collected={is_collected}
          onCollected={onCollected}
          attitude={attitude}
          onLike={onLike}
          onShowArticleComment={() => setShowArticleComment(true)}
        />
      </div>

      {/* 文章评论弹出层 */}
      {renderArticleComment()}

      {/* 评论回复弹出层 */}
      {renderCommentReply()}
    </div>
  );
};

export default Article;
