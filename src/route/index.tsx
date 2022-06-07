import { RouterBody } from "@/types/route";
import { lazy, Suspense } from "react";
import { useRoutes } from "react-router-dom";

export const routes: RouterBody[] = [
  {
    path: "/",
    component: lazy(() => import("@/pages/Layout")),
    children: [
      {
        path: "/login",
        component: lazy(() => import("@/pages/Login")),
        title: "登录",
      },
    ],
  },
  {
    path: "*",
    component: lazy(() => import("@/pages/NotFound")),
    title: "页面不存在 - 404",
  },
];

// 路由处理方式
const changeRouter = (routers: RouterBody[]): any => {
  return routers.map((item) => {
    if (item.children) {
      item.children = changeRouter(item.children);
    }
    item.element = (
      <Suspense fallback={<div>加载中...</div>}>
        {/* 把懒加载的异步路由变成组件装载进去 */}
        <item.component />
      </Suspense>
    );
    return item;
  });
};

const AppRouter = () => useRoutes(changeRouter(routes));

export default AppRouter;
