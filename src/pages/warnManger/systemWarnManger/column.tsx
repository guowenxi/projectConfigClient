import { Switch } from "antd";
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
        title: '报警名称',
        dataIndex: 'name',
        key: 'name',
        className: 'no-flex',
        width: "10%",
        align: 'center'
      },
      {
        title: '设备组',
        dataIndex: 'DeviceGroupName',
        key: 'DeviceGroupName',
        className: 'no-flex',
        width: "10%",
        align: 'center',
        render: (text: any, record: any) => {
          return record.deviceGroupInfo.DeviceGroupName
        }
      },
      {
        title: '设备名',
        dataIndex: 'EquipList',
        key: 'EquipList',
        className: 'no-flex',
        width: "10%",
        align: 'center',
        render: (text: any, record: any) => {
          let end: any = [];
          record.EquipList.map((res: any) => {
            end.push(res.name)
          })
          return end.join(',')
        }
      },
      {
        title: '参数项',
        key: 'DevicegroupitemsName',
        dataIndex: 'DevicegroupitemsName',
        className: 'no-flex',
        width: "10%",
        align: 'center',
        render: (text: any, record: any) => {
          return record.deviceGroupInfo.DevicegroupitemsName
        }
        // render: (text: any, record: any) => {
        //   return <Switch checkedChildren="开启" unCheckedChildren="关闭" />
        // }
      },
      {
        title: '报警类型',
        key: 'alarmValue',
        dataIndex: 'alarmValue',
        className: 'no-flex',
        width: "10%",
        align: 'center'
      },
      {
        title: '正常范围',
        key: 'alarmRangType',
        dataIndex: 'alarmRangType',
        className: 'no-flex',
        width: "10%",
        align: 'center',
        render: (text: any, record: any) => {
          let { rangList } = record
          if (rangList.length == 0) {
            return '无'
          }

          if (text == 1) {
            let one = rangList[0]
            if (one['warnValue'] == 0) {
              return 1
            } else {
              return 0
            }
          } else if (text == 2) {
            let l = ''
            let h = ''
            rangList.map((res: any, any: any) => {
              if (res.warnType == 2) {
                l = res.warnValue
              } else if (res.warnType == 3) {
                h = res.warnValue
              }
            })
            return l + '~' + h
          }

        }
      },
    ];
  }
}
export default columns