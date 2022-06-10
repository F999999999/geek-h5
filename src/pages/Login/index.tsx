import { Button, Form, Input, NavBar, Toast } from "antd-mobile";
import styles from "./index.module.scss";
import { LoginForm } from "@/types/user";
import { getMobileCode, login } from "@/store/userSlice";
import { useAppDispatch } from "@/store";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // from 表单控制实例
  const [from] = Form.useForm();

  // 手机号码校验
  const checkMobile = (_: any, value: String | undefined) => {
    if (value !== undefined) {
      if (value.search(/^1[3-9]\d{9}$/) === 0) {
        return Promise.resolve();
      } else {
        return Promise.reject(new Error("清输入正确的手机号码"));
      }
    } else {
      return Promise.reject(new Error("手机号不能为空!"));
    }
  };

  // 登录
  const onFinish = async (values: LoginForm) => {
    dispatch(login(values))
      .unwrap()
      .then(() => {
        // 登录成功提示
        Toast.show({
          content: "登录成功",
          duration: 600,
          afterClose: () => {
            // 返回首页
            navigate("/");
          },
        });
      })
      .catch((e) => {
        Toast.show({
          content: e.response?.data?.message || "登录失败",
          duration: 1000,
        });
      });
  };

  // 获取验证码
  const getCode = () => {
    const mobile = from.getFieldValue("mobile");
    if (mobile !== undefined) {
      dispatch(getMobileCode(mobile));
    }
  };

  return (
    <div className={styles.root}>
      <NavBar></NavBar>

      <div className="login-form">
        <h2 className="title">账号登录</h2>

        <Form form={from} validateTrigger={["onBlur"]} onFinish={onFinish}>
          <Form.Item
            className="login-item"
            name="mobile"
            validateTrigger="onBlur"
            rules={[
              { required: true, message: "请输入手机号" },
              { validator: checkMobile },
            ]}
          >
            <Input placeholder="请输入手机号" />
          </Form.Item>

          <Form.Item
            className="login-item"
            name="code"
            validateTrigger="onBlur"
            rules={[{ required: true, message: "请输入验证码" }]}
            extra={
              <span className="code-extra" onClick={getCode}>
                发送验证码
              </span>
            }
          >
            <Input placeholder="请输入验证码" autoComplete="off" />
          </Form.Item>

          {/* noStyle 表示不使用 Form.Item 自带的样式 */}
          <Form.Item noStyle>
            <Button
              block
              type="submit"
              color="primary"
              className="login-submit"
            >
              登 录
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Login;
