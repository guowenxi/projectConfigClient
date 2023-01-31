import { Switch, Tag } from "antd";
import React from "react";
import { render } from "react-dom";

const weekSplit = (numList: any) => {
  let arry = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'];
  let endString: any = [];
  numList.map((res: any) => {
    endString.push(arry[res - 1])
  })
  return endString.join('，');
}

const columns = {
  "url": "/evalCode/getSCheduleList",
  // "url": "/getList",
  "params": {},
  "checkBox": true,
  // "operation": [
  //   { "name": "报警配置", "type": "disabled","drawerWidth": "50"},
  //   { "name": "编辑", "type": "disabled","drawerWidth": "50"},
  //   { "name": "删除", "type": "disabled","drawerWidth": "50"},
  // ],
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
        title: '任务名称',
        dataIndex: 'name',
        key: 'name',
        className: 'no-flex',
        width: "10%",
        align: 'center'
      },
      {
        title: '执行情况',
        key: 'execute',
        dataIndex: 'execute',
        className: 'no-flex',
        width: "5%",
        align: 'center',
        render: (text: any, record: any) => {
          return <Switch checkedChildren="开启" unCheckedChildren="关闭" />
        }
      },
      {
        title: '描述',
        key: 'describe',
        dataIndex: 'describe',
        className: 'no-flex',
        width: "10%",
        align: 'center'
      },
      {
        title: '触发规则',
        key: 'describe',
        dataIndex: 'describe',
        className: 'no-flex',
        width: "5%",
        align: 'center'
      },
      {
        title: '时间设定',
        key: 'describe',
        dataIndex: 'describe',
        className: 'no-flex',
        width: "10%",
        align: 'center'
      },
      {
        title: '引擎方式',
        key: 'describe',
        dataIndex: 'describe',
        className: 'no-flex',
        width: "5%",
        align: 'center',
      },
      {
        title: '执行动作',
        key: 'describe',
        dataIndex: 'describe',
        className: 'no-flex',
        width: "10%",
        align: 'center',
        render: (text: any, record: any, idx: any) => {
          return <Tag color="#6ad96f">警告推送</Tag>
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
  tableColumns2: (props?: any, tableProps?: any, methods?: any) => {
    // let current:number=tableProps?.pagination.current;
    // let pageSize:number=tableProps?.pagination.pageSize;
    return [
      {
        title: '时间',
        dataIndex: 'name',
        key: 'name',
        className: 'no-flex',
        width: "10%",
        align: 'center'
      },
      {
        title: '类型',
        key: 'describe',
        dataIndex: 'describe',
        className: 'no-flex',
        width: "10%",
        align: 'center',
      },
      {
        title: '点位',
        key: 'describe',
        dataIndex: 'describe',
        className: 'no-flex',
        width: "10%",
        align: 'center',
      },
      {
        title: '值',
        key: 'describe',
        dataIndex: 'describe',
        className: 'no-flex',
        width: "10%",
        align: 'center',
      },
      {
        title: '状态',
        key: 'describe',
        dataIndex: 'describe',
        className: 'no-flex',
        width: "10%",
        align: 'center',
      },

    ];
  },
}
export default columns