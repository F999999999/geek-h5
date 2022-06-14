import styles from "./index.module.scss";

import { List, NavBar, Popup, Toast } from "antd-mobile";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  getUserProfile,
  updateUserProfile,
  USER_FEATURE_KEY,
} from "@/store/userSlice";
import classNames from "classnames";
import { useEffect, useState } from "react";
import EditInput from "@/pages/Profile/Edit/components/EditInput";
import EditList from "@/pages/Profile/Edit/components/EditList";

type InputPopup = {
  type: "" | "name" | "intro";
  value: string;
  visible: boolean;
};
type ListPopup = {
  type: "" | "gender" | "photo";
  visible: boolean;
};

const ProfileEdit = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { photo, name, intro, gender, birthday } = useAppSelector(
    (state) => state[USER_FEATURE_KEY].profile
  );

  // 获取个人信息
  useEffect(() => {
    dispatch(getUserProfile());
  }, [dispatch]);

  // 控制修改昵称或简介弹出层
  const [inputPopup, setInputPopup] = useState<InputPopup>({
    // 编辑昵称或简介，如果是昵称，值为：'name'；如果是简介，值为：'intro'
    type: "",
    // 昵称或简介的值
    value: "",
    // 弹出层展示或隐藏
    visible: false,
  });

  // 打开修改 昵称 或 简介 的弹出层
  const onInputShow = (type: InputPopup["type"], value: InputPopup["value"]) =>
    setInputPopup({
      type,
      value,
      visible: true,
    });

  // 关闭修改 昵称 或 简介 的弹出层
  const onInputHide = () =>
    setInputPopup({
      type: "",
      value: "",
      visible: false,
    });

  // 控制功能列表选择弹出层
  const [listPopup, setListPopup] = useState<ListPopup>({
    type: "",
    visible: false,
  });

  // 打开功能列表选择弹出层
  const onListPopupShow = (type: ListPopup["type"]) => {
    setListPopup({
      type,
      visible: true,
    });
  };

  // 关闭功能列表选择弹出层
  const onListPopupHide = () => {
    setListPopup({ type: "", visible: false });
  };

  // 提交修改
  const onUpdateProfile = async (
    type: InputPopup["type"] | ListPopup["type"],
    value: string
  ) => {
    // 提交修改
    const result = await dispatch(updateUserProfile({ [type]: value }));

    if (result) {
      // 提示
      Toast.show({
        content: "更新成功",
        duration: 1000,
      });
      // 重新获取个人信息
      dispatch(getUserProfile());
    }
    // 关闭弹层
    onInputHide();
    onListPopupHide();
  };

  return (
    <div className={styles.root}>
      <div className="content">
        {/* 标题 */}
        <NavBar
          className="nav-bar"
          onBack={() => navigate(-1)}
          // style={{
          //   '--border-bottom': '1px solid #F0F0F0'
          // }}
        >
          个人信息
        </NavBar>

        <div className="wrapper">
          {/* 列表 */}
          <List className="profile-list">
            {/* 列表项 */}
            <List.Item
              // extra 表示右侧的额外信息
              extra={
                <span className="avatar-wrapper">
                  <img
                    width={24}
                    height={24}
                    src={
                      photo || "http://toutiao.itheima.net/images/user_head.jpg"
                    }
                    alt=""
                  />
                </span>
              }
              arrow
            >
              头像
            </List.Item>
            <List.Item
              arrow
              extra={name}
              onClick={() => onInputShow("name", name)}
            >
              昵称
            </List.Item>
            <List.Item
              arrow
              extra={
                <span className={classNames("intro", "normal")}>
                  {intro || "未填写"}
                </span>
              }
              onClick={() => onInputShow("intro", intro)}
            >
              简介
            </List.Item>
          </List>

          <List className="profile-list">
            <List.Item
              arrow
              extra={gender ? "女" : "男"}
              onClick={() => onListPopupShow("gender")}
            >
              性别
            </List.Item>
          </List>
        </div>
      </div>

      {/* 修改昵称或简介弹层 */}
      <Popup visible={inputPopup.visible} position="right">
        <EditInput
          onClose={onInputHide}
          onUpdateProfile={onUpdateProfile}
          type={inputPopup.type}
          value={inputPopup.value}
        />
      </Popup>

      {/* 修改头像或性别弹层 */}
      <Popup visible={listPopup.visible} onMaskClick={onListPopupHide}>
        <EditList
          onClose={onListPopupHide}
          type={listPopup.type}
          onUpdateProfile={onUpdateProfile}
        />
      </Popup>
    </div>
  );
};

export default ProfileEdit;
