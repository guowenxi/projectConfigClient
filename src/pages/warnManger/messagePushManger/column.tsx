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
        title: '配置名称',
        dataIndex: 'name',
        key: 'name',
        className: 'no-flex',
        width: "10%",
        align: 'center'
      },
      {
        title: '推送类型',
        key: 'pushType',
        dataIndex: 'pushType',
        className: 'no-flex',
        width: "10%",
        align: 'center',
        render: (text: any, record: any) => {
          return text == 1 ? '钉钉' : text == 2 ? "短信" : ""
        }
      },
      {
        title: '推送方式',
        key: 'pushName',
        dataIndex: 'pushName',
        className: 'no-flex',
        width: "10%",
        align: 'center'
      },
      {
        title: '启用状态',
        key: 'describe',
        dataIndex: 'describe',
        className: 'no-flex',
        width: "10%",
        align: 'center',
        render: (text: any, record: any) => {
          return <Switch
            onChange={(e1) => {
              if (e1) {
                methods.changeInitiateMode(record.id, 1)
              } else {
                methods.changeInitiateMode(record.id, 0)
              }
            }}
            defaultChecked={record.status == 1}
            checkedChildren="开启"
            unCheckedChildren="关闭" />
        }
      },
      // {
      //   title: '备注',
      //   key: 'describe',
      //   dataIndex: 'describe',
      //   className: 'no-flex',
      //   width: "10%",
      //   align: 'center'
      // },
    ];
  },
  "tableColumns2": (props?: any, tableProps?: any, methods?: any) => {
    // let current:number=tableProps?.pagination.current;
    // let pageSize:number=tableProps?.pagination.pageSize;
    return [
      {
        title: '推送时间',
        dataIndex: 'pushTime',
        key: 'pushTime',
        className: 'no-flex',
        width: "10%",
        align: 'center'
      },
      {
        title: '报警类型',
        key: 'alarmValue',
        dataIndex: 'alarmValue',
        className: 'no-flex',
        width: "10%",
        align: 'center',
      },
      {
        title: '报警内容',
        key: 'warnContent',
        dataIndex: 'warnContent',
        className: 'no-flex',
        width: "10%",
        align: 'center',
        render: (text: any, record: any) => {
          return text == null ? '暂无数据' : text;
        }
      },
      {
        title: '推送对象',
        key: 'name',
        dataIndex: 'name',
        className: 'no-flex',
        width: "10%",
        align: 'center'
      },
      {
        title: '推送结果',
        key: 'pushResult',
        dataIndex: 'pushResult',
        className: 'no-flex',
        width: "10%",
        align: 'center',
        render: (text: any, record: any) => {
          return record.pushResult == 1 ? <Tag color="#0c98ec">成功</Tag> :
            <Tag color="#ff6868">失败</Tag>
        }
      },
    ];
  }
}
export default columns