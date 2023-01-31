import React, { useEffect, useState } from "react";
import { connect } from "dva";
import { Button, DatePicker, Form, Input, Modal, Pagination, Radio, Table, Select, Checkbox, Switch, message } from 'antd';
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

  const [DETAIL, set_DETAIL] = useState<any>({}); // 详情

  const [modalVisit, set_modalVisit] = useState<any>(false)
  const [modalName, set_modalName] = useState<any>('添加报警')

  const [switchOn, set_switchOn] = useState<any>(1); // 1 开关量  2 模拟量

  const [deviceGroupId, set_deviceGroupId] = useState<any>(null) // 设备组id
  const [deviceGroupItemId, set_deviceGroupItemId] = useState<any>(null) // 设备组属性id

  // 数据列表
  const [deviceGroupList, set_deviceGroupList] = useState<any>([]);
  const [deviceGroupItemList, set_deviceGroupItemList] = useState<any>([]);
  const [deviceList, set_deviceList] = useState<any>([])

  const [upInfoValue, set_upInfoValue] = useState<any>({});

  const onRowAction = (record: Record<string, any>, index?: number): any => {
    return {
      onClick: (e: any) => {
        setRowSelectedData(record);
      },
    };
  };

  const [form] = Form.useForm();
  const [form2] = Form.useForm();
  const [form3] = Form.useForm();

  let columnList = [
    {
      name: '低低限报警值',
      warnvalue: 'LL_warnvalue',
      titlekey: 'LL_titlekey',
      warnDegree: 'LL_warnDegree'
    },
    {
      name: '低限报警值',
      warnvalue: 'L_warnvalue',
      titlekey: 'L_titlekey',
      warnDegree: 'L_warnDegree'
    },
    {
      name: '高限报警值',
      warnvalue: 'H_warnvalue',
      titlekey: 'H_titlekey',
      warnDegree: 'H_warnDegree'
    },
    {
      name: '高高限报警值',
      warnvalue: 'HH_warnvalue',
      titlekey: 'HH_titlekey',
      warnDegree: 'HH_warnDegree'
    }
  ]

  let EmergencyDegree = [
    {
      id: 1,
      name: '一般'
    },
    {
      id: 2,
      name: '紧急'
    }
  ]

  let warnType = [
    {
      id: 1,
      name: '设备故障'
    },
    {
      id: 2,
      name: '设备离线'
    },
    {
      id: 3,
      name: '数值报警'
    }
  ]

  useEffect(() => {
    getDeviceGroupList()
  }, [])

  const changeValue = (valueName: any, value: any, type?: any) => {
    set_upInfoValue({
      ...upInfoValue,
      [valueName]: value
    })
  }

  // 列表加载数据的方法
  //---------------
  const getTableData = (
    { current, pageSize }: PaginatedParams[0],
    formData: Object,
  ): Promise<any> => {
    formData = JSON.parse(JSON.stringify(formData))
    return new Promise((resolve) => {
      dispatch({
        type: 'common/getRequestData',
        method: 'GET',
        url: '/systemAlarmManger/getSystemAlarmList',
        payload: {
          pageNo: current,
          pageSize,
          ...formData
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
        error: (error: any) => {
          message.warn(error)
        },
      });
    });
  };

  const { tableProps, search } = useAntdTable(getTableData, {
    defaultPageSize: 10,
    form
  });
  const { submit, reset } = search;

  const getDeviceGroupList = () => {
    dispatch({
      type: 'common/getRequestData',
      method: 'GET',
      url: '/systemAlarmManger/getDeviceGroupList',
      payload: {
      },
      callback: (_data: any) => {
        set_deviceGroupList(_data)
      },
      error: (error: any) => {
        message.warn(error)
      },
    });
  }

  const getDeviceGroupItemList = (deviceGroupId: any) => {
    dispatch({
      type: 'common/getRequestData',
      method: 'GET',
      url: '/systemAlarmManger/getDeviceGroupItemsList',
      payload: {
        deviceGroupId
      },
      callback: (_data: any) => {
        set_deviceGroupItemList(_data)
      },
      error: (error: any) => {
        message.warn(error)
      },
    });
  }

  const getDeviceList = (
    deviceGroupitemId: any,
    newdeviceGroupId?: any
  ) => {
    dispatch({
      type: 'common/getRequestData',
      method: 'GET',
      url: '/systemAlarmManger/getDeviceList',
      payload: {
        deviceGroupId: newdeviceGroupId || deviceGroupId,
        deviceGroupitemId
      },
      callback: (_data: any) => {
        set_deviceList(_data)
      },
      error: (error: any) => {
        message.warn(error)
      },
    });
  }

  // 操作数据
  const overData = async () => {
    await form2.validateFields()
    let data1 = form2.getFieldsValue()

    let data2 = form3.getFieldsValue()

    let upInfo1: any = []

    // 存储模拟量
    columnList.map((res: any, idx: any) => {
      if (!!data2[res.warnvalue] && !!data2[res.titlekey] && !!data2[res.warnDegree]) {
        upInfo1.push({
          promptText: data2[res.titlekey],
          warnValue: data2[res.warnvalue],
          emergeDegreeType: data2[res.warnDegree],
          alarmRangType: 2,
          warnType: idx + 1
        })
      }
    })

    if (data2['warnvalue'] != undefined && !!data2['titlekey'] && !!data2['warnDegree']) {
      upInfo1.push({
        promptText: data2['titlekey'],
        warnValue: data2['warnvalue'],
        emergeDegreeType: data2['warnDegree'],
        alarmRangType: 1,
      })
    }

    if (modalName == '添加报警') {
      dispatch({
        type: 'common/getRequestData',
        method: 'POST',
        url: '/systemAlarmManger/addSystemAlarm',
        payload: {
          ...data1,
          ...upInfoValue,
          alarmRangType: switchOn,
          SystemAlarmRangs: upInfo1,
        },
        callback: (_data: any) => {
          submit()
          message.success('添加成功')
          set_modalVisit(false)
        },
        error: (error: any) => {
          message.warn(error)
        },
      });
    } else {
      dispatch({
        type: 'common/getRequestData',
        method: 'POST',
        url: '/systemAlarmManger/updataData',
        payload: {
          ...data1,
          ...upInfoValue,
          alarmRangType: switchOn,
          alarmId: DETAIL.alarmId,
          SystemAlarmRangs: upInfo1,
        },
        callback: (_data: any) => {
          submit()
          message.success('修改成功')
          set_modalVisit(false)
        },
        error: (error: any) => {
          message.warn(error)
        },
      });
    }
  }

  // 获取详情
  const getDetail = (id) => {
    dispatch({
      type: 'common/getRequestData',
      method: 'GET',
      url: '/systemAlarmManger/getSystemAlarmDetail',
      payload: {
        id
      },
      callback: async (_data: any) => {
        const { deviceGroupId, deviceGroupitemId, equipList, rangList, alarmRangType, alarmValue } = _data

        changeValue('alarmValue', alarmValue)

        set_deviceGroupId(deviceGroupId)

        getDeviceGroupItemList(deviceGroupId)

        set_deviceGroupItemId(deviceGroupitemId)

        getDeviceList(deviceGroupitemId, deviceGroupId)

        let equipIds: any = []
        equipList.map((res: any) => {
          equipIds.push(res.bindConfigureId)
        })
        _data.equipIds = equipIds

        set_switchOn(alarmRangType)

        form2.setFieldsValue(_data)

        let newObj: any = {}

        let keyList = [
          {
            coloumnName: 'warnvalue',
            keyName: 'warnValue'
          },
          {
            coloumnName: 'titlekey',
            keyName: 'promptText'
          },
          {
            coloumnName: 'warnDegree',
            keyName: 'emergeDegreeType'
          },
        ]

        if (alarmRangType == 1) {
          rangList.map((res: any, idx: any) => {
            keyList.map((res2: any) => {
              newObj[res2.coloumnName] = res[res2.keyName]
            })
          })
        } else if (alarmRangType == 2) {
          rangList.map((res: any, idx: any) => {
            newObj[columnList[res.warnType - 1]['warnvalue']] = res.warnValue
            newObj[columnList[res.warnType - 1]['titlekey']] = res.promptText
            newObj[columnList[res.warnType - 1]['warnDegree']] = res.emergeDegreeType
          })
        }

        form3.setFieldsValue(newObj)
      },
      error: (error: any) => {
        message.warn(error)
      },
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
      url: '/systemAlarmManger/delDeviceGroup',
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

  return <div className='right-main-box'>
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <Form
        form={form}
        layout="vertical"
      >
        <div style={{ display: 'flex' }}>
          <Form.Item
            label=""
            name="equipName"
            rules={[{ required: false, message: 'Please input your username!' }]}
          >
            <FormLineBox  >
              <span>设备名</span>
              <Input placeholder="请输入单个设备名" />
            </FormLineBox>
          </Form.Item>

          {/* <Form.Item
            label=""
            name="uname2"
            rules={[{ required: false, message: 'Please input your username!' }]}
          >
            <FormLineBox>
              <span>点位名</span>
              <Input placeholder="请输入点位名" />
            </FormLineBox>
          </Form.Item> */}

          <Form.Item
            label=""
            name="warnType"
            rules={[{ required: false, message: 'Please input your username!' }]}
          >
            <FormLineBox>
              <span>报警类型</span>
              <div>
                <Select style={{ width: '200px' }} placeholder="请选择报警类型"
                  onChange={(e1) => {
                    form.setFieldsValue({
                      warnType: e1
                    })
                  }}
                >
                  {
                    [{ id: 'all', name: '全部' }, ...warnType].map((res) => {
                      return <Option value={res.id} key={res.name}>{res.name}</Option>
                    })
                  }
                </Select>
              </div>
            </FormLineBox>
          </Form.Item>

          <ButBox type={'right'}>
            {
              AllButton('搜索', () => { submit() }, { type: 'primary' })
            }
            {
              AllButton('重置', () => { reset() }, {})
            }
          </ButBox>
        </div>
      </Form>
      <ButBox type={'left'} style={{ marginBottom: '15px' }}>
        {
          AllButton('添加报警', () => {
            set_modalName('添加报警'), form2.resetFields(),
              form3.resetFields(), set_modalVisit(true)
          }, { type: 'add' })
        }
        {
          AllButton('批量删除', () => {
            delData(null, SELECTROWKEYS)
          }, { type: 'delte' })
        }
        {/* {
        AllButton('导入', () => { }, { type: 'primary' })
      }
      {
        AllButton('导出', () => { }, { type: 'primary' })
      } */}
      </ButBox>
    </div>

    <div className={`${commonStyle['tableBox']}`}>
      <Table
        rowKey="alarmId"
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
                  <a onClick={() => {
                    set_DETAIL(record)
                    set_modalName('报警配置')
                    set_modalVisit(true)
                    getDetail(record.alarmId)
                  }} style={{ marginRight: '15px' }}>编辑</a>
                  <a
                    onClick={() => {
                      delData(record.alarmId)
                    }}

                    style={{ color: 'red' }}>删除</a>
                </div>
              );
            }}
          ></Column>
        )}
      </Table>
    </div>

    <Modal
      visible={modalVisit}
      footer={false}
      width={'45%'}
      title={modalName}
      onCancel={
        () => {
          set_modalVisit(false)
        }
      }
    >
      <Form
        form={form2}
        layout="vertical"
      >
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Form.Item
            style={{ width: '48%' }}
            label="报警名称"
            name="name"
            rules={[{ required: true, message: '请输入报警名称!' }]}
          >
            <Input maxLength={25} />
          </Form.Item>
          <Form.Item
            style={{ width: '48%' }}
            label="设备组"
            name="deviceGroupId"
            rules={[{ required: true, message: '请选择设备组!' }]}
          >
            <Select
              onChange={(e1, e2) => {

                //清空设备和设备参数的值
                form2.setFieldsValue({
                  deviceGroupitemId: null,
                  equipIds: []
                })

                getDeviceGroupItemList(e1)

                set_deviceGroupId(e1)
              }}
            >
              {
                deviceGroupList.map((res) => {
                  return <Option value={res.deviceGroupId}>{res.name}</Option>
                })
              }
            </Select>
          </Form.Item>
        </div>

        {
          deviceGroupId != null ?
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Form.Item
                style={{ width: '48%' }}
                label="设备参数"
                name="deviceGroupitemId"
                rules={[{ required: true, message: '请选择设备参数!' }]}
              >
                <Select
                  onChange={(e1, e2) => {
                    form2.setFieldsValue({
                      equipIds: []
                    })
                    getDeviceList(e1)
                    set_deviceGroupItemId(e1)
                  }}
                >
                  {
                    deviceGroupItemList.map((res) => {
                      return <Option value={res.id}>{res.name}</Option>
                    })
                  }
                </Select>
              </Form.Item>

              {
                deviceGroupItemId != null ?
                  <Form.Item
                    style={{ width: '48%' }}
                    label="设备"
                    name="equipIds"
                    rules={[{ required: true, message: '请选择设备!' }]}
                  >
                    <Select
                      mode="multiple"
                    >
                      {
                        deviceList.map((res) => {
                          return <Option value={res.bindConfigId}>{res.name}</Option>
                        })
                      }
                    </Select>
                  </Form.Item>
                  :
                  ""
              }
            </div>
            : ''
        }


        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Form.Item
            style={{ width: '48%' }}
            label="报警类型"
            name="alarmType"
            rules={[{ required: true, message: '请选择报警类型!' }]}
          >
            <Select
              onChange={(e1, e2: any) => {
                changeValue('alarmValue', e2.key)
              }}
            >
              {
                warnType.map((res) => {
                  return <Option value={res.id} key={res.name}>{res.name}</Option>
                })
              }
            </Select>
          </Form.Item>

          <div style={{ display: 'flex', justifyContent: 'space-between', width: '48%' }}>
            <Form.Item
              style={{ width: '48%' }}
              label="延时(s)"
              name="delayTime"
              rules={[{ required: false, message: '请输入延时值!' }]}
            >
              <Input defaultValue={0} />
            </Form.Item>
            <Form.Item
              style={{ width: '48%' }}
              label="死区"
              name="deadZone"
              rules={[{ required: false, message: '请输入死区值!' }]}
            >
              <Input defaultValue={0} />
            </Form.Item>
          </div>
        </div>

        <Form.Item
          style={{ width: '48%' }}
          label="报警范围"
          name="alarmRangType"
          // valuePropName="checked"
          rules={[{ required: false, message: '!' }]}
        >
          <span style={{ marginLeft: '13px' }}>{switchOn == 2 ? '模拟量' : '开关量'}</span>
          <Switch
            style={{ marginLeft: '13px' }}
            checked={switchOn == 2}
            onChange={(e) => {
              if (e) {
                set_switchOn(2)
              } else {
                set_switchOn(1)
              }
            }}
            checkedChildren="模拟量"
            unCheckedChildren="开关量"
          />
        </Form.Item>
      </Form>

      <Form
        form={form3}
        layout="horizontal"
      >
        {
          switchOn == 2 ? columnList.map(res => {
            return (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Form.Item
                  labelCol={{ span: 7 }}
                  labelAlign={'left'}
                  style={{ width: '45%' }}
                  label={res.name}
                  name={res.warnvalue}
                  rules={[{ required: false, message: `请输入${res.name}!` }]}
                >
                  <Input type={'number'} style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item
                  style={{ width: '32%' }}
                  label="提示文本"
                  name={res.titlekey}
                  rules={[{ required: false, message: '请输入提示文本!' }]}
                >
                  <Input maxLength={50} />
                </Form.Item>
                <Form.Item
                  style={{ width: '20%' }}
                  label="紧急程度"
                  name={res.warnDegree}
                  rules={[{ required: false, message: '请输入提示文本!' }]}
                >
                  <Select
                    style={{ width: '100%' }}
                  // onChange={handleChange}
                  >
                    {
                      EmergencyDegree.map((res) => {
                        return <Option value={res.id}>{res.name}</Option>
                      })
                    }
                  </Select>
                </Form.Item>
              </div>
            )
          }) :
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Form.Item
                labelCol={{ span: 7 }}
                labelAlign={'left'}
                style={{ width: '32%' }}
                label={'报警值'}
                name={'warnvalue'}
                rules={[{ required: false, message: `请输入报警值!` }]}
              >
                <Select
                  style={{ width: '100%' }}
                // onChange={handleChange}
                >
                  {
                    [0, 1].map((res) => {
                      return <Option value={res} key={res + '111'}>{res}</Option>
                    })
                  }
                </Select>
              </Form.Item>
              <Form.Item
                style={{ width: '42%' }}
                label="提示文本"
                name={'titlekey'}
                rules={[{ required: false, message: '请输入提示文本!' }]}
              >
                <Input maxLength={50} />
              </Form.Item>
              <Form.Item
                style={{ width: '20%' }}
                label="紧急程度"
                name={'warnDegree'}
                rules={[{ required: false, message: '请输入提示文本!' }]}
              >
                <Select
                  style={{ width: '100%' }}
                // onChange={handleChange}
                >
                  {
                    EmergencyDegree.map((res) => {
                      return <Option value={res.id}>{res.name}</Option>
                    })
                  }
                </Select>
              </Form.Item>
            </div>
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
              overData()
            }}>确认</Button>
        </ButBox>
      </div>
    </Modal>
  </div >
};

export default connect(({ common, select }) => ({
  common,
  select
}))(User);
