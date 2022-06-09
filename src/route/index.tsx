import { RouterBody } from "@/types/route";
import { Navigate, useRoutes } from "react-router-dom";
import lazyLoad from "@/route/lazyLoad";

export const routes: RouterBody[] = [
  {
    path: "/",
    element: lazyLoad("components/RouterBeforeEach"),
    children: [
      {
        path: "/",
        element: <Navigate to="/home" />,
      },
      {
        path: "/home",
        element: lazyLoad("pages/Layout"),
      },
      {
        path: "/login",
        element: lazyLoad("pages/Login"),
      },
    ],
  },
  {
    path: "*",
    element: lazyLoad("pages/NotFound"),
  },
];

const AppRouter = () => {
  return useRoutes(routes);
};

export default AppRouter;
