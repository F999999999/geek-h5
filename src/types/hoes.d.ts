// 频道数据类型
export type Channel = { id: number; name: string };
// 获取频道接口的响应类型
export type GetChannelResponse = { channels: Channel[] };
