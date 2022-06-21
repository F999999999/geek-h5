import { Input, NavBar } from "antd-mobile";
import classnames from "classnames";
import { useNavigate } from "react-router-dom";
import Icon from "@/components/Icon";
import styles from "./index.module.scss";
import { KeyboardEvent, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { USER_FEATURE_KEY } from "@/store/userSlice";
import { useAppSelector } from "@/store";

type ChatType = {
  type: "xz" | "user";
  message: string;
};

const Chat = () => {
  const navigate = useNavigate();
  const { token } = useAppSelector((state) => state[USER_FEATURE_KEY]);
  const [chatList, setChatList] = useState<ChatType[]>([]);
  // 文本框的值
  const [value, setValue] = useState("");
  // 创建 ref 对象，来存储 socketio 实例，实现多个方法中共享该变量
  const socketioRef = useRef<Socket>();
  // 创建聊天列表的 ref 对象
  const chatListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const socketio = io("http://toutiao.itheima.net", {
      query: {
        token,
      },
      transports: ["websocket"],
    });

    // socketio 连接成功时 执行此处的回调函数
    socketio.on("connect", () => {
      // console.log('socketio 链接成功')
      setChatList([
        {
          type: "xz",
          message: "你好，我是小智",
        },
        {
          type: "xz",
          message: "你有什么疑问？",
        },
      ]);
    });

    // 接收 websocket 服务器返回的消息
    socketio.on("message", (data) => {
      setChatList((chatList) => [
        ...chatList,
        {
          type: "xz",
          message: data.msg,
        },
      ]);
    });

    // 将 socketio 对象存储到 ref 中
    socketioRef.current = socketio;

    return () => {
      // 在组件卸载时，关闭 socket 链接
      socketio.close();
    };
  }, [token]);

  // 监听聊天内容的改变，只要聊天内容改变了，就滚动列表列表到最底部
  useEffect(() => {
    const chatListDOM = chatListRef.current;
    if (!chatListDOM) return;

    chatListDOM.scrollTop = chatListDOM.scrollHeight;
  }, [chatList]);

  // 发送消息
  const onSendMessage = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.code === "Enter") {
      setChatList([
        ...chatList,
        {
          type: "user",
          message: value,
        },
      ]);
      setValue("");

      // 将消息发送给 websocket 服务器
      socketioRef.current?.emit("message", {
        msg: value,
        timestamp: Date.now() + "",
      });
    }
  };

  return (
    <div className={styles.root}>
      <NavBar className="fixed-header" onBack={() => navigate(-1)}>
        小智同学
      </NavBar>

      <div className="chat-list" ref={chatListRef}>
        {chatList.map((item, index) => (
          <div
            key={index}
            className={classnames(
              "chat-item",
              item.type === "xz" ? "self" : "user"
            )}
          >
            {item.type === "xz" ? (
              <Icon type="iconbtn_xiaozhitongxue" />
            ) : (
              <img src="http://geek.itheima.net/images/user_head.jpg" alt="" />
            )}
            <div className="message">{item.message}</div>
          </div>
        ))}
      </div>

      <div className="input-footer">
        <Input
          className="no-border"
          placeholder="请描述您的问题"
          value={value}
          onChange={(val) => setValue(val)}
          onKeyDown={onSendMessage}
        />
        <Icon type="iconbianji" />
      </div>
    </div>
  );
};

export default Chat;
