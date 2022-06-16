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
export type GetMobileCodeParam = string;
// 获取手机验证码接口的响应类型
export type GetMobileCodeResponse = { message: string; data: null };

// 登录接口的参数类型
export type LoginParams = { mobile: string; code: string };
// 登录接口的响应类型
export type LoginResponse = Token;

// 用户信息
export type UserInfo = {
  id: string;
  name: string;
  photo: string;
  art_count: number;
  follow_count: number;
  fans_count: number;
  like_count: number;
};

// 获取用户信息接口的响应类型
export type GetUserResponse = UserInfo;

// 个人信息
export type UserProfile = {
  id: string;
  photo: string;
  name: string;
  mobile: string;
  gender: number;
  birthday: string;
  intro: string;
};

// 获取个人信息接口的响应类型
export type GetUserProfileResponse = UserProfile;

// 修改个人信息接口的参数类型
export type UpdateUserProfileParam = {
  name?: string;
  gender?: string;
  birthday?: string;
  intro?: string;
};
// 修改个人信息接口的响应类型
export type UpdateUserProfileResponse = null;

// 更新个人头像接口的参数类型
export type UpdateUserPhotoParam = FormData;
// 更新个人头像接口的响应类型
export type UpdateUserPhotoResponse = { id: string; photo: string };
