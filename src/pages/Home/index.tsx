import styles from "./index.module.scss";
import { Popup, Tabs } from "antd-mobile";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  getAllChannels,
  getUserChannel,
  HOME_FEATURE_KEY,
  toggleChannel,
} from "@/store/homeSlice";
import { USER_FEATURE_KEY } from "@/store/userSlice";
import Icon from "@/components/Icon";
import { useNavigate } from "react-router-dom";
import Channels from "@/pages/Home/components/Channels";
import ArticleList from "@/pages/Home/components/ArticleList";

const Home = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { channels, channelActiveKey } = useAppSelector(
    (state) => state[HOME_FEATURE_KEY]
  );
  const {
    token: { token },
  } = useAppSelector((state) => state[USER_FEATURE_KEY]);

  // 频道管理弹出层是否显示
  const [channelVisible, setChannelVisible] = useState(false);
  // 显示频道管理弹出层
  const onChannelShow = () => setChannelVisible(true);
  // 隐藏频道管理弹出层
  const onChannelHide = () => setChannelVisible(false);
  // 切换频道
  const onChannelSwitch = (key: string) => {
    dispatch(toggleChannel(Number(key)));
  };

  useEffect(() => {
    // 判断是否登录
    if (token) {
      // 获取用户频道
      dispatch(getUserChannel());
    } else {
      // 获取所有频道
      dispatch(getAllChannels());
    }
  }, [dispatch, token]);

  return (
    <div className={styles.root}>
      <Tabs
        className="tabs"
        activeLineMode="fixed"
        activeKey={channelActiveKey + ""}
        onChange={onChannelSwitch}
      >
        {channels.map((item) => (
          <Tabs.Tab forceRender title={item.name} key={item.id}>
            <ArticleList channelId={item.id} />
          </Tabs.Tab>
        ))}
      </Tabs>

      <div className="tabs-opration">
        <Icon type="iconbtn_search" onClick={() => navigate("/search")} />
        <Icon type="iconbtn_channel" onClick={onChannelShow} />
      </div>

      {/* 频道管理弹出层 */}
      <Popup
        visible={channelVisible}
        onMaskClick={onChannelHide}
        position="left"
        className="channel-popup"
      >
        <Channels onClose={onChannelHide} />
      </Popup>
    </div>
  );
};

export default Home;
