import styles from "./index.module.scss";

import classNames from "classnames";
import { useEffect, useState } from "react";
import Icon from "@/components/Icon";
import { useAppDispatch, useAppSelector } from "@/store";
import { HOME_FEATURE_KEY, toggleChannel } from "@/store/homeSlice";
import { http } from "@/utils";
import { Channel, GetChannelResponse } from "@/types/hoes";
import differenceBy from "lodash/differenceBy";

type Props = {
  onClose: () => void;
};

const Channels = ({ onClose }: Props) => {
  const dispatch = useAppDispatch();
  const { channels, channelActiveKey } = useAppSelector(
    (state) => state[HOME_FEATURE_KEY]
  );
  // 推荐频道（可选频道）
  const [restChannels, setRestChannels] = useState<Channel[]>([]);
  useEffect(() => {
    http.get<any, GetChannelResponse>("/channels").then((res) => {
      setRestChannels(differenceBy(res.channels, channels, "id"));
    });
  }, [channels]);

  // 是否为编辑状态
  const [isEdit, setIsEdit] = useState(false);
  // 切换编辑状态
  const changeEdit = () => {
    setIsEdit(!isEdit);
  };
  // 切换频道
  const onChannelSwitch = (channel: Channel) => {
    // 判断是否处于编辑状态
    if (isEdit) {
      // 处于编辑状态 删除频道
    } else {
      // 不处于编辑状态 切换频道
      dispatch(toggleChannel(channel.id));
      // 关闭弹层
      onClose();
    }
  };

  return (
    <div className={styles.root}>
      <div className="channel-header">
        <Icon type="iconbtn_channel_close" onClick={onClose} />
      </div>
      <div className="channel-content">
        {/* 编辑时，添加类名 edit */}
        <div className={classNames("channel-item", isEdit && "edit")}>
          <div className="channel-item-header">
            <span className="channel-item-title">我的频道</span>
            <span className="channel-item-title-extra">点击进入频道</span>
            <span className="channel-item-edit" onClick={changeEdit}>
              {isEdit ? "保存" : "编辑"}
            </span>
          </div>
          <div className="channel-list">
            {/* 选中时，添加类名 selected */}
            {channels.map((item) => (
              <span
                key={item.id}
                className={classNames(
                  "channel-list-item",
                  channelActiveKey === item.id && "selected"
                )}
                onClick={() => onChannelSwitch(item)}
              >
                {item.name}
                {/* 排除 推荐 以及 当前选中项的 删除的图标 */}
                {item.id !== 0 && item.id !== channelActiveKey && (
                  <Icon type="iconbtn_tag_close" />
                )}
              </span>
            ))}
          </div>
        </div>

        <div className="channel-item">
          <div className="channel-item-header">
            <span className="channel-item-title">可选频道</span>
            <span className="channel-item-title-extra">点击添加频道</span>
          </div>
          <div className="channel-list">
            {restChannels.map((item) => (
              <span className="channel-list-item" key={item.id}>
                + {item.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Channels;
