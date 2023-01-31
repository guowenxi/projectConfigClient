import React, { useEffect, useState } from "react";
import { Button, DatePicker, Form, Input, Modal, Pagination, Radio, Table, Tabs } from 'antd';
import { connect } from "dva";
const { Column } = Table
class propstype {
  dataSource: any // 数据源
  tableColumn: any // 每列的表
  isedit: any | boolean // 是否可编辑的
}
const Page: React.FC<any> = (props, ref) => {
  let { dataSource, tableColumn, isedit } = props
  const [usedataSource, set_dataSource] = useState<any>([]);
  const [delList, set_delList] = useState<any>([]); // 删除list
  const [SELECTROWKEYS, setSELECTROWKEYS] = useState([]); // 列表多选框
  const getNewColumn = () => {
    let end: any = [];
    tableColumn.map((res: any) => {
      end.push(res.key)
    })
    return end
  }
  const [model, set_model] = useState<any>(getNewColumn());

  useEffect(() => {
    let data = JSON.parse(JSON.stringify(dataSource));
    set_dataSource([...data])
  }, [dataSource])

  React.useImperativeHandle(props.dom, () => ({
    fn() {
      return {
        data: usedataSource,
        delData: delList
      };
    }
  }))

  function randomString() {
    let str = "",
      arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
        'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k',
        'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v',
        'w', 'x', 'y', 'z'];
    for (let i = 0; i < 14; i++) {
      let rand = Math.floor(Math.random() * (arr.length - 1))
      str += arr[rand];
    }
    return str;
  }

  const addItem = () => {
    let newModel: any = []
    model.map((res: any) => {
      newModel[res] = undefined
    })
    newModel['tid'] = randomString();
    set_dataSource([...usedataSource, { ...newModel }])
  }

  const delItem = (record: any, idx: any) => {
    let end = window.confirm('确认删除？')
    if (!end) {
      return
    }
    let endData = [...usedataSource]
    if (!!endData[idx].id) {
      set_delList([...delList, endData[idx]])
    }
    endData.splice(idx, 1)
    set_dataSource([...endData])
  }

  const delMoreItem = () => {
    let end = window.confirm('确认删除？')
    if (!end) {
      return
    }
    let newdelList: any = [];
    let endData = [...usedataSource]
    SELECTROWKEYS.map((res: any, idx: any) => {
      endData.map((res1, idx1) => {
        if (res == res1.tid && res1.flexd != 1) {
          if (!!endData[idx1].id) {
            newdelList.push(endData[idx1])
          }
          endData.splice(idx1, 1)
        }
      })
    })
    set_delList([...delList, ...newdelList])
    set_dataSource([...endData])
  }

  return <>
    {/* <Button onClick={() => {
      console.log(usedataSource, '123456')
    }}>click me</Button> */}
    <Table
      rowKey="tid"
      dataSource={usedataSource}
      pagination={false}
      rowSelection={
        {
          type: 'checkbox',
          columnWidth: '5%',
          selectedRowKeys: SELECTROWKEYS,
          onChange: (selectedRowKeys: any) => {
            setSELECTROWKEYS(selectedRowKeys);
          }
        }
      }
    >
      {tableColumn
        ? tableColumn.map((i: any, idx: number) => {
          return (
            <Column
              key={idx}
              {...i}
              onCell={(): any => ({ width: i.width })}
              onHeaderCell={(): any => ({ width: i.width })}
            ></Column>
          );
        })
        : null}
      {(
        !!isedit ?
          <Column
            title={() => {
              return <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button
                  // style={{ marginRight: '5px' }} 
                  onClick={() => { addItem() }}>添加</Button>
                <Button
                  onClick={() => { delMoreItem() }}
                >
                  批量删除</Button>
              </div>
            }}
            width="5%"
            align='center'
            render={(text: any, record: any, idx: any) => {
              return (
                <div>
                  {
                    record.flexd != 1 ?
                      <a
                        onClick={() => {
                          delItem(record, idx)
                        }}
                        style={{ color: 'red' }}>删除</a>
                      :
                      <a style={{ color: 'gray' }}>删除</a>
                  }
                </div>
              );
            }}
          ></Column> : ''
      )}
    </Table>
  </>
}

export default connect(({ common, select }) => ({
  common,
  select
}))(Page);