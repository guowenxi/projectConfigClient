import React, { useEffect, useState } from "react";
import { connect } from "dva";
import { Button, DatePicker, Form, Input, Modal, Pagination, Radio, Table } from 'antd';
import { useAntdTable } from 'ahooks';
import type { PaginatedParams } from 'ahooks/lib/useAntdTable';
import globalStyle from '@/styles/global.less'
import { AllButton, ButBox } from '@/commonStyles/commonTsx'
import columns from './column'
import styles from './index.module.less'
import commonStyle from '@/commonStyles/common.module.less'
import TableInfo from '@/components/TableInfo/TableInfo';
import TABLEJSON from './TABLEJSON.json'
const { Column } = Table
const User: React.FC<any> = (props) => {
  const { dispatch } = props;
  const [SELECTROWKEYS, setSELECTROWKEYS] = useState([]); // 列表多选框
  const [rowSelectedData, setRowSelectedData] = useState<Record<string, any>>({}); // 表格选中样式
  const [DETAIL, set_DETAIL] = useState();

  const [modelVisitRole, set_modelVisitRole] = useState<any>(false);
  const [modelNameRole, set_modelNameRole] = useState<any>('');

  const [modelVisitUser, set_modelVisitUser] = useState<any>(false);
  const [modelVisitUserList, set_modelVisitUserList] = useState<any>(false);

  const [modalName, set_modalName] = useState<any>('');

  const onRowAction = (record: Record<string, any>, index?: number): any => {
    return {
      onClick: (e: any) => {
        setRowSelectedData(record);
      },
    };
  };
  // 列表加载数据的方法
  //---------------
  const getTableData = (
    { current, pageSize }: PaginatedParams[0],
    formData: Object,
  ): Promise<any> => {
    return new Promise((resolve) => {
      dispatch({
        type: 'common/getRequestData',
        method: 'GET',
        url: '/v1/projects',
        payload: {
          pageNo: current,
          pageSize,
        },
        callback: (_data: any) => {
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

  return <div className='right-main-box'>
    <div className="rightbox-headBox" style={{ justifyContent: 'space-between' }}>
      <ButBox type={'left'}>
        {
          AllButton('新增角色', () => { set_modelVisitRole(true), set_modelNameRole('新增角色') }, { type: 'add' })
        }
        {
          AllButton('新增用户', () => { set_modelVisitUser(true) }, { type: 'add' })
        }
        {
          AllButton('批量删除', () => { }, { type: 'delte' })
        }
      </ButBox>
      <ButBox type={'right'}>
        {
          AllButton('搜索', () => { }, { type: 'primary' })
        }
        {
          AllButton('重置', () => { },)
        }
      </ButBox>
    </div>
    <div className={`${commonStyle['tableBox']}`}>
      {/* <Table columns={columns} rowKey="id" {...tableProps} /> */}
      <Table
        rowKey="id"
        {...tableProps}
        pagination={{ ...tableProps.pagination, showQuickJumper: true }}
        // 如果要对列表进行多选的时候可以打开
        rowSelection={
          columns.checkBox
            ? {
              type: 'checkbox',
              columnWidth: '5%',
              selectedRowKeys: SELECTROWKEYS,
              onChange: (selectedRowKeys: any) => {
                setSELECTROWKEYS(selectedRowKeys);
              }
            }
            : undefined
        }
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
            width="10%"
            align='center'
            render={(text: any, record: any) => {
              return (
                <div>
                  <a
                    onClick={() => {
                      set_modelNameRole('编辑角色')
                      set_modelVisitRole(true)
                    }}
                    style={{ marginRight: '45px' }}>编辑</a>
                  <a style={{ color: 'red' }}>删除</a>
                </div>
              );
            }}
          ></Column>
        )}
      </Table>
    </div>
    {/* 角色 */}
    <Modal
      visible={modelVisitRole}
      footer={false}
      title={modelNameRole}
      width={"50%"}
      onCancel={() => { set_modelVisitRole(null) }}
    >
      <div style={{ display: 'flex' }}>
        <div style={{ width: '40%' }}>
          <Form
            layout="vertical"
            onFinish={() => {

            }}
            onFinishFailed={() => {

            }}
          >
            <Form.Item
              label="角色名称"
              name="uname1"
              rules={[{ required: true, message: 'Please input your username!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="操作权限"
              name="uname2"
              rules={[{ required: true, message: 'Please input your username!' }]}
            >
              <Radio.Group value={1}>
                <Radio value={1}>仅预览</Radio>
                <Radio value={2}>可操作</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item
              label="权限期限"
              name="uname3"
              rules={[{ required: true, message: 'Please input your username!' }]}
            >
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
          </Form>
        </div>
        <div>
        </div>
      </div>
    </Modal>

    {/* 用户 */}
    <Modal
      visible={modelVisitUser}
      title={'新增用户'}
      width={'30%'}
      footer={false}
      onCancel={() => { set_modelVisitUser(false) }}
    >
      <div>
        <Form
          layout="vertical"
          onFinish={() => {

          }}
          onFinishFailed={() => {

          }}
        >
          <Form.Item
            label="用户姓名"
            name="uname1"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="角色名称"
            name="uname1"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="手机号"
            name="uname1"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="密码"
            name="uname1"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </div>
    </Modal>

    {/*用户列表*/}
    <Modal
      visible={modelVisitUserList}
      footer={false}
      title={'成员查看'}
      width={'60%'}
      onCancel={() => {
        set_modelVisitUserList(false)
      }}
    >
      <Table
        rowKey="id"
        {...tableProps}
        // pagination={{ ...tableProps.pagination, showQuickJumper: true }}
        // 如果要对列表进行多选的时候可以打开
        rowSelection={
          columns.checkBox
            ? {
              type: 'checkbox',
              columnWidth: '5%',
              selectedRowKeys: SELECTROWKEYS,
              onChange: (selectedRowKeys: any) => {
                setSELECTROWKEYS(selectedRowKeys);
              }
            }
            : undefined
        }
        // 如果当前行可选中则放开
        onRow={onRowAction}
      // className={`virtual-table  ${styles['scroll-table-box']}`}
      // rowClassName={(record: Record<string, any>) =>
      //   record.id === rowSelectedData.id ? styles['select-bg-color'] : ''
      // }
      >
        {columns.tableColumns1
          ? columns.tableColumns1(props, tableProps).map((i: any, idx: number) => {
            return (
              <Column
                key={idx}
                {...i}
                onCell={(): any => ({ width: i.width })}
              // onHeaderCell={(): any => ({ width: i.width })}
              ></Column>
            );
          })
          : null}
        {(
          <Column
            title="操作"
            width="10%"
            align='center'
            render={(text: any, record: any) => {
              return (
                <div>
                  <a
                    onClick={() => {
                      set_modelNameRole('编辑角色')
                      set_modelVisitRole(true)
                    }}
                    style={{ marginRight: '45px' }}>编辑</a>
                  <a style={{ color: 'red' }}>删除</a>
                </div>
              );
            }}
          ></Column>
        )}
      </Table>
    </Modal>
  </div>
};

export default connect(({ common, select }) => ({
  common,
  select
}))(User);
