import { Tabs } from "antd-mobile";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  getAllChannels,
  getUserChannel,
  HOME_FEATURE_KEY,
} from "@/store/homeSlice";
import { USER_FEATURE_KEY } from "@/store/userSlice";

const Home = () => {
  const dispatch = useAppDispatch();
  const { channels } = useAppSelector((state) => state[HOME_FEATURE_KEY]);
  const {
    token: { token },
  } = useAppSelector((state) => state[USER_FEATURE_KEY]);

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
    <Tabs className="tabs" activeLineMode="fixed">
      {channels.map((item) => (
        <Tabs.Tab forceRender title={item.name} key={item.id}>
          {item.name}
        </Tabs.Tab>
      ))}
    </Tabs>
  );
};

export default Home;
