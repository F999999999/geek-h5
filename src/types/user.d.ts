// 登录接口返回数据类型
export type Token = {
  token: string;
  refresh_token: string;
};

// 登录表单数据类型
export type LoginForm = {
  mobile: string;
  code: string;
};

// 获取手机验证码接口的参数类型
export type getMobileCodeParam = string;
// 获取手机验证码接口的响应类型
export type getMobileCodeResponse = { message: string; data: null };

// 登录接口的参数类型
export type LoginParams = { mobile: string; code: string };
// 登录接口的响应类型
export type LoginResponse = Token;

// 用户信息
export type User = {
  id: string;
  name: string;
  photo: string;
  art_count: number;
  follow_count: number;
  fans_count: number;
  like_count: number;
};

// 获取用户信息接口的响应类型
export type getUserResponse = User;
