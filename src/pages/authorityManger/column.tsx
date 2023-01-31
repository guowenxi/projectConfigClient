import { Switch } from "antd";
import React from "react";
import { render } from "react-dom";
import { EyeOutlined } from '@ant-design/icons';


const columns = {
  "url": "/evalCode/getSCheduleList",
  // "url": "/getList",
  "params": {},
  "checkBox": true,
  "searchListType": "multipleQuery",
  "searchList": [
    { "title": "设备类型", "type": "select", "key": "deviceTypeId", "placeholder": "请选择设备类型", sendType: "id", filterList: "globalDeviceType" },
    { "title": "楼层", "type": "select", "key": "deviceFloorId", "placeholder": "请选择楼层", sendType: "id", filterList: "globalFloor" },
    { "title": "设备名称", "type": "input", "key": "deviceName", "placeholder": "请输入设备名称" },
  ],
  "tableColumns": (props?: any, tableProps?: any, methods?: any) => {
    // let current:number=tableProps?.pagination.current;
    // let pageSize:number=tableProps?.pagination.pageSize;
    return [
      {
        title: '角色名称',
        dataIndex: 'name',
        key: 'name',
        className: 'no-flex',
        width: "10%",
        align: 'center'
      },
      {
        title: '实际成员',
        key: 'execute',
        dataIndex: 'execute',
        className: 'no-flex',
        width: "10%",
        align: 'center',
      },
      {
        title: '页面权限',
        key: 'describe',
        dataIndex: 'describe',
        className: 'no-flex',
        width: "10%",
        align: 'center'
      },
      {
        title: '操作权限',
        key: 'describe',
        dataIndex: 'describe',
        className: 'no-flex',
        width: "10%",
        align: 'center'
      },
      {
        title: '角色期限',
        key: 'describe',
        dataIndex: 'describe',
        className: 'no-flex',
        width: "10%",
        align: 'center'
      },
      {
        title: '角色期限',
        key: 'describe',
        dataIndex: 'describe',
        className: 'no-flex',
        width: "10%",
        align: 'center',
        render: (text: any, record: any) => {
          return <Switch checkedChildren="开启" unCheckedChildren="关闭" />
        }
      },
      // {
      //   title: '触发规则',
      //   key: 'triggerState',
      //   dataIndex: 'triggerState',
      //   className: 'no-flex',
      //   width: "10%",
      //   align: 'center',
      //   render: (text: any, record: any, idx: any) => {
      //     return (
      //       <div>
      //         {
      //           text == '1' ? '始终触发' : text == '2' ? '定时触发' : '自定义触发'
      //         }
      //       </div>
      //     )
      //   }
      // },
    ];
  },
  tableColumns1: (props?: any, tableProps?: any, methods?: any) => {
    // let current:number=tableProps?.pagination.current;
    // let pageSize:number=tableProps?.pagination.pageSize;
    return [
      {
        title: '用户名称',
        dataIndex: 'name',
        key: 'name',
        className: 'no-flex',
        width: "10%",
        align: 'center'
      },
      {
        title: '所属角色',
        key: 'execute',
        dataIndex: 'execute',
        className: 'no-flex',
        width: "10%",
        align: 'center',
      },
      {
        title: '手机号',
        key: 'describe',
        dataIndex: 'describe',
        className: 'no-flex',
        width: "10%",
        align: 'center'
      },
      {
        title: '密码',
        key: 'describe',
        dataIndex: 'describe',
        className: 'no-flex',
        width: "10%",
        align: 'center',
        render: () => {
          return <EyeOutlined />
        }
      },
    ];
  },
}
export default columns