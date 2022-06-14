import {matchRoutes, Outlet, useLocation, useNavigate,} from "react-router-dom";
import {routes} from "@/route";
import {useEffect, useState} from "react";
import {RouterBody} from "@/types/route";
import {getTokenByLocalStorage} from "@/utils";

// 前置路由守卫
const RouterBeforeEach = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [auth, setAuth] = useState(false);

  useEffect(() => {
    // 检索当前路由信息
    const currentMatchRoute = matchRoutes(routes, location);
    if (currentMatchRoute !== null) {
      const currentRoute = currentMatchRoute[currentMatchRoute.length - 1]
        .route as RouterBody;

      // 动态修改页面 title
      if (currentRoute.title) {
        document.title = currentRoute.title + " - 极客园 - Mobile";
      } else {
        document.title = "极客园 - Mobile";
      }

      // 获取 token
      const token = getTokenByLocalStorage().token;
      // 判断当前路径是否需要认证 如果需要认证再判断token是否存在
      if (currentMatchRoute.find((item) => "auth" in item.route) && !token) {
        // 未登录
        setAuth(false);
        // 跳转到登录页
        navigate("/login", { state: { redirectURL: location.pathname } });
      } else {
        // 已登录或不需要认证
        setAuth(true);
      }
    }
  }, [location, navigate]);
  return auth ? <Outlet /> : null;
};
export default RouterBeforeEach;
