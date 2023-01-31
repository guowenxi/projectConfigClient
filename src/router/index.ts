import loadable from "@loadable/component";
import Layout, { MainLayout } from "@/layout";
import BasicLayout from "@/layout/basicLayout";
import { RouteConfig } from "react-router-config";
import Home from "@/pages/home";
import CONFIG from '../../config/config'
const { ROUTERS } = CONFIG
const routesConfig: RouteConfig[] = [
  // APP 路由
  {
    component: Layout,
    routes: [
      {
        path: "/",
        component: BasicLayout,
        routes: ROUTERS
      },
      // {
      //   path: "/main",
      //   component: MainLayout,
      //   routes: [
      //     // {
      //     //   path: "/main/screen",
      //     //   exact: true,
      //     //   name: "screen",
      //     //   component: loadable(() => import("@/pages/screen")),
      //     // },
      //     {
      //       path: "*",
      //       exact: false,
      //       name: "404",
      //       component: loadable(() => import("@/pages/404")),
      //     },
      //   ],
      // },
      // {
      //   path: "*",
      //   exact: false,
      //   name: "404",
      //   component: loadable(() => import("@/pages/404")),
      // },
    ],
  },
];

export default routesConfig;
