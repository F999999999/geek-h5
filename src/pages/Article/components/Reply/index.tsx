import { NavBar, Popup } from "antd-mobile";

import CommentItem from "../CommentItem";
import CommentFooter from "../CommentFooter";
import CommentInput from "../CommentInput";
import NoneComment from "@/components/NoneComment";

import styles from "./index.module.scss";
import {
  AddArticleCommentParams,
  AddArticleCommentResponse,
  ArtComment,
  ArticleComment,
  GetArticleCommentsParams,
  GetArticleCommentsResponse,
} from "@/types/article";
import { useEffect, useState } from "react";
import { http } from "@/utils/http";

type Props = {
  onClose: (commentId: string, total: number) => void;
  // 评论项类型
  commentItem: ArtComment;
  // 通知父组件修改评论数据的回调函数
  onReplyThumbUp: (com_id: string, is_liking: boolean) => void;
  // 文章id
  articleId: string;
};

const Reply = ({ onClose, commentItem, onReplyThumbUp, articleId }: Props) => {
  // 根据父组件中传递过来的 props ，创建一个状态，让其变为当前组件自己状态
  const [comment, setComment] = useState(commentItem);
  // 控制回复文本框弹出层的展示和隐藏
  const [showPopup, setShowPopup] = useState(false);
  // 评论的回复列表数据
  const [reply, setReply] = useState<ArticleComment>({
    // 注意：为了防止第一次进入时，访问 reply.results.length 不报错，需要在此处给它设置默认值为：[]
    results: [] as ArtComment[],
    last_id: null,
    end_id: null,
    total_count: 0,
  });

  useEffect(() => {
    const loadData = async () => {
      const res = await http.get<
        GetArticleCommentsParams,
        GetArticleCommentsResponse
      >("/comments", {
        params: {
          type: "c",
          source: comment.com_id,
        },
      });
      setReply(res);
    };
    loadData();
  }, [comment.com_id]);

  // 对评论进行点赞
  const onThumbUp = async () => {
    setComment({
      ...comment,
      is_liking: !comment.is_liking,
      like_count: comment.is_liking
        ? comment.like_count - 1
        : comment.like_count + 1,
    });
    // 将修改后的评论数据，传递给父组件，然后，由父组件来修改该数据
    onReplyThumbUp(comment.com_id, comment.is_liking);
  };

  // 对评论的评论进行点赞
  const onReplyCommentsThumbUp = async (
    com_id: string,
    is_liking: boolean,
    like_count: number
  ) => {
    if (is_liking) {
      setReply({
        ...reply,
        results: reply.results.map((item) =>
          item.com_id === com_id
            ? { ...item, is_liking: false, like_count: like_count - 1 }
            : item
        ),
      });
    } else {
      setReply({
        ...reply,
        results: reply.results.map((item) =>
          item.com_id === com_id
            ? { ...item, is_liking: true, like_count: like_count + 1 }
            : item
        ),
      });
    }
    // 将修改后的评论数据，传递给父组件，然后，由父组件来修改该数据
    onReplyThumbUp(com_id, is_liking);
  };

  const onReplyPopupHide = () => setShowPopup(false);

  // 对评论进行回复
  const onAddComment = async (value: string) => {
    const res = await http.post<
      AddArticleCommentParams,
      AddArticleCommentResponse
    >("/comments", {
      target: comment.com_id,
      content: value,
      art_id: articleId,
    });

    // 将最新发表的评论数据，添加到回复列表中即可
    setReply({
      ...reply,
      // 发表评论后，让评论数量加1
      total_count: reply.total_count + 1,
      results: [res.new_obj, ...reply.results],
    });

    onReplyPopupHide();
  };

  // 关闭对回复弹出层，将当前评论的总数量传递给父组件
  const onBackToArticle = () => {
    onClose(comment.com_id, reply.total_count);
  };

  return (
    <div className={styles.root}>
      <div className="reply-wrapper">
        <NavBar className="transparent-navbar" onBack={onBackToArticle}>
          {reply.results.length} 条回复
        </NavBar>

        {/* 要回复的评论 */}
        <div className="origin-comment">
          <CommentItem type="origin" {...comment} onThumbUp={onThumbUp} />
        </div>

        <div className="reply-list">
          <div className="reply-header">全部回复</div>
          {reply.results.length > 0 ? (
            reply.results.map((item) => (
              <CommentItem
                key={item.com_id}
                type="reply"
                onThumbUp={() =>
                  onReplyCommentsThumbUp(
                    item.com_id,
                    item.is_liking,
                    item.like_count
                  )
                }
                {...item}
              />
            ))
          ) : (
            <NoneComment />
          )}
        </div>

        <CommentFooter
          placeholder="去评论"
          type="reply"
          onShowArticleComment={() => setShowPopup(true)}
        />
      </div>

      {/* 回复文本框对应的抽屉 */}

      <Popup className="reply-popup" position="bottom" visible={showPopup}>
        <CommentInput
          name={comment.aut_name}
          onAddComment={onAddComment}
          onClose={onReplyPopupHide}
        />
      </Popup>
    </div>
  );
};

export default Reply;
