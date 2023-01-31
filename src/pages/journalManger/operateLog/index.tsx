import React, { useEffect, useState } from "react";
import { connect } from "dva";
import { Button, DatePicker, Form, Input, Modal, Pagination, Radio, Table, Select, Checkbox } from 'antd';
import { useAntdTable } from 'ahooks';
import type { PaginatedParams } from 'ahooks/lib/useAntdTable';
import globalStyle from '@/styles/global.less'
import { AllButton, ButBox, FormLineBox } from '@/commonStyles/commonTsx'
import columns from './column'
import styles from './index.module.less'
import commonStyle from '@/commonStyles/common.module.less'

import TimeChoose from '@/components/ActiveTimeChoose/timeChoose'

const { Column } = Table
const { Option } = Select
const User: React.FC<any> = (props) => {
  const { dispatch } = props;
  const [SELECTROWKEYS, setSELECTROWKEYS] = useState([]); // 列表多选框
  const [rowSelectedData, setRowSelectedData] = useState<Record<string, any>>({}); // 表格选中样式
  const [timeset, set_timeset] = useState([[], [], [], []]); // 存储时间数组 根据有多少的数组来算
  const [DETAIL, set_DETAIL] = useState();
  const onRowAction = (record: Record<string, any>, index?: number): any => {
    return {
      onClick: (e: any) => {
        setRowSelectedData(record);
      },
    };
  };
  const [form] = Form.useForm();
  const [form2] = Form.useForm();


  // 列表加载数据的方法
  //---------------
  const getTableData = (
    { current, pageSize }: PaginatedParams[0],
    formData: Object,
  ): Promise<any> => {
    return new Promise((resolve) => {
      dispatch({
        type: 'test/getRequestData',
        method: 'GET',
        url: '/testApi/v1/topics',
        payload: {
          pageNo: current,
          pageSize,
        },
        callback: (_data: any) => {
          console.log('_data', _data)
          let list = _data.data;
          let total = _data.total;
          resolve({
            list: list,
            total: total,
          });
        },
      });
    });
  };

  const { tableProps, search } = useAntdTable(getTableData, {
    defaultPageSize: 10,
  });
  const { submit, reset } = search;

  return <div className='right-main-box'>
    <div>
      <Form
        form={form}
        layout="vertical"
      >
        <div style={{ display: 'flex' }}>
          <Form.Item
            label=""
            name="uname1"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <FormLineBox >
              <span>操作账号</span>
              <Input />
            </FormLineBox>
          </Form.Item>

          <Form.Item
            label=""
            name="uname2"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <FormLineBox>
              <span>操作时间</span>
              <Input />
            </FormLineBox>
          </Form.Item>

          <Form.Item
            label=""
            name="uname2"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <FormLineBox>
              <span>操作类型</span>
              <Input />
            </FormLineBox>
          </Form.Item>

          <Form.Item
            label=""
            name="uname2"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <FormLineBox>
              <span>操作模块</span>
              <Input />
            </FormLineBox>
          </Form.Item>
          <ButBox type={'right'}>
            {
              AllButton('搜索', () => { }, { type: 'primary' })
            }
            {
              AllButton('重置', () => { }, {})
            }
          </ButBox>
        </div>
      </Form>
    </div>

    <div className={`${commonStyle['tableBox']}`}>
      {/* <Table columns={columns} rowKey="id" {...tableProps} /> */}
      {
        console.log(tableProps)
      }
      <Table
        rowKey="id"
        {...tableProps}
        pagination={{ ...tableProps.pagination, showQuickJumper: true }}
        // 如果当前行可选中则放开
        onRow={onRowAction}
      // className={`virtual-table  ${styles['scroll-table-box']}`}
      // rowClassName={(record: Record<string, any>) =>
      //   record.id === rowSelectedData.id ? styles['select-bg-color'] : ''
      // }
      >
        {columns.tableColumns
          ? columns.tableColumns(props, tableProps).map((i: any, idx: number) => {
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
      </Table>
    </div>
  </div >
};

export default connect(({ common, select }) => ({
  common,
  select
}))(User);
