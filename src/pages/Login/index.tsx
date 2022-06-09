import { Button, Form, Input, NavBar } from "antd-mobile";

import styles from "./index.module.scss";

const Login = () => {
  return (
    <div className={styles.root}>
      <NavBar></NavBar>

      <div className="login-form">
        <h2 className="title">账号登录</h2>

        <Form>
          <Form.Item className="login-item">
            <Input placeholder="请输入手机号" />
          </Form.Item>

          <Form.Item
            className="login-item"
            extra={<span className="code-extra">发送验证码</span>}
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
