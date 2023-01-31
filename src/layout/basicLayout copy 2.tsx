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


const { Header, Content, Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem('table 1', '1', <PieChartOutlined />),
  getItem('test 2', '2', <DesktopOutlined />),
  getItem('User', 'sub1', <UserOutlined />, [
    getItem('Tom', '3'),
    getItem('Bill', '4'),
    getItem('Alex', '5'),
  ]),
  getItem('Team', 'sub2', <TeamOutlined />, [
    getItem('Team 1', '6'),
    getItem('Team 2', '8')]),
  getItem('Files', '9', <FileOutlined />),
];

import logo from '@/logo.svg';



const BasicLayout: React.FC<RouteConfigComponentProps> = (props) => {
  // const history = useHistory()
  const { route, history } = props;
  // console.log("basic layout");
  const [collapsed, setCollapsed] = useState(false);

  console.log('BasicLayout', props)

  const onClick: MenuProps['onClick'] = e => {
    if (e.key === '1') {
      history.push('/basicLayout/user')
    }
    if (e.key === '2') {
      history.push('/basicLayout/test')
    }
    if (e.key === '9') {
      history.push('/basicLayout/files')
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={value => setCollapsed(value)}>
        <div className="logo">
          <img src={logo} />
        </div>
        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} onClick={onClick} />
      </Sider>
      <Layout className="site-layout">
        <Header className="site-layout-background" style={{ padding: 0 }} />
        <Content style={{ height: '80%', width: '100%' }}>
          {/*<Breadcrumb style={{margin: '16px 0'}}>*/}
          {/*    <Breadcrumb.Item>User</Breadcrumb.Item>*/}
          {/*    <Breadcrumb.Item>Bill</Breadcrumb.Item>*/}
          {/*</Breadcrumb>*/}
          <div className="site-layout-background"
            style={{ width: '100%', height: '100%' }}
          // style={{ padding: 24, minHeight: '85vh', marginTop: '16px' }}
          >
            {renderRoutes(route?.routes)}
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}> 版权所有 ©2022 飞叶科技股份有限公司</Footer>
      </Layout>
    </Layout>
  );
}

export default connect(({ common, select }) => ({
  common,
  select
}))(BasicLayout);
