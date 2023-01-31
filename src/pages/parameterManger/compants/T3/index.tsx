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

import TimeChoose from '@/components/ActiveTimeChoose/timeChoose'
import moment from 'moment';

const { Column } = Table
const { Option } = Select

const User: React.FC<any> = (props) => {
  const { dispatch } = props;
  const [form] = Form.useForm();
  const [form2] = Form.useForm();
  const dom: any = useRef();
  const [SELECTROWKEYS, setSELECTROWKEYS] = useState([]); // 列表多选框
  const [rowSelectedData, setRowSelectedData] = useState<Record<string, any>>({}); // 表格选中样式
  const [modalVisit, set_modalVisit] = useState<any>(false);
  const [modalName, set_modalName] = useState<any>(false);

  const [searchInfo, set_searchInfo] = useState<any>({}) // 搜索框内容

  const [DETAIL, set_DETAIL] = useState();
  const [timeset, set_timeset] = useState<any>([[], [], [], []]); // 存储时间数组 根据有多少的数组来算
  const [showTime, set_showTime] = useState<any>([[], [], [], []]);

  const [energiceList, set_energiceList] = useState<any>([]);
  const [energyType, set_energyType] = useState<any>(1);

  const [detaileInfo, set_detaileInfo] = useState<any>();
  const [rateList, set_rateList] = useState<any>();

  const onRowAction = (record: Record<string, any>, index?: number): any => {
    return {
      onClick: (e: any) => {
        setRowSelectedData(record);
      },
    };
  };

  let energyList = ['尖', '峰', '平', '谷']

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
        url: '/energybillManger/getEnergyBillList',
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

  const { submit } = search

  const getChildData = () => {

    if (!!dom.current) {
      return dom.current.fn()
    }

    return []
  }

  useEffect(() => {
    getTypeList()
  }, [])

  const getTypeList = () => {
    dispatch({
      type: 'common/getRequestData',
      method: 'GET',
      url: '/energybillManger/getEnergyBillTypeList',
      payload: {
      },
      callback: (_data: any) => {
        set_energiceList(_data)
      },
      error: (error: any) => {
        message.warn(error)
      },
    });
  }

  const addOrupdata = async () => {
    await form.validateFields()

    let info = form.getFieldsValue()
    let info2 = form2.getFieldsValue()
    let EnergyBillingItems: any = []

    if (info.type == 1) {

      if (modalName == '新增') {
        timeset.map((res1: any, idx1: any) => {
          res1.map((res2: any, idx2: any) => {
            if (!!res2.startTime && !!res2.endTime && !!info2[`rate${idx1}`]) {
              EnergyBillingItems.push({
                startTime: res2.startTime,
                endTime: res2.endTime,
                rate: info2[`rate${idx1}`],
                timeType: idx1 + 1
              })
            }
          })
          // let time = moment(res1[0].startTime).format('YYYY-MM-DD HH:mm')
        })
      } else {

        timeset.map((res1: any, idx1: any) => {
          res1.map((res2: any, idx2: any) => {
            if (!!res2.startTime && !!res2.endTime && !!info2[`rate${idx1}`]) {
              EnergyBillingItems.push({
                id: res2.id,
                startTime: res2.startTime,
                endTime: res2.endTime,
                rate: info2[`rate${idx1}`],
                timeType: idx1 + 1
              })
            }
          })
          // let time = moment(res1[0].startTime).format('YYYY-MM-DD HH:mm')
        })
      }
    }

    if (modalName == '新增') {
      dispatch({
        type: 'common/getRequestData',
        method: 'post',
        url: '/energybillManger/addEnergyBill',
        payload: {
          ...info,
          EnergyBillingItems
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
    } else {
      let { delData } = getChildData()

      dispatch({
        type: 'common/getRequestData',
        method: 'post',
        url: '/energybillManger/updateEnergyBill',
        payload: {
          energyId: detaileInfo.energyId,
          ...info,
          EnergyBillingItems,
          removeList: delData
        },
        callback: (_data: any) => {
          message.success('操作成功')
          set_modalVisit(false)
          submit()
        },
        error: (error: any) => {
          message.warn(error)
        },
      });
    }
  }


  const getDetail = (energyId: any) => {
    dispatch({
      type: 'common/getRequestData',
      method: 'GET',
      url: '/energybillManger/getEnergyBillDetail',
      payload: {
        energyId
      },
      error: (error: any) => {
        message.warn(error)
      },
      callback: (_data: any) => {
        form.setFieldsValue(_data)
        set_energyType(_data.type)
        if (_data.type == 1) {
          const { dataItemList } = _data

          let form2Obj: any = {}

          let arry1: any = []
          let arry2: any = []
          let arry3: any = []
          let arry4: any = []

          dataItemList.map((res: any, idx: any) => {
            let timeObj = {
              startTime: res.startTime,
              endTime: res.endTime,
              id: res.id
            }
            switch (res.timeType) {
              case 1:
                arry1.push(timeObj)
                form2Obj['rate0'] = res.rate
                break;
              case 2:
                arry2.push(timeObj)
                form2Obj['rate1'] = res.rate
                break;
              case 3:
                arry3.push(timeObj)
                form2Obj['rate2'] = res.rate
                break;
              case 4:
                arry4.push(timeObj)
                form2Obj['rate3'] = res.rate
                break;
              default:
                break;
            }
          })

          form2.setFieldsValue(form2Obj)

          set_showTime([
            arry1,
            arry2,
            arry3,
            arry4,
          ])
        }
      },
    });
  } //  删除

  const del = (id?: any, ids?: any) => {
    let flage = window.confirm('确认删除')
    if (!flage) {
      return
    }
    dispatch({
      type: 'common/getRequestData',
      method: 'post',
      url: '/energybillManger/delteEnergyBill',
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

  return <div className='right-main-box' style={{position:"relative",  height: '93%' }}>
    <div className="rightbox-headBox" style={{ justifyContent: 'space-between' }}>
      <ButBox type={'left'}>
        {
          AllButton('新增', () => { set_modalVisit(true), set_modalName('新增'), form.resetFields(), form2.resetFields() }, { type: 'add' })
        }
        {
          AllButton('批量删除', () => { del(null, SELECTROWKEYS) }, { type: 'delte' })
        }
      </ButBox>
      <div style={{ display: 'flex' }}>
        {/* <FormLineBox lableWidth={'3.2vw'} style={{ marginBottom: '15px' }}>
          <span>关键字</span>
          <Input />
        </FormLineBox> */}
        <FormLineBox>
          <span>关键字</span>
          <Input
            placeholder="计费方式名称"
            value={searchInfo['key']}
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
            AllButton('重置', () => { set_searchInfo({}); setTimeout(() => { submit() }, 200) })
          }
        </ButBox>
      </div>
    </div>
    <div className={`${commonStyle['tableBox']}`}>
      {/* <Table columns={columns} rowKey="id" {...tableProps} /> */}
      {
        console.log(tableProps)
      }
      <Table
        rowKey="energyId"
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
                  <a onClick={() => { set_modalVisit(true), set_modalName('编辑'), set_detaileInfo(record), getDetail(record.energyId) }} style={{ marginRight: '15px' }}>编辑</a>
                  <a onClick={() => { del(record.energyId) }} style={{ color: 'red' }}>删除</a>
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
          onCancel={
            () => {
              set_modalVisit(false)
            }
          }
          width={"40%"}
        >
          <Form
            form={form}
            layout="vertical"
          >
            <Form.Item
              label="计费名称"
              name="name"
              rules={[{ required: true, message: '请输入计费名称!' }]}
            >
              <Input maxLength={25} />
            </Form.Item>
            <Form.Item
              label="能耗表类型"
              name="type"
              rules={[{ required: true, message: '请输入能耗表类型!' }]}
            >
              <Select
                style={{ width: '100%' }}
                disabled={modalName == '编辑'}
                onChange={
                  (e) => {
                    set_energyType(e)
                  }
                }
              >
                {
                  energiceList.map((res: any) => {
                    return <Option value={res.id}>{res.name}</Option>
                  })
                }
              </Select>
            </Form.Item>
            {
              energyType != 1 ?
                <div style={{ display: 'flex' }}>
                  <Form.Item
                    style={{ width: '90%' }}
                    label="费率"
                    name="rate"
                    rules={[{ required: true, message: '请输入费率!' }]}
                  >
                    <Input />
                  </Form.Item>

                  <div style={{ lineHeight: '91px', marginLeft: '5px' }}>
                    元/t
                  </div>
                </div>
                : ''
            }
          </Form>

          <Form
            form={form2}
            layout="vertical"
          >
            {
              energyType == 1 ?
                <div>
                  {
                    energyList.map((res, idx) => {
                      return <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div style={{ width: '10%', lineHeight: '30px' }}>
                          <span style={{ marginRight: '8px' }}>{res}</span>
                          <span>时间段</span>
                        </div>
                        <div style={{ width: '58%' }}>
                          <TimeChoose
                            edit={modalName == '编辑'}
                            setTimeIdx={idx}
                            TimeSend={showTime}
                            setTimeSend={set_timeset}
                            dom={dom}
                          >
                          </TimeChoose>
                        </div>
                        <div style={{ display: 'flex', width: '35%', lineHeight: '33px' }}>
                          <span style={{ marginRight: '15px' }}>费率</span>
                          {/* <Input style={{ width: '60%', maxHeight: '30px' }} /> */}
                          <Form.Item
                            label=""
                            style={{ width: '35%', maxHeight: '30px', marginRight: '15px' }}
                            name={`rate${idx}`}
                            rules={[{ required: false, message: '' }]}
                          >
                            <Input />
                          </Form.Item>
                          <span>元/kwh</span>
                        </div>
                      </div>
                    })
                  }
                </div>
                :
                ''
            }
          </Form>
          <div style={{ padding: '20px 0px 5px', display: 'flex', justifyContent: 'center' }}>
            <ButBox type={'left'} >
              {
                AllButton('取消', () => {
                  set_modalVisit(false)
                }, { type: '' })
              }
              <Button type="primary"
                onClick={() => {
                  addOrupdata()
                }}>确认</Button>
            </ButBox>
          </div>
        </Modal>
        :
        ''
    }

  </div>
};

export default connect(({ common, select }) => ({
  common,
  select
}))(User);
