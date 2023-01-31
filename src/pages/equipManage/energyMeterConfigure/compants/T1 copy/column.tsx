import { Input, Switch } from "antd";
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
        title: '设备编号',
        dataIndex: 'name',
        key: 'name',
        className: 'no-flex',
        width: "8%",
        align: 'center'
      },
      {
        title: '设备名称',
        key: 'execute',
        dataIndex: 'execute',
        className: 'no-flex',
        width: "10%",
        align: 'center',
        render: (text: any, record: any) => {
          return <Switch checkedChildren="开启" unCheckedChildren="关闭" />
        }
      },
      {
        title: '设备类型',
        key: 'describe',
        dataIndex: 'describe',
        className: 'no-flex',
        width: "8%",
        align: 'center'
      },
      {
        title: '表分类',
        key: 'describe',
        dataIndex: 'describe',
        className: 'no-flex',
        width: "8%",
        align: 'center'
      },
      {
        title: '总表编号',
        key: 'describe',
        dataIndex: 'describe',
        className: 'no-flex',
        width: "8%",
        align: 'center'
      },
      {
        title: '楼层',
        key: 'describe',
        dataIndex: 'describe',
        className: 'no-flex',
        width: "10%",
        align: 'center'
      },
      {
        title: '区域',
        key: 'describe',
        dataIndex: 'describe',
        className: 'no-flex',
        width: "10%",
        align: 'center'
      },
      {
        title: '用电分项',
        key: 'describe',
        dataIndex: 'describe',
        className: 'no-flex',
        width: "10%",
        align: 'center'
      },
      {
        title: '计费方式',
        key: 'describe',
        dataIndex: 'describe',
        className: 'no-flex',
        width: "10%",
        align: 'center'
      },
    ];
  },
  otherTableColumns: (isedit: any, setfn?: any) => {
    return [
      {
        title: '数据项',
        key: 'execute1',
        dataIndex: 'execute1',
        className: 'no-flex',
        width: "20%",
        align: 'center',
        render: (text: any, record: any) => {
          return (
            isedit == 1 ? <div><Input
              onInput={(e: any) => {
                record.name = e.currentTarget.value
              }}
            /></div> : <div>{text}</div>
          )
        }
      },
      {
        title: '参数名称',
        key: 'execute1',
        dataIndex: 'execute1',
        className: 'no-flex',
        width: "20%",
        align: 'center',
        render: (text: any, record: any) => {
          return (
            isedit == 1 ? <div><Input
              onInput={(e: any) => {
                record.name = e.currentTarget.value
              }}
            /></div> : <div>{text}</div>
          )
        }
      },
      {
        title: '数据源',
        key: 'execute1',
        dataIndex: 'execute1',
        className: 'no-flex',
        width: "20%",
        align: 'center',
        render: (text: any, record: any) => {
          return (
            isedit == 1 ? <div><Input
              onInput={(e: any) => {
                record.name = e.currentTarget.value
              }}
            /></div> : <div>{text}</div>
          )
        }
      },
    ];
  },
}
export default columns