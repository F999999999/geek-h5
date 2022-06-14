import { Button, Form, Input, NavBar, Toast } from "antd-mobile";
import styles from "./index.module.scss";
import { LoginForm } from "@/types/user";
import { getMobileCode, login } from "@/store/userSlice";
import { useAppDispatch } from "@/store";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { InputRef } from "antd-mobile/es/components/input";

const Login = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // from 表单控制实例
  const [form] = Form.useForm();

  // 手机号码
  const mobileRef = useRef<InputRef>(null);

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
            // 获取重定向路径
            const redirectURL = (
              location as { state?: { redirectURL?: string } }
            ).state?.redirectURL;
            // 返回首页
            navigate(redirectURL || "/");
          },
        });
      })
      .catch((e) => {
        Toast.show({
          content: e.response?.data?.message,
          duration: 1000,
        });
      });
  };

  // 验证码倒计时
  const [timeLeft, setTimeLeft] = useState(0);
  // 定时器id
  const timerRef = useRef(-1);

  // 获取验证码
  const getCode = () => {
    // 获取手机号码
    const mobile = form.getFieldValue("mobile")?.trim();
    // 判断手机号校验是否成功
    const hasError = form.getFieldError("mobile").length > 0;
    if (mobile && !hasError) {
      // 发送请求获取手机验证码
      dispatch(getMobileCode(mobile));
      // 设置倒计时时间
      setTimeLeft(60);
      // 因为 setInterval 默认返回 NodeJS.Timeout，使用 window.setInterval 后，返回值才是 number 类型的数值
      timerRef.current = window.setInterval(() => {
        setTimeLeft((timeLeft) => timeLeft - 1);
      }, 1000);
    } else {
      // 手机号码输入框获取焦点
      mobileRef.current?.focus();
    }
  };

  // 监听倒计时变化 在倒计时结束时清理定时器
  useEffect(() => {
    if (timeLeft <= 0) clearInterval(timerRef.current);
  }, [timeLeft]);

  // 在组件卸载时清理定时器
  useEffect(() => {
    return () => {
      // 组件卸载时清理定时器
      clearInterval(timerRef.current);
    };
  }, []);

  return (
    <div className={styles.root}>
      <NavBar></NavBar>

      <div className="login-form">
        <h2 className="title">账号登录</h2>

        <Form form={form} validateTrigger={["onBlur"]} onFinish={onFinish}>
          <Form.Item
            className="login-item"
            name="mobile"
            validateTrigger="onBlur"
            rules={[
              { required: true, message: "请输入手机号" },
              { validator: checkMobile },
            ]}
          >
            <Input placeholder="请输入手机号" maxLength={11} ref={mobileRef} />
          </Form.Item>

          <Form.Item
            className="login-item"
            name="code"
            validateTrigger="onBlur"
            rules={[{ required: true, message: "请输入验证码" }]}
            extra={
              <span
                className="code-extra"
                // 判断是否开启定时器，没开启绑定事件，开启后去掉事件
                onClick={timeLeft === 0 ? getCode : undefined}
              >
                {/* 判断是否开启定时器，没开启展示 发送验证码，开启后展示倒计时 */}
                {timeLeft === 0 ? "发送验证码" : `${timeLeft}s后重新获取`}
              </span>
            }
          >
            <Input placeholder="请输入验证码" autoComplete="off" />
          </Form.Item>

          {/* noStyle 表示不使用 Form.Item 自带的样式 */}
          <Form.Item noStyle shouldUpdate>
            {() => {
              // isFieldsTouched(true) 检查是否所有字段都被操作过
              // getFieldsError() 获取所有字段名对应的错误信息
              const disabled =
                !form.isFieldsTouched(true) ||
                form.getFieldsError().filter(({ errors }) => errors.length)
                  .length !== 0;

              return (
                <Button
                  block
                  type="submit"
                  color="primary"
                  className="login-submit"
                  disabled={disabled}
                >
                  登 录
                </Button>
              );
            }}
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Login;
