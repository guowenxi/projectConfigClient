import React, { useEffect } from "react";
import { RouteComponentProps } from "dva/router";
import { SubscriptionAPI } from "dva";
import { HashRouter } from "react-router-dom";
import { renderRoutes } from "react-router-config";
import routes from "@/router";

import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';

interface Props extends RouteComponentProps {
}

const App = (props: Props & SubscriptionAPI) => {

  useEffect(() => {
    // 获取所有公用下拉框数据
    props.dispatch({
      type: 'select/getSelectData',
      method: 'GET',
      url: '/fyHome/sys-dict/selectByClass',
      payload: {
        'rbacToken': '6efbaa2291424d3287ef550a9b855dc1',
        typeClass: 'sex'
      },
    });
  }, []);

  return <ConfigProvider locale={zhCN}>
    <HashRouter>{renderRoutes(routes)}</HashRouter>
  </ConfigProvider>
};
export default App;
