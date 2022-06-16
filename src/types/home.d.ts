// 频道数据类型
export type Channel = { id: number; name: string };
// 获取频道接口的响应类型
export type GetChannelResponse = { channels: Channel[] };

// 删除频道接口的参数类型
export type DelChannelParams = Channel["id"];
// 删除频道接口的响应类型
export type DelChannelResponse = null;

// 添加频道接口的参数类型
export type AddUserChannelParams = { id: number; seq: number }[];
// 添加频道接口的响应类型
export type AddUserChannelResponse = null;
