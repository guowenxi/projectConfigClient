import { Input, Select, Switch } from "antd";
import React from "react";
import { render } from "react-dom";
const { Option } = Select
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
  "tableColumns": (props?: any, tableProps?: any, methods?: any, typeList?: any) => {
    // let current:number=tableProps?.pagination.current;
    // let pageSize:number=tableProps?.pagination.pageSize;
    let { deviceTypeList } = typeList
    console.log(deviceTypeList)
    return [
      {
        title: '设备编号',
        dataIndex: 'equipNumber',
        key: 'equipNumber',
        className: 'no-flex',
        width: "240",
        align: 'center'
      },
      {
        title: '设备名称',
        key: 'name',
        dataIndex: 'name',
        className: 'no-flex',
        width: "240",
        align: 'center',
      },
      {
        title: '设备组',
        key: 'deviceGroupName',
        dataIndex: 'deviceGroupName',
        className: 'no-flex',
        width: "250",
        align: 'center',
      },
      {
        title: '计费方式',
        key: 'chargingMethodsValue',
        dataIndex: 'chargingMethodsValue',
        className: 'no-flex',
        width: "150",
        align: 'center',
      },
      {
        title: '表分类',
        key: 'electricitymeterType',
        dataIndex: 'electricitymeterType',
        className: 'no-flex',
        width: "150",
        align: 'center',
        render: (text: any, record: any) => {
          if (text == 1) {
            return '分表'
          } else {
            return '总表'
          }
        }
      },
      {
        title: '总表编号',
        key: 'electricitymeterNumber',
        dataIndex: 'electricitymeterNumber',
        className: 'no-flex',
        width: "250",
        align: 'center',
        render: (text: any, record: any) => {
          if (!!text) {
            return text
          } else {
            return '-'
          }
        }
      },
    ];
  },
  otherTableColumns: (isedit: any, setfn?: any, select?: any) => {
    return [
      {
        title: '数据项',
        key: 'name',
        dataIndex: 'name',
        className: 'no-flex',
        width: "20%",
        align: 'center',
        render: (text: any, record: any) => {
          return (
            false ? <div><Input
              onInput={(e: any) => {
                record.name = e.currentTarget.value
              }}
            /></div> : <div>{text}</div>
          )
        }
      },
      {
        title: '参数名称',
        key: 'stateName',
        dataIndex: 'stateName',
        className: 'no-flex',
        width: "20%",
        align: 'center',
        render: (text: any, record: any) => {
          return (
            false ? <div><Input
              onInput={(e: any) => {
                record.name = e.currentTarget.value
              }}
            /></div> : <div>{text}</div>
          )
        }
      },
      {
        title: '数据源',
        key: 'dataSource',
        dataIndex: 'dataSource',
        className: 'no-flex',
        width: "20%",
        align: 'center',
        render: (text: any, record: any) => {
          return (
            true ? <div>
              {/* <Input
                onInput={(e: any) => {
                  record.name = e.currentTarget.value
                }}
              /> */}
              <Select
                style={{ width: '100%' }}
                defaultValue={text}
                onChange={
                  (e1, e2) => {
                    record.dataSource = e1
                  }
                }
              >
                {
                  select.dataScoureList.map((res, idx) => {
                    return <Option value={res.id} key={res.name}>{res.modalName + '-' + res.name}</Option>
                  })
                }
              </Select>
            </div > : <div>{text}</div>
          )
        }
      },
    ];
  },
}
export default columns