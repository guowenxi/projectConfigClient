import React, { useEffect, useRef, useState } from "react";
import { connect } from "dva";
import { Button, DatePicker, Form, Input, Modal, Pagination, Radio, Select, Table, Tabs, Transfer } from 'antd';
import { useAntdTable } from 'ahooks';
import type { PaginatedParams } from 'ahooks/lib/useAntdTable';
import globalStyle from '@/styles/global.less'
import { AllButton, ButBox, FormLineBox } from '@/commonStyles/commonTsx'
import columns from './column'
import styles from './index.module.less'
import commonStyle from '@/commonStyles/common.module.less'

import ActiveTable from '@/components/ActivityTable/index'

const { Column } = Table
const { Option } = Select

const User: React.FC<any> = (props) => {
  const { dispatch } = props;
  const dom: any = useRef();
  const [SELECTROWKEYS, setSELECTROWKEYS] = useState([]); // 列表多选框
  const [rowSelectedData, setRowSelectedData] = useState<Record<string, any>>({}); // 表格选中样式
  const [DETAIL, set_DETAIL] = useState();
  const [name, set_name] = useState(true);

  const [modelVisit1, set_modelVisit1] = useState<any>(false);
  const [modelName1, set_modelName1] = useState<any>(false);

  const [modelVisit2, set_modelVisit2] = useState<any>(false);

  const [modelVisit3, set_modelVisit3] = useState<any>(false);

  const [mockData, setMockData] = useState<any[]>([
    {
      key: '',
      title: '123',
      description: '234'
    }

  ]);
  const [targetKeys, setTargetKeys] = useState<string[]>([]);

  const onRowAction = (record: Record<string, any>, index?: number): any => {
    return {
      onClick: (e: any) => {
        setRowSelectedData(record);
      },
    };
  };

  const [form] = Form.useForm();

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

  const getChildData = () => {
    let end = dom.current.fn()
  }

  return <div className='right-main-box' style={{ height: '92%' }} >
    <div className="rightbox-headBox" style={{ justifyContent: 'space-between' }}>
      <ButBox type={'left'}>
        {
          AllButton('添加设备', () => { set_modelName1('添加设备'), set_modelVisit1(true) }, { type: 'add' })
        }
        {
          AllButton('批量删除', () => { }, { type: 'delte' })
        }
        {/* {
          AllButton('导入', () => { }, { type: 'primary' })
        }
        {
          AllButton('导出', () => { }, { type: 'primary' })
        } */}
      </ButBox>
      <div style={{ display: "flex" }}>
        <FormLineBox>
          <span>设备类型</span>
          <Input />
        </FormLineBox>
        <FormLineBox>
          <span>关键字</span>
          <Input />
        </FormLineBox>
        <ButBox type={'right'}>
          {
            AllButton('搜索', () => { }, { type: 'primary' })
          }
          {
            AllButton('重置', () => { },)
          }
        </ButBox>
      </div>

    </div>

    <div className={`${commonStyle['tableBox']}`}>
      {/* <Table columns={columns} rowKey="id" {...tableProps} /> */}
      <Table
        rowKey="id"
        {...tableProps}
        pagination={{ ...tableProps.pagination, showQuickJumper: true }}
        // 如果要对列表进行多选的时候可以打开
        // rowSelection={
        //   columns.checkBox
        //     ? {
        //       type: 'checkbox',
        //       columnWidth: '5%',
        //       selectedRowKeys: SELECTROWKEYS,
        //       onChange: (selectedRowKeys: any) => {
        //         setSELECTROWKEYS(selectedRowKeys);
        //       }
        //     }
        //     : undefined
        // }
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
        {(
          <Column
            title="操作"
            width="40%"
            align='center'
            render={(text: any, record: any) => {
              return (
                <div>
                  <a onClick={() => { set_modelName1('编辑设备'), set_modelVisit1(true) }} style={{ marginRight: '15px' }}>编辑</a>
                  <a onClick={() => { set_modelVisit3(true) }} style={{ marginRight: '15px' }}>点位绑定</a>
                  <a onClick={() => { set_modelVisit2(true) }} style={{ marginRight: '15px' }}>点位配置</a>
                  <a style={{ color: 'red' }}>删除</a>
                </div>
              );
            }}
          ></Column>
        )}
      </Table>
    </div>

    <Modal
      title={modelName1}
      visible={modelVisit1}
      footer={false}
      width={'50%'}
      onCancel={() => {
        set_modelVisit1(false)
      }}
    >
      <Form
        form={form}
        layout="vertical"
      >
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>

          <div style={{ width: '47%' }}>
            <Form.Item
              label="设备编号"
              name="uname1"
              rules={[{ required: true, message: 'Please input your username!' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="设备名称"
              name="uname1"
              rules={[{ required: true, message: 'Please input your username!' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="设备组"
              name="uname1"
              rules={[{ required: true, message: 'Please input your username!' }]}
            >
              <Select
                style={{ width: '100%' }}
                defaultValue="lucy"
              // onChange={handleChange}
              >
                <Option value="jack">Jack</Option>
                <Option value="lucy">Lucy</Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="表分类"
              name="uname1"
              rules={[{ required: true, message: 'Please input your username!' }]}
            >
              <Select
                style={{ width: '100%' }}
                defaultValue="lucy"
              // onChange={handleChange}
              >
                <Option value="jack">Jack</Option>
                <Option value="lucy">Lucy</Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="总表编号"
              name="uname1"
              rules={[{ required: true, message: 'Please input your username!' }]}
            >
              <Input />
            </Form.Item>
          </div>

          <div style={{ width: '47%' }}>
            <Form.Item
              label="楼层"
              name="uname1"
              rules={[{ required: true, message: 'Please input your username!' }]}
            >
              <Select
                style={{ width: '100%' }}
                defaultValue="lucy"
              // onChange={handleChange}
              >
                <Option value="jack">Jack</Option>
                <Option value="lucy">Lucy</Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="区域"
              name="uname1"
              rules={[{ required: true, message: 'Please input your username!' }]}
            >
              <Select
                style={{ width: '100%' }}
                defaultValue="lucy"
              // onChange={handleChange}
              >
                <Option value="jack">Jack</Option>
                <Option value="lucy">Lucy</Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="用电分项"
              name="uname1"
              rules={[{ required: true, message: 'Please input your username!' }]}
            >
              <Select
                style={{ width: '100%' }}
                defaultValue="lucy"
              // onChange={handleChange}
              >
                <Option value="jack">Jack</Option>
                <Option value="lucy">Lucy</Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="计费方式"
              name="uname1"
              rules={[{ required: true, message: 'Please input your username!' }]}
            >
              <Select
                style={{ width: '100%' }}
                defaultValue="lucy"
              // onChange={handleChange}
              >
                <Option value="jack">Jack</Option>
                <Option value="lucy">Lucy</Option>
              </Select>
            </Form.Item>

          </div>

        </div>
      </Form>
    </Modal>

    <Modal
      visible={modelVisit2}
      onCancel={() => {
        set_modelVisit2(false)
      }}
      width={'50%'}
      footer={false}
      title={'点位配置'}
    >
      <Tabs>
        <Tabs.TabPane tab="基本参数" key="item-1">
        </Tabs.TabPane>
        <Tabs.TabPane tab="读取" key="item-2">
        </Tabs.TabPane>
        <Tabs.TabPane tab="下发" key="item-3">
        </Tabs.TabPane>
      </Tabs>
      <ActiveTable
        dataSource={
          [
            {
              id: 0
            },
            {
              id: 1
            },
          ]
        }
        tableColumn={
          columns.otherTableColumns(true)
        }
        isedit={1}
        dom={dom}
      >

      </ActiveTable>
    </Modal>

    <Modal
      visible={modelVisit3}
      onCancel={() => {
        set_modelVisit3(false)
      }}
      width={'50%'}
      footer={false}
      title={'点位绑定'}
    >
      <div className={`${styles['multipleChoiceBox']}`}>
        <div className={`${styles['titleBox']}`}>
          <span>全部点位列表</span>
          <span>设备点位列表</span>
        </div>
        <Transfer
          showSearch
          dataSource={mockData}
          // titles={['Source', 'Target']}
          // targetKeys={targetKeys}
          // selectedKeys={selectedKeys}
          // onChange={handleChange}
          // onSelectChange={handleSelectChange}
          // onScroll={handleScroll}
          render={item => item.title}
          // disabled={disabled}
          oneWay={true}
          style={{ width: '100%' }}
        />
      </div>
    </Modal>

  </div >
};

export default connect(({ common, select }) => ({
  common,
  select
}))(User);
