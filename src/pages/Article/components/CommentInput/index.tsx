import styles from "./index.module.scss";
import { useEffect, useRef, useState } from "react";
import { NavBar, TextArea } from "antd-mobile";
import { TextAreaRef } from "antd-mobile/es/components/text-area";

type Props = {
  // 在进行评论回复时需要传入
  name?: string;
  onClose?: () => void;
  // 发表评论
  onAddComment: (value: string) => void;
};

const CommentInput = ({ name, onClose, onAddComment }: Props) => {
  const [value, setValue] = useState("");
  const textAreaRef = useRef<TextAreaRef>(null);

  useEffect(() => {
    textAreaRef.current?.focus();
  }, []);

  const onChange = (value: string) => {
    setValue(value);
  };

  const onAdd = () => {
    onAddComment(value);
    setValue("");
  };

  return (
    <div className={styles.root}>
      <NavBar
        onBack={onClose}
        right={
          <span className="publish" onClick={onAdd}>
            发表
          </span>
        }
      >
        {name ? "回复评论" : "评论文章"}
      </NavBar>

      <div className="input-area">
        {name && <div className="at">@{name}:</div>}
        <TextArea
          ref={textAreaRef}
          placeholder="说点什么~"
          rows={10}
          value={value}
          onChange={onChange}
        />
      </div>
    </div>
  );
};

export default CommentInput;
