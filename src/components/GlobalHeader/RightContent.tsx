import {Tooltip, Tag, message, Badge, Empty, Modal, Menu, Button, Pagination, Popover} from 'antd';
import {QuestionCircleOutlined, BellOutlined} from '@ant-design/icons';
import React, {useEffect, useState, useRef} from 'react';

import {connect} from "dva";
import type {ConnectState} from '@/models/connect';
import HeaderSearch from '../HeaderSearch_';
import SelectLang from '../SelectLang';
import styles from './index.less';
import NoticeIconView from './NoticeIconView';
import UserInfo from './UserInfo';
import notice from '@/assets/imgs/notice.png';
import {BasicLayoutProps as ProLayoutProps} from "@ant-design/pro-layout/lib/BasicLayout";
import {Settings} from "@ant-design/pro-layout";
import {Dispatch} from "@@/plugin-dva/connect";

export type SiderTheme = 'light' | 'dark';

export interface GlobalHeaderRightProps extends Partial<any> {
  theme?: SiderTheme;
  settings: Settings;
  dispatch: Dispatch;
  layout: 'sidemenu' | 'topmenu';
}


const ENVTagColor = {
  dev: 'orange',
  test: 'green',
  pre: '#87d068',
};

const GlobalHeaderRight: React.SFC<GlobalHeaderRightProps> = (props) => {
  const {theme, layout, dispatch} = props;
  const [userName, seTUserName] = useState('');
  let className = styles.right;
  if (theme === 'dark' && layout === 'topmenu') {
    className = `${styles.right}  ${styles.dark}`;
  }
  const [isPopoverVisible, setIsPopoverVisible] = useState<boolean>(false);

  // 模态框 是否显示
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const listMenu = [
    {name: "全部通知", id: "2"},
    {name: "未读通知", id: "0"},
    {name: "已读通知", id: "1"},
  ]
  const [current, setCurrent] = useState<string>('2');

  const [listNotice, setListNotice] = useState<any>([])
  const [totalPage, setTotalPage] = useState<number>(1)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [defaultCurrent, setDefaultCurrent] = useState<number>(1)
  const [unreadNum, setUnreadNum] = useState<number>(0)
  const [buttonName, setButtonName] = useState("启动定时");
  const ref = useRef();

  const getListNotice = (pageSize: number, idRead: number, pageNo: number) => {
    dispatch({
      type: 'common/requestData',
      method: 'GET',
      url: "/fyHome/message-record/pageList",
      payload: {
        pageNo: pageNo ? pageNo : currentPage,
        pageSize: pageSize,
        idRead: idRead,
      },
      callback: (_data: any) => {
        setListNotice(_data.data)
        setTotalPage(_data.total);
      },
    });
  }

  const updateRead = (id: any, type: string) => {
    dispatch({
      type: 'common/requestData',
      method: 'GET',
      url: "/fyHome/message-record/read",
      payload: {
        id: id
      },
      callback: (_data: any) => {
        if (type === 'top3') {
          getListNotice(3, 0);
        } else {
          getListNotice(10, 0);
        }
        getUnreadNum();
        message.success('操作成功');
      },
    });
  }
  const updateAllRead = () => {
    dispatch({
      type: 'common/requestData',
      method: 'GET',
      url: "/fyHome/message-record/allRead",
      payload: {},
      callback: (_data: any) => {
        message.success('操作成功');
        getListNotice(3);
        getUnreadNum();
      },
    });
  }

  const getUnreadNum = () => {
    dispatch({
      type: 'common/requestData',
      method: 'GET',
      url: "/fyHome/message-record/unreadNum",
      payload: {},
      callback: (_data: any) => {
        setUnreadNum(_data)
      },
    });
  }
  useEffect(() => {
    // 获取默认数据
    getUnreadNum();
    // startTimer();
  }, []);


  let timer = null

  const startTimer = () => {
    if (buttonName == "启动定时") {
      setButtonName("结束定时")
      timer = setInterval(() => {
        console.log('触发了')


        //你的定时器调用的函数，根据需求写吧
        // 获取默认数据
        getUnreadNum();

      }, 20000)
      ref.current = timer;
      console.log("启动定时")
    } else {
      console.log("结束定时")
      setButtonName("启动定时");
      clearInterval(ref.current);
    }
  }


  return (
    <div className={className}>

      <div className={styles['header-notice']}>
        <Badge count={unreadNum === 0 ? '' : unreadNum}>
          <Popover placement="bottomLeft"
                   trigger="click"
                   visible={isPopoverVisible}
                   onVisibleChange={()=>{setIsPopoverVisible(!isPopoverVisible)}}


                   title={
                     <div className={styles['box-title']}>
                       <span>通知</span>
                       <span onClick={() => {
                         updateAllRead()
                       }}>全部已读</span>
                     </div>
                   }
                   content={
                     <div className={styles['box']}>
                       {
                         listNotice.length === 0 ? <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}/> :
                           listNotice.map((item:any) => {
                             return (
                               <div className={styles['box-row']} key={item.id}>
                                 <div>{item.messageContent}</div>
                                 <div className={styles['box-row-bottom']}>
                                   <span>{item.messageType}</span>
                                   <span>{item.messageTime.substring(0, 16)}</span>
                                   <span onClick={() => {
                                     updateRead(item.id, 'top3')
                                   }}>设为已读</span>
                                 </div>
                               </div>
                             )
                           })
                       }
                       <div className={styles['box-bottom']} onClick={() => {
                         setIsPopoverVisible(false)
                         setIsModalVisible(true)
                         getListNotice(10)
                       }}>查看全部
                       </div>
                     </div>


                   }>
            <img src={notice} onClick={() => {

              getListNotice(3, 0, 1);


            }}/>
          </Popover>
        </Badge>


      </div>

      <UserInfo/>

      <Modal title="通知" visible={isModalVisible}
             onCancel={() => {
               setIsModalVisible(false)
             }}
             footer={[
               <Button key="back" onClick={() => {
                 setIsModalVisible(false)
               }}>
                 关闭
               </Button>
             ]} width="800">

        <Menu onClick={(e) => {
          setCurrent(e.key);
          getListNotice(10, e.key, 1);
        }} selectedKeys={[current]} mode="horizontal">
          {
            listMenu.map((item: object, index: number) => {
              return (
                <Menu.Item key={item.id}>
                  {item.name}
                </Menu.Item>
              )
            })
          }
        </Menu>

        <div className={styles['body']}>
          <div className={styles['banner']}>
            {
              listNotice.length === 0 ? <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}/> :
                Array.isArray(listNotice) && listNotice.map((item: any, index: number) => {
                  return (
                    <div className={styles['row']} key={item.id}
                         style={{color: item.isRead === 1 ? 'rgba(0, 0, 0, 0.45)' : 'rgba(0, 0, 0, 0.85)'}}>
                      <div className={styles['row-left']}>
                        <div>{item.messageType}</div>
                      </div>
                      <div className={styles['row-center']}>
                        {item.messageContent}
                      </div>
                      <div className={styles['row-right']}>
                        <div>{item.messageTime.substring(0, 16)}</div>
                        <span style={{color: item.isRead === 1 ? '#ccc' : '#0257cc'}} onClick={() => {
                          if (item.isRead === 1) {
                            return;
                          }
                          updateRead(item.id)
                        }}>

                          {
                            item.isRead === 1 ? item.messageTime.substring(0, 16) : '设为已读'
                          }
                        </span>
                      </div>
                    </div>
                  )
                })
            }
          </div>

          {
            Array.isArray(listNotice) && listNotice.length > 0 ?
              <div className={styles['row-page']}>
                <Pagination defaultCurrent={defaultCurrent} total={totalPage} pageSize={10}
                            onChange={(page: number, pageSize: number) => {
                              console.log(page, pageSize)
                              setCurrentPage(page)
                              getListNotice(pageSize, parseInt(current), page)
                            }}/>
              </div> : ''

          }


        </div>
      </Modal>


    </div>
  );
};

export default connect(({settings}: ConnectState) => ({
  theme: settings.navTheme,
  layout: settings.layout,
}))(GlobalHeaderRight);
