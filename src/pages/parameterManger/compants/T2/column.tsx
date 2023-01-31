import { Button, Input, Switch, Tag } from "antd";
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
  "tableColumns": (props?: any, tableProps?: any, methods?: any, listObj?: any) => {
    // let current:number=tableProps?.pagination.current;
    // let pageSize:number=tableProps?.pagination.pageSize;
    let { applyTypeList } = listObj
    return [
      {
        title: '属性名称',
        dataIndex: 'paramName',
        key: 'paramName',
        className: 'no-flex',
        width: "10%",
        align: 'center'
      },
      {
        title: '应用',
        key: 'describe',
        dataIndex: 'describe',
        className: 'no-flex',
        width: "10%",
        align: 'center',
        render: (text: any, record: any) => {
          let arry: any = record.applyType.split(',')
          let end: any = null;
          return <>
            {
              arry.map((res: any) => {
                if (res == 1) {
                  return <Tag color={'#0bd30e'}>设备</Tag>
                } else {
                  return <Tag color={'#00a6ff'}>
                    {
                      returnList(applyTypeList, res)
                    }
                  </Tag>
                }
              })
            }
          </>
          // 
        }
      },
      // {
      //   title: '角色期限',
      //   key: 'describe',
      //   dataIndex: 'describe',
      //   className: 'no-flex',
      //   width: "10%",
      //   align: 'center',
      //   render: (text: any, record: any) => {
      //     return <Switch checkedChildren="开启" unCheckedChildren="关闭" />
      //   }
      // },
    ];
  },
  otherTableColumns: (isedit: any, setfn?: any) => {
    return [
      {
        title: '参数名称',
        key: 'name',
        dataIndex: 'name',
        className: 'no-flex',
        width: "20%",
        align: 'center',
        render: (text: any, record: any) => {
          return (
            isedit == 1 ? <div>
              <Input
                defaultValue={text}
                maxLength={25}
                onInput={(e: any) => {
                  record.name = e.currentTarget.value
                }}
              /></div>
              :
              <div>{text}</div>
          )
        }
      },
    ];
  },
}

const returnList = (list, id) => {
  for (let i = 0; i < list.length; i++) {
    let nid = list[i].id;
    nid = parseInt(nid);
    console.log(parseInt(id.trim()), nid)
    if (nid == parseInt(id.trim())) {
      return list[i].name
    }
  }
}
export default columns