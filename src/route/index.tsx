import { RouterBody } from "@/types/route";
import { Navigate, useRoutes } from "react-router-dom";
import lazyLoad from "@/route/lazyLoad";

export const routes: RouterBody[] = [
  {
    path: "/",
    element: lazyLoad("components/RouterBeforeEach"),
    children: [
      { index: true, element: <Navigate to={"/home"} /> },
      { path: "login", element: lazyLoad("pages/Login") },
      {
        path: "home",
        element: lazyLoad("pages/Layout"),
        children: [
          { index: true, element: <Navigate to={"/home/index"} /> },
          { path: "index", element: lazyLoad("pages/Home") },
          { path: "question", element: lazyLoad("pages/Question") },
          { path: "video", element: lazyLoad("pages/Video") },
          {
            path: "profile",
            element: lazyLoad("pages/Profile"),
            auth: true,
          },
        ],
      },
      {
        path: "profile",
        children: [{ path: "edit", element: lazyLoad("pages/Profile/Edit") }],
      },
    ],
  },
  { path: "*", element: lazyLoad("pages/NotFound") },
];

const AppRouter = () => useRoutes(routes);

export default AppRouter;
