import React, { useState, useEffect } from 'react';
import { connect } from "dva";
import { RouteConfigComponentProps, renderRoutes } from "react-router-config";
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Breadcrumb, Layout, Menu } from 'antd';
import { getAssetsFile } from '@/utils/utils'
import styles from './index.module.less'
import CONFIG from 'config/config.js'
const { STATICLIST } = CONFIG
const { Header, Content, Footer, Sider } = Layout;

const BasicLayout: React.FC<RouteConfigComponentProps> = (props) => {
  // const history = useHistory()
  const { route, history } = props;
  const [routeName, set_routeName] = useState<any>('123');
  // console.log("basic layout");

  const meanItem = (Item: any, idx?: any) => {
    return <Menu.Item onClick={() => {
      let end = Item.name.replaceAll(':', '_')
      history.push('/' + end)
      set_routeName(Item.displayName)
    }}>
      {/* <img src={getAssetsFile('/vite.png')} className={`${styles['MenuIcon']}`} /> */}
      {Item.displayName}
    </Menu.Item>
  }

  const returnSilderDom = (item: any, idx?: any) => {
    if (!!item.tempList) {
      return <Menu.SubMenu title={item.displayName}
      // icon={<img src={getAssetsFile('/vite.png')} className={`${styles['MenuIcon']}`} />}
      >
        {
          item.tempList.map((res1: any, idx1: any) => {
            return returnSilderDom(res1)
          })
        }
      </Menu.SubMenu>
    }
    return meanItem(item)
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={'12%'}>
        <Menu
          theme={'dark'}
          mode="inline"
        >
          {
            STATICLIST[0].tempList.map((res: any, idx: any) => {
              return returnSilderDom(res, idx)
            })
          }
        </Menu>
      </Sider>

      <Layout className={styles['site-layout']}>
        {/* <Header className="site-layout-background" style={{ padding: 0 }} /> */}
        <Content className={`${styles['mainBox']}`}>
          <div className={`${styles['pageTitle']}`}>{routeName}</div>
          <div className={`${styles['contentBox']}`}>
            {renderRoutes(route?.routes)}
          </div>
        </Content>
        {/* <Footer style={{ textAlign: 'center' }}> 版权所有 ©2022 有限公司</Footer> */}
      </Layout>

    </Layout>
  );
}

export default connect(({ common, select }) => ({
  common,
  select
}))(BasicLayout);
