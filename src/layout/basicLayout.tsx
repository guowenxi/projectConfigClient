import React, { useState, useEffect } from 'react';
import { connect } from "dva";
import { RouteConfigComponentProps, renderRoutes } from "react-router-config";
import {
  DesktopOutlined,
  LaptopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,

  AlertOutlined,
  NodeIndexOutlined,
  ProjectOutlined,
  DashboardOutlined,
  MailOutlined,
  BellOutlined,
  HddOutlined
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Breadcrumb, Layout, Menu } from 'antd';
import { getAssetsFile } from '@/utils/utils'
import styles from './index.module.less'
import CONFIG from '../../config/config'
const { STATICLIST } = CONFIG
const { Header, Content, Footer, Sider } = Layout;
import logo from '@/logo.svg';
const BasicLayout: React.FC<RouteConfigComponentProps> = (props) => {
  // const history = useHistory()
  const { route, history } = props;
  const [routeName, set_routeName] = useState<any>('工程配置');
  const [defaultValue, set_defaultValue] = useState<any>([]);
  // console.log("basic layout");

  useEffect(() => {
    const meanName = sessionStorage.getItem('meanParam')
    if (!!meanName) {
      let end = meanName.replaceAll(':', '_')
      set_defaultValue(meanName)
      history.push('/' + end)
      return
    }
    let Item = STATICLIST[0].tempList[0]
    let end = Item.name.replaceAll(':', '_')
    set_defaultValue(Item.name)
    setLocal(Item.name)
    history.push('/' + end)
  }, [])

  const setLocal = (meanName: any) => {
    sessionStorage.setItem('meanParam', meanName)
  }

  const returnIcon = (name: any) => {
    if (name == 'DesktopOutlined') {
      return <DesktopOutlined />
    } else if (name == 'LaptopOutlined') {
      return <LaptopOutlined />
    } else if (name == 'FileOutlined') {
      return <FileOutlined />
    } else if (name == 'PieChartOutlined') {
      return <PieChartOutlined />
    } else if (name == 'TeamOutlined') {
      return <TeamOutlined />
    } else if (name == 'AlertOutlined') {
      return <AlertOutlined />
    } else if (name == 'NodeIndexOutlined') {
      return <NodeIndexOutlined />
    } else if (name == 'ProjectOutlined') {
      return <ProjectOutlined />
    } else if (name == 'DashboardOutlined') {
      return <DashboardOutlined />
    } else if (name == 'MailOutlined') {
      return <MailOutlined />
    } else if (name == 'BellOutlined') {
      return <BellOutlined />
    } else if (name == 'HddOutlined') {
      return <HddOutlined />
    }
  }

  const meanItem = (Item: any, idx?: any) => {
    return <Menu.Item
      onClick={() => {
        let end = Item.name.replaceAll(':', '_')
        history.push('/' + end)
        set_defaultValue(Item.name)
        setLocal(Item.name)
        set_routeName(Item.displayName)
      }}
      // icon={<img src={getAssetsFile('/vite.png')} className={`${styles['MenuIcon']}`} />}
      icon={returnIcon(Item.icon)}
      key={Item.name}
    >
      {/* <img src={getAssetsFile('/vite.png')} className={`${styles['MenuIcon']}`} /> */}
      {Item.displayName}
    </Menu.Item>
  }

  const returnSilderDom = (item: any, idx?: any) => {
    if (!!item.tempList) {
      return <Menu.SubMenu
        title={item.displayName}
        key={item.displayName}
        // icon={<img src={getAssetsFile('/vite.png')} className={`${styles['MenuIcon']}`} />}
        icon={returnIcon(item.icon)}
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
    <Layout style={{ minHeight: '95.2vh' }}>
      <Sider collapsible width={'200px'}>
        {/*<div className="logo">*/}
        {/*  <img src={logo} />*/}
        {/*</div>*/}
        <Menu
          selectedKeys={defaultValue}
          defaultOpenKeys={['设备管理', '告警管理']}
          // defaultSelectedKeys={}
          theme={'dark'}
          mode="inline"

          inlineCollapsed={false}
        >
          {
            STATICLIST[0].tempList.map((res: any, idx: any) => {
              return returnSilderDom(res, idx)
            })
          }
        </Menu>
      </Sider>

      <Layout className={styles['site-layout']}>
        {/*<Header style={{ padding: 0, backgroundColor: 'white' }} />*/}
        <Content className={`${styles['mainBox']}`}>
          {/*<div className={`${styles['pageTitle']}`}>{routeName}</div>*/}
          <div className={`${styles['contentBox']}`}>
            {renderRoutes(route?.routes)}
          </div>
        </Content>
        <Footer style={{ textAlign: 'center', borderTop: "1px solid #eee", cursor: "pointer" }}> 版权所有 ©2022 杭州伽壹科技有限公司</Footer>
      </Layout>

    </Layout>
  );
}

export default connect(({ common, select }) => ({
  common,
  select
}))(BasicLayout);
