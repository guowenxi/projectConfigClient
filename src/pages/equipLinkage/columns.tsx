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
  // "url": "/api/getList",
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
        title: '计划名称',
        dataIndex: 'name',
        key: 'name',
        className: 'no-flex',
        width: "10%",
        // align:'center'
      },
      {
        title: '执行计划',
        key: 'execute',
        dataIndex: 'execute',
        className: 'no-flex',
        width: "10%",
        align: 'center',
        render: (text: any, record: any, idx: any) => {
          return (
            <div>
              <Switch
                defaultChecked={text == '1'}
                onChange={(checked, event) => {
                  methods.changeSwitch(record.id, checked ? '1' : '0')
                }}
                checkedChildren="开启"
                unCheckedChildren="关闭"
              />
            </div>
          )
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
        key: 'triggerState',
        dataIndex: 'triggerState',
        className: 'no-flex',
        width: "10%",
        align: 'center',
        render: (text: any, record: any, idx: any) => {
          return (
            <div>
              {
                text == '1' ? '始终触发' : text == '2' ? '定时触发' : '自定义触发'
              }
            </div>
          )
        }
      },
      {
        title: '执行动作',
        key: 'describe',
        dataIndex: 'describe',
        className: 'no-flex',
        width: "10%",
        align: 'center',
        render: (text: any, record: any, idx: any) => {
          if (!!record.socketList && record.warnManagers.length != 0) {
            return <div style={{ display: 'flex' }}>
              <Tag color="#0fc316">告警推送</Tag>
              <Tag color="#0085ff">设备下发</Tag>
            </div>
          } else if (!!record.socketList) {
            return <Tag color="#0085ff">设备下发</Tag>
          } else if (record.warnManagers.length != 0) {
            return <Tag color="#0fc316">告警推送</Tag>
          }
        }
      },
      {
        title: '时间设定',
        key: 'daySetting',
        dataIndex: 'daySetting',
        className: 'no-flex',
        width: "20%",
        align: 'center',
        render: (text: any, record: any, idx: any) => {
          return (
            <div>
              {
                weekSplit(text.split(','))
              }
            </div>
          )
        }
      }
    ];
  }
}
export default columns