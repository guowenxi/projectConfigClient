import React, { useEffect, useRef, useState } from "react";
import { connect } from "dva";

import { Button, DatePicker, Table, Select, Checkbox, Row, Col, Tabs, Tag } from 'antd';
const { Column } = Table
const { Option } = Select

import styles from './index.module.less'

export declare type FormLayout = 'inline' | 'vertical'; // inline 直线  vertical 一行行

class propsType {
  layout?: any | FormLayout // 排列样式
  dataScore?: any // 数据源
  dom: any
}


const User: React.FC<any> = (props: propsType) => {

  var checkBoxs1 = [
    {
      value: '112',
      id: '1'
    },
    {
      value: '22',
      id: '2'
    },
  ]

  const { layout, dataScore, dom } = props

  useEffect(() => {
    let newArry: any = []
    !!dataScore && dataScore.map((res) => {
      newArry.push(res.id)
    })
    set_plainOptions(newArry)
  }, [
    dataScore
  ])

  const [checkBoxs, set_checkBoxs] = useState<any>(dataScore); // 数据源

  const [plainOptions, set_plainOptions] = useState<any>([]);

  const [checkedList, setCheckedList] = useState<any>([]); // 选中的项的列表 

  const [indeterminate, setIndeterminate] = useState(false);  // 是否全选的样式

  const [checkAll, setCheckAll] = useState(false); // check全部的值

  React.useImperativeHandle(dom, () => ({
    fn() {
      return {
        // delData: []
      };
    }
  }))

  const onChange = (list: any[]) => {
    setCheckedList(list);
    setIndeterminate(!!list.length && list.length < plainOptions.length);
    setCheckAll(list.length === plainOptions.length);
  };

  const onCheckAllChange = (e: any) => {
    setCheckedList(e.target.checked ? plainOptions : []);
    setIndeterminate(false);
    setCheckAll(e.target.checked);
  };

  return <>
    {
      layout == 'inline' ?
        <>
          <Checkbox indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll}>
            全部
          </Checkbox>

          <Checkbox.Group style={{ width: '100%' }}
            value={checkedList}
            onChange={
              (e1: any, e2: any) => {
                onChange(e1)
              }
            }>
            <Row>
              {
                !!checkBoxs && checkBoxs.map((res: any, idx: any) => {
                  return <Col span={3}>
                    <Checkbox
                      value={res.id}
                      onChange={(e) => {
                        // debugger
                        // onChange(e)
                      }}
                    >{res.value}</Checkbox>
                  </Col>
                })
              }
            </Row>
          </Checkbox.Group>
        </>
        :
        ''
    }
  </>
}

export default connect(({ common, select }) => ({
  common,
  select
}))(User);