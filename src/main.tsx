import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { renderRoutes } from "react-router-config";
import "@/styles/global.less";
import routes from "./router";
import zhCN from 'antd/es/locale/zh_CN';
ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>{renderRoutes(routes)}</BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);
