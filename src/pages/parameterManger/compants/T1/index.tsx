import React, { useEffect, useRef, useState } from "react";
import { connect } from "dva";
import { Button, DatePicker, Form, Input, message, Modal, Pagination, Radio, Select, Table, Tabs } from 'antd';
import { useAntdTable } from 'ahooks';
import type { PaginatedParams } from 'ahooks/lib/useAntdTable';
import globalStyle from '@/styles/global.less'
import { AllButton, ButBox, FormLineBox } from '@/commonStyles/commonTsx'
import columns from './column'
import styles from './index.module.less'
import commonStyle from '@/commonStyles/common.module.less'
import ActiveTable from '@/components/ActivityTable/index'

const { Option } = Select
const { Column } = Table

const User: React.FC<any> = (props) => {
  const { dispatch } = props;

  const dom1: any = useRef();
  const dom2: any = useRef();
  const dom3: any = useRef();

  const [SELECTROWKEYS, setSELECTROWKEYS] = useState([]); // 列表多选框
  const [rowSelectedData, setRowSelectedData] = useState<Record<string, any>>({}); // 表格选中样式
  const [DETAIL, set_DETAIL] = useState();
  const [name, set_name] = useState(true);

  const [searchInfo, set_searchInfo] = useState<any>({}) // 搜索框内容

  const [equipTypeId, set_equipTypeId] = useState<any>(null); // 存储设备类型

  const [modalSate1, set_modalSate1] = useState(false);
  const [modalName1, set_modalName1] = useState('编辑');
  const [detailInfo, set_detailInfo] = useState<any>({});

  const [equipTypeList, set_equipTypeList] = useState<any>([]);
  const [flexdList, set_flexdList] = useState<any>(null); // 存储固定项的数据

  const [basicList, set_basicList] = useState<any>(null);
  const [issuedList, set_issuedList] = useState<any>(null);
  const [readList, set_readList] = useState<any>(null);
  const [endAllList, set_endAllList] = useState<any>({})

  const [form] = Form.useForm();



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
        url: '/devicegroupManger/getDeviceGroupList',
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
        }
      });
    });
  };

  const { tableProps, search } = useAntdTable(getTableData, {
    defaultPageSize: 10,
  });
  const { submit } = search
  useEffect(() => {
    getList()
  }, [])

  const getList = () => {
    dispatch({
      type: 'common/getRequestData',
      method: 'GET',
      url: '/devicegroupManger/getEquipTypeList',
      payload: {
      },
      callback: (_data: any) => {
        set_equipTypeList(_data)
      },
      error: (error: any) => {
        message.warn(error)
      },
    });

  }

  // 获取固定属性的列表
  const getFlexdItemeList = (deveiceTypeId: any) => {
    dispatch({
      type: 'common/getRequestData',
      method: 'GET',
      url: '/devicegroupManger/getFlexdItemeList',
      payload: {
        deveiceTypeId
      },
      error: (error: any) => {
        message.warn(error)
      },
      callback: (_data: any) => {
        set_flexdList(_data)

        const { basicList, issuedList, readList } = _data;
        basicList.map((res: any, idx: any) => {
          return res.tid = 'bs' + idx
        })
        readList.map((res: any, idx: any) => {
          return res.tid = 'rl' + idx
        })
        issuedList.map((res: any, idx: any) => {
          return res.tid = 'il' + idx
        })

        set_basicList(basicList)
        set_readList(readList)
        set_issuedList(issuedList)
      },
    });
  }

  const addModalOpen = () => {
    form.resetFields()
    set_equipTypeId(null)
    set_modalSate1(true)
    set_modalName1('新增')
  }

  const clearColunmData = () => {
    set_basicList(null)
    set_readList(null)
    set_issuedList(null)
  }

  // 添加数据
  const addOne = async () => {

    await form.validateFields()

    let listData = getChildData();
    let endData: any = [];
    let flag = false
    // let delData = [];

    const { basicList, readList, issuedList } = listData;

    const addInfo = (data: any, type: number) => {
      data.map((res: any, idx: any) => {
        if (!!!res.name || !!!res.stateName) {
          flag = true
        }
        res.type = type
        return res
      })
      endData = [...endData, ...data]
    }

    if (basicList != null) {
      addInfo(basicList.data, 1);
    }

    if (readList != null) {
      addInfo(readList.data, 2);
    }

    if (issuedList != null) {
      addInfo(issuedList.data, 3);
    }

    if (flag) {
      message.error('数据项或参数名称为空')
      return
    }
    let data = form.getFieldsValue()

    // message.info('处理中，请勿重复点击')

    dispatch({
      type: 'common/getRequestData',
      method: 'post',
      url: '/devicegroupManger/addDeviceGroup',
      payload: {
        ...data,
        Devicegroupitems: endData
      },
      error: (error: any) => {
        message.warn(error)
      },
      callback: (_data: any) => {
        message.success('添加成功')
        clearColunmData()
        submit()
        set_modalSate1(false)
      },
    });
  }

  const getChildData = () => {
    let end1 = null
    let end2 = null
    let end3 = null
    if (!!dom1.current?.fn()) {
      end1 = dom1.current.fn()
    }
    if (!!dom2.current?.fn()) {
      end2 = dom2.current.fn()
    }
    if (!!dom3.current?.fn()) {
      end3 = dom3.current.fn()
    }
    return {
      basicList: end1,
      readList: end2,
      issuedList: end3
    }
  }

  // 查看详情
  const getDetail = (id: any) => {
    dispatch({
      type: 'common/getRequestData',
      method: 'GET',
      url: '/devicegroupManger/getDeviceGroupDetail',
      payload: {
        id
      },
      error: (error: any) => {
        message.warn(error)
      },
      callback: (_data: any) => {

        set_equipTypeId(_data.type)

        form.setFieldsValue(_data)

        let { dataItemList } = _data

        let basicList: any = []
        let readList: any = []
        let issuedList: any = []

        dataItemList.map((res: any, idx: any) => {
          res.tid = 'r' + res.type + idx
          if (res.type == 1) {
            basicList.push(res)
          } else if (res.type == 2) {
            readList.push(res)
          } else if (res.type == 3) {
            issuedList.push(res)
          }
        })

        set_basicList(basicList)
        set_readList(readList)
        set_issuedList(issuedList)
      },
    });
  }

  // 更新内容
  const updataDetail = () => {
    let listData = getChildData();
    const { basicList, readList, issuedList } = listData;
    let data1 = form.getFieldsValue();
    let endData: any = []
    let removeList: any = []
    const addInfo = (data: any, type: number) => {
      let state = true ; 
      for(const item of data){
        item.type = type;
        if(!item.name || !item.stateName){
          state =false;
          break;
        }
      }
      
      endData = [...endData, ...data];
      return state;
    }
    Object.keys(listData).map((key,idx)=>{
      if(listData[key] != null){
        if(!addInfo(listData[key]['data'], idx+1)){
          alert("请输入完整内容,或删除空内容")
          return false;
        }else{
          removeList = [...removeList, ...listData[key]['delData']]
        }
      }
    })

    // message.info('处理中，请勿重复点击')
    dispatch({
      type: 'common/getRequestData',
      method: 'post',
      url: '/devicegroupManger/updataData',
      payload: {
        deviceGroupId: detailInfo.deviceGroupId,
        ...data1,
        Devicegroupitems: [...endData],
        removeList
      },
      callback: (_data: any) => {
        message.success('编辑成功')
        clearColunmData()
        set_modalSate1(false)
        submit()
      },
      error: (error: any) => {
        message.warn(error)
      }
    });

  }

  // 删除数据
  const delData = (id?: any, ids?: any) => {
    let flage = window.confirm('确认删除')
    if (!flage) {
      return
    }
    dispatch({
      type: 'common/getRequestData',
      method: 'post',
      url: '/devicegroupManger/delDeviceGroup',
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
      }
    });
  }

  return <div className='right-main-box' style={{position:"relative",  height: '93%' }}>
    <div className="rightbox-headBox" style={{ justifyContent: 'space-between' }}>
      <ButBox type={'left'}>
        {
          AllButton('新增', () => { addModalOpen() }, { type: 'add' })
        }
        {
          AllButton('批量删除', () => {
            delData(null, SELECTROWKEYS)
          }, { type: 'delte' })
        }
      </ButBox>
      <div style={{ display: "flex" }}>
        <FormLineBox>
          <span>关键字</span>
          <Input
            value={searchInfo['key']}
            placeholder="设备组名称"
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
            AllButton('重置', () => { set_searchInfo({}), setTimeout(() => { submit() }, 200); })
          }
        </ButBox>
      </div>
    </div>

    <div className={`${commonStyle['tableBox']}`}>
      {/* <Table columns={columns} rowKey="id" {...tableProps} /> */}
      <Table
        rowKey="deviceGroupId"
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
                      set_modalSate1(true)
                      set_modalName1('编辑')
                      getDetail(record.deviceGroupId)
                      set_detailInfo(record)
                    }}
                    style={{ marginRight: '15px' }}>编辑</a>
                  <a
                    onClick={() => {
                      delData(record.deviceGroupId)
                    }}
                    style={{ color: 'red' }}>删除</a>
                </div>
              );
            }}
          ></Column>
        )}
      </Table>
    </div>

    {
      modalSate1 ?
        <Modal
          visible={modalSate1}
          footer={false}
          title={modalName1}
          width={"50%"}
          onCancel={
            () => {
              clearColunmData()
              set_modalSate1(false)
            }
          }
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
                label="设备组名称"
                name="name"
                rules={[{ required: true, message: '请输入设备组名称!' }]}
              >
                <Input maxLength={30} />
              </Form.Item>
              <Form.Item
                label="设备类型"
                name="type"
                rules={[{ required: true, message: '请选择设备类型!' }]}
              >
                <Select
                  style={{ width: '100%' }}
                  disabled={modalName1 == '编辑'}
                  onChange={
                    (e1, e2) => {
                      set_equipTypeId(e1)
                      getFlexdItemeList(e1)
                    }
                  }
                >
                  {
                    equipTypeList.map((res: any) => {
                      return <Option value={res.id}>{res.name}</Option>
                    })
                  }

                </Select>
              </Form.Item>
            </Form>

            {
              equipTypeId != null ?
                <Tabs type='card'
                  onTabClick={(e) => {

                  }}>
                  <Tabs.TabPane tab="基本数据" key="item-1">
                    <div className={`${styles['ovreflowStyle']}`}>
                      <ActiveTable
                        dataSource={
                          basicList != null ?
                            [
                              ...basicList
                            ] : []
                        }
                        tableColumn={
                          columns.otherTableColumns(true)
                        }
                        isedit={1}
                        dom={dom1}
                      >
                      </ActiveTable>
                    </div>
                  </Tabs.TabPane>

                  <Tabs.TabPane tab="读取" key="itemn-2">
                    <div className={`${styles['ovreflowStyle']}`}>
                      <ActiveTable
                        dataSource={
                          readList != null ?
                            [
                              ...readList
                            ] : []
                        }
                        tableColumn={
                          columns.otherTableColumns(true)
                        }
                        isedit={1}
                        dom={dom2}
                      >
                      </ActiveTable>
                    </div>
                  </Tabs.TabPane>

                  <Tabs.TabPane tab="下发" key="item-3">
                    <div className={`${styles['ovreflowStyle']}`}>
                      <ActiveTable
                        dataSource={
                          issuedList != null ?
                            [
                              ...issuedList
                            ] : []
                        }
                        tableColumn={
                          columns.otherTableColumns(true)
                        }
                        isedit={1}
                        dom={dom3}
                      >
                      </ActiveTable>
                    </div>
                  </Tabs.TabPane>
                </Tabs>
                : ''
            }

            <div style={{ padding: '20px 0px 5px', display: 'flex', justifyContent: 'center' }}>
              <ButBox type={'left'} >
                {
                  AllButton('取消', () => {
                    set_modalSate1(false)
                  }, { type: '' })
                }
                <Button type="primary"
                  onClick={() => {
                    modalName1 == '新增' ?
                      addOne() :
                      updataDetail()
                  }}>确认</Button>
              </ButBox>
            </div>
          </div>
        </Modal >
        : ''
    }

    {/* 转换 */}
    {/* <Modal
      visible={modalSate2}
      footer={false}
      title='转换'
      width={"40%"}
      onCancel={
        () => {
          set_modalSate2(false)
        }
      }
    >
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
          columns.otherTableColumns2(true)
        }
        isedit={1}
      >
      </ActiveTable>
    </Modal> */}
  </div>

};

export default connect(({ common, select }) => ({
  common,
  select
}))(User);
