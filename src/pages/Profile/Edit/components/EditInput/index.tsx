import {Input, NavBar, TextArea} from "antd-mobile";
import {useEffect, useState} from "react";

import styles from "./index.module.scss";

// 为 EditInput 组件指定 props 类型
type Props = {
  onClose: () => void;
  value: string;
  type: "" | "name" | "intro";
  onUpdateProfile: (type: "name" | "intro", value: string) => void;
};

const EditInput = ({ onClose, value, onUpdateProfile, type }: Props) => {
  // 因为我们需要手动修改文本框的值，所以，还是通过 受控组件 的方式来修改
  // 因此，此处需要创建一个状态，来控制文本框的值
  // 所以，就把父组件中传递过来的默认的名称 value 作为了当前状态的默认值
  // 这样操作后，进入该页面，文本框的值就是父组件中传递过来的 value 值了
  const [inputValue, setInputValue] = useState(value);

  // 解决昵称和简介切换后 文本框的值不变的问题
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // 创建变量，用来表示是否为修改昵称
  const isEditName = type === "name";

  // 提交修改
  const onSave = () => {
    if (type !== "") onUpdateProfile(type, inputValue);
  };

  return (
    <div className={styles.root}>
      <NavBar
        className="navbar"
        right={
          <span className="commit-btn" onClick={onSave}>
            提交
          </span>
        }
        onBack={onClose}
      >
        编辑{isEditName ? "昵称" : "简介"}
      </NavBar>

      <div className="edit-input-content">
        <h3>{isEditName ? "昵称" : "简介"}</h3>

        {isEditName ? (
          <div className="input-wrap">
            <Input
              value={inputValue}
              onChange={(value) => setInputValue(value)}
              placeholder="请输入"
            />
          </div>
        ) : (
          <TextArea
            className="textarea"
            placeholder="请输入内容"
            value={inputValue || ""}
            onChange={(value) => setInputValue(value)}
            rows={4}
            maxLength={100}
            showCount
          />
        )}
      </div>
    </div>
  );
};

export default EditInput;
