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
        element: lazyLoad("pages/Layout"),
        children: [
          { index: true, element: <Navigate to={"/home/index"} /> },
          { path: "/home/index", element: lazyLoad("pages/Home") },
          { path: "/home/question", element: lazyLoad("pages/Question") },
          { path: "/home/video", element: lazyLoad("pages/Video") },
          { path: "/home/profile", element: lazyLoad("pages/Profile") },
        ],
      },
      { path: "/login", element: lazyLoad("pages/Login") },
    ],
  },
  { path: "*", element: lazyLoad("pages/NotFound") },
];

const AppRouter = () => {
  return useRoutes(routes);
};

export default AppRouter;
