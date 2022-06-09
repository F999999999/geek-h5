// 路由懒加载的封装
import { SpinLoading } from "antd-mobile";
import { lazy, Suspense } from "react";

const lazyLoad = (path: string) => {
  const Comp = lazy(() => import(`@/${path}`));
  return (
    <Suspense
      fallback={
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%,-50%)",
          }}
        >
          <SpinLoading />
        </div>
      }
    >
      {/* 把懒加载的异步路由变成组件装载进去 */}
      <Comp />
    </Suspense>
  );
};

export default lazyLoad;
