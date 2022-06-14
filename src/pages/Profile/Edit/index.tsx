import styles from "./index.module.scss";

import {
  Button,
  DatePicker,
  Dialog,
  List,
  NavBar,
  Popup,
  Toast,
} from "antd-mobile";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  clearToken,
  getUserProfile,
  updateUserPhoto,
  updateUserProfile,
  USER_FEATURE_KEY,
} from "@/store/userSlice";
import classNames from "classnames";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import EditInput from "@/pages/Profile/Edit/components/EditInput";
import EditList from "@/pages/Profile/Edit/components/EditList";
import dayjs from "dayjs";

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

  // 创建获取 file 的 ref 对象
  const fileRef = useRef<HTMLInputElement>(null);

  // 提交修改
  const onUpdateProfile = async (
    type: InputPopup["type"] | ListPopup["type"] | "birthday",
    value: string
  ) => {
    // 如果是修改头像则单独处理 触发 file 的 click 事件
    if (type === "photo") return fileRef.current?.click();

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

  // 生日日期选择器的展示或隐藏
  const [showBirthday, setShowBirthday] = useState(false);

  // 更新生日
  const onUpdateBirthday = async (value: Date) => {
    // 提交修改
    await onUpdateProfile("birthday", dayjs(value).format("YYYY-MM-DD"));
    // 关闭日期选择器
    setShowBirthday(false);
  };

  // 修改头像
  const onChangePhoto = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      return Toast.show({
        content: "请选择要上传的头像",
        duration: 1000,
      });
    }
    const formData = new FormData();
    formData.append("photo", e.target.files[0]);
    // 更新头像
    await dispatch(updateUserPhoto(formData));
    // 重新获取个人信息
    dispatch(getUserProfile());
    // 关闭弹层
    onListPopupHide();
    //提示
    Toast.show({
      content: "上传成功",
      duration: 600,
    });
  };

  // 退出登录
  const onLogout = () => {
    Dialog.show({
      title: "温馨提示",
      content: "亲，您确定要退出吗？",
      // 点击 actions 对应按钮时关闭
      closeOnAction: true,
      // 点击遮罩层关闭
      closeOnMaskClick: true,
      // actions 的数据类型是一个数组，并且如果要指定的两个按钮在同一行，需要在使用一个数组来包裹两个对象
      actions: [
        [
          {
            key: "cancel",
            text: "取消",
            style: {
              color: "#999",
            },
          },
          {
            key: "confirm",
            text: "确认",
            onClick: () => {
              // 清空 token
              dispatch(clearToken());
              // 跳转到登录页
              navigate("/login");
            },
          },
        ],
      ],
    });
  };

  return (
    <div className={styles.root}>
      <div className="content">
        {/* 标题 */}
        <NavBar className="nav-bar" onBack={() => navigate(-1)}>
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
              onClick={() => onListPopupShow("photo")}
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
            <List.Item
              arrow
              extra={birthday}
              onClick={() => setShowBirthday(true)}
            >
              生日
            </List.Item>
          </List>

          {/* 创建 input[type=file] 标签用于上传头像 */}
          <input
            ref={fileRef}
            type="file"
            style={{ display: "none" }}
            onChange={onChangePhoto}
          />
          {/* 日期选择器 */}
          <DatePicker
            visible={showBirthday}
            value={new Date(birthday)}
            onCancel={() => setShowBirthday(false)}
            onConfirm={onUpdateBirthday}
            title="选择年月日"
            min={new Date(1900, 0, 1, 0, 0, 0)}
            max={new Date()}
          />

          <div className="logout">
            <Button className="btn" onClick={onLogout}>
              退出登录
            </Button>
          </div>
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
