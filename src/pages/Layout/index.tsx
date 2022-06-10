import styles from "./index.module.scss";
import { TabBar } from "antd-mobile";
import Icon from "@/components/Icon";
import { Outlet, useNavigate } from "react-router-dom";

const Layout = () => {
  const navigate = useNavigate();
  // 底部导航栏数据
  const tabs = [
    { path: "/home/index", icon: "iconbtn_home", text: "首页" },
    { path: "/home/question", icon: "iconbtn_qa", text: "问答" },
    { path: "/home/video", icon: "iconbtn_video", text: "视频" },
    { path: "/home/profile", icon: "iconbtn_mine", text: "我的" },
  ];
  return (
    <div className={styles.root}>
      {/* 内容 */}
      <Outlet />
      {/* 底部TabBar */}
      <TabBar className="tab-bar">
        {tabs.map((item) => (
          <TabBar.Item
            key={item.path}
            icon={(active) => (
              <Icon
                type={active ? `${item.icon}_sel` : item.icon}
                className="tab-bar-item-icon"
                onClick={() => navigate(item.path)}
              />
            )}
            title={item.text}
          />
        ))}
      </TabBar>
    </div>
  );
};

export default Layout;
