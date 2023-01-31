import React, { useEffect, useRef, useState } from "react";
import { connect } from "dva";
import { Button, DatePicker, Form, Input, message, Modal, Pagination, Radio, Select, Table } from 'antd';
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
  const [modalVisit, set_modalVisit] = useState<any>(false);
  const [modalName, set_modalName] = useState<any>('新增');

  const [searchInfo, set_searchInfo] = useState<any>({}) // 搜索框内容

  const [modealInfo, set_modealInfo] = useState<any>(null);

  const [applyTypes, set_applyTypes] = useState<any>([
    {
      key: '1',
      name: '设备'
    },
    {
      key: '2',
      name: '能耗表'
    }
  ])

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
  useEffect(() => {
    getTypeList()
  }, [])

  const getTableData = (
    { current, pageSize }: PaginatedParams[0],
    formData: Object,
  ): Promise<any> => {
    return new Promise((resolve) => {
      dispatch({
        type: 'common/getRequestData',
        method: 'GET',
        url: '/equipparapet/getEquipParapetList',
        payload: {
          pageNo: current,
          pageSize,
          ...searchInfo
        },
        callback: (_data: any) => {
          let list = _data.data;
          let total = _data.total;

          resolve({
            list: list,
            total: total,
          });
        },
        error: (error: any) => {
          message.warn(error)
        },
      });
    });
  };

  const { tableProps, search } = useAntdTable(getTableData, {
    defaultPageSize: 10,
  });

  const { submit, reset } = search

  const getTypeList = () => {
    dispatch({
      type: 'common/getRequestData',
      method: 'GET',
      url: '/equipparapet/getApplyTypeList',
      payload: {

      },
      callback: (_data: any) => {
        set_applyTypes(_data)
      },
      error: (error: any) => {
        message.warn(error)
      },
    });
  }

  //  添加属性
  const addAttribute = async () => {
    await form.validateFields()
    let data = form.getFieldsValue()
    data.applyType = data.applyType.join(',')

    let flag = false

    let data2 = getChildData().data;
    data2.map((res: any) => {
      if (!!!res.name) {
        flag = true
      }
    })

    if (flag) {
      message.error('参数名称为空')
      return
    }

    dispatch({
      type: 'common/getRequestData',
      method: 'post',
      url: '/equipparapet/addtEquipParapet',
      payload: {
        ...data,
        equipparapetList: [
          ...data2
        ]
      },
      callback: (_data: any) => {
        message.success('添加成功')
        set_modalVisit(false)
        submit()
      },
      error: (error: any) => {
        message.warn(error)
      },
    });
  }

  //  删除
  const del = (id?: any, ids?: any) => {
    let flage = window.confirm('确认删除')
    if (!flage) {
      return
    }
    dispatch({
      type: 'common/getRequestData',
      method: 'post',
      url: '/equipparapet/delManyItems',
      payload: {
        id,
        ids
      },
      callback: (_data: any) => {
        message.success('删除成功')
        submit()
      },
      error: (error: any) => {
        message.warn(error)
      },
    });
  }

  // 查看详情
  const getDetail = (id: any) => {
    dispatch({
      type: 'common/getRequestData',
      method: 'get',
      url: '/equipparapet/getDetailbyid',
      payload: {
        id
      },
      callback: (_data: any) => {
        let newArry = _data.applyType.split(',')
        let newAry: any = []
        newArry.map((res) => {
          newAry.push(+res)
        })
        _data.applyType = newAry
        form.setFieldsValue(_data)
        _data.equipparapetList.map((res: any, idx: any) => {
          return res.tid = _data.attributeId + idx
        })
        set_modealInfo(_data)
      },
      error: (error: any) => {
        message.warn(error)
      },
    });
  }

  // 修改详情
  const changeDetail = () => {
    let obj = getChildData()
    console.log(obj)
    let info = form.getFieldsValue()
    info.applyType = info.applyType.join(',')
    dispatch({
      type: 'common/getRequestData',
      method: 'post',
      url: '/equipparapet/editEquipparapet',
      payload: {
        id: modealInfo.id,
        attributeId: modealInfo.attributeId,
        ...info,
        equipparapetList: obj.data,
        removeList: obj.delData
      },
      callback: (_data: any) => {
        message.success('编辑成功')
        set_modealInfo(null)
        set_modalVisit(false)
        submit()
      },
      error: (error: any) => {
        message.warn(error)
      },
    });
  }

  const getChildData = () => {
    return dom.current.fn()
  }

  return <div className='right-main-box' style={{position:"relative",  height: '93%' }}>

    <div className="rightbox-headBox" style={{ justifyContent: 'space-between' }}>
      <ButBox type={'left'}>
        {
          AllButton('新增', () => { set_modalVisit(true), set_modalName('新增'), form.resetFields(), set_modealInfo(null) }, { type: 'add' })
        }

        {
          AllButton('批量删除', () => { del(null, SELECTROWKEYS) }, { type: 'delte' })
        }
      </ButBox>
      <div style={{ display: 'flex' }}>
        <FormLineBox lableWidth={'3.2vw'} style={{ marginBottom: '15px' }}>
          <span>关键字</span>
          <Input
            placeholder="属性名称"
            value={searchInfo.key}
            onInput={(e1: any) => {
              set_searchInfo({
                ...searchInfo,
                key: e1.target.value
              })
            }}
          />
        </FormLineBox>
        <ButBox type={'right'}>
          {
            AllButton('搜索', () => { submit() }, { type: 'primary' })
          }
          {
            AllButton('重置', () => { set_searchInfo({}); setTimeout(() => { reset() }, 200); }, {})
          }
        </ButBox>
      </div>

    </div>

    <div className={`${commonStyle['tableBox']}`}>
      {/* <Table columns={columns} rowKey="id" {...tableProps} /> */}
      <Table
        rowKey="attributeId"
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
          ? columns.tableColumns(props, tableProps, null, {
            applyTypeList: applyTypes
          }).map((i: any, idx: number) => {
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
                  <a onClick={() => { set_modalName('编辑参数'), set_modalVisit(true), getDetail(record.id) }} style={{ marginRight: '15px' }}>编辑参数</a>
                  <a onClick={() => {
                    del(record.attributeId, null)
                  }} style={{ color: 'red' }}>删除</a>
                </div>
              );
            }}
          ></Column>
        )}
      </Table>
    </div>
    {
      modalVisit ?
        <Modal
          visible={modalVisit}
          footer={false}
          title={modalName}
          width={"32%"}
          onCancel={() => { set_modalVisit(false) }}
        >
          <div>
            <Form
              form={form}
              layout="vertical"
              onFinish={() => {
              }}
              onFinishFailed={() => {
              }}
            >
              <Form.Item
                label="属性名称"
                name="paramName"
                rules={[{ required: true, message: '请输入属性名称' }]}
              >
                <Input maxLength={8} />
              </Form.Item>
              <Form.Item
                label="应用"
                name="applyType"
                rules={[{ required: true, message: '请选择应用类型' }]}
              >

                <Select
                  mode="multiple"
                  style={{ width: '100%' }}
                // onChange={handleChange}
                >
                  {
                    applyTypes.map((res: any) => {
                      return <Option value={res.id} key={res.id}>{res.name}</Option>
                    })
                  }
                </Select>
              </Form.Item>

              <div style={{ overflow: 'auto', maxHeight: '350px', padding: '0px 8px' }}>
                <ActiveTable
                  dataSource={
                    !!modealInfo?.equipparapetList ?
                      [
                        ...modealInfo?.equipparapetList
                      ] : []
                  }
                  tableColumn={
                    columns.otherTableColumns(true)
                  }
                  dom={dom}
                  isedit={1}
                >
                </ActiveTable>
              </div>

              <div style={{ padding: '20px 0px 5px', display: 'flex', justifyContent: 'center' }}>
                <ButBox type={'left'} >
                  {
                    AllButton('取消', () => {
                      set_modalVisit(false)
                    }, { type: '' })
                  }
                  <Button type="primary"
                    onClick={() => {
                      modalName == '新增' ?
                        addAttribute() :
                        changeDetail()
                    }}>确认</Button>
                </ButBox>
              </div>
            </Form>
          </div>
        </Modal>
        : ''
    }
  </div>
};

export default connect(({ common, select }) => ({
  common,
  select
}))(User);
