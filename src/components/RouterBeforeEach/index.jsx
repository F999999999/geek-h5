import {matchRoutes, Outlet, useLocation} from "react-router-dom";
import {routes} from "@/route";
import {useEffect} from "react";

// 前置路由守卫
const RouterBeforeEach = () => {
  const location = useLocation();

  useEffect(() => {
    // 检索当前路由信息
    const currentMatchRoute = matchRoutes(routes, location);
    const currentRoute = currentMatchRoute[currentMatchRoute.length - 1].route;
    // 动态修改页面 title
    if (currentRoute.title) {
      document.title = currentRoute.title + " - 极客园 - Mobile";
    } else {
      document.title = "极客园 - Mobile";
    }
  }, [location]);
  return <Outlet />;
};
export default RouterBeforeEach;
