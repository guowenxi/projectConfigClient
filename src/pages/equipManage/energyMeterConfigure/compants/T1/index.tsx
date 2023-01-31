import React, { useEffect, useRef, useState } from "react";
import { connect } from "dva";
import { Button, DatePicker, Form, Input, message, Modal, Pagination, Radio, Select, Table, Tabs, Transfer } from 'antd';
import { useAntdTable } from 'ahooks';
import type { PaginatedParams } from 'ahooks/lib/useAntdTable';
import globalStyle from '@/styles/global.less'
import { AllButton, ButBox, FormLineBox } from '@/commonStyles/commonTsx'
import columns from './column'
import styles from './index.module.less'
import commonStyle from '@/commonStyles/common.module.less'

import ActiveTable from '@/components/ActivityTable/index'
import TreeTransfer from '../../../components/treeTransfer'
import { relative } from "path";

const { Column } = Table
const { Option } = Select

const User: React.FC<any> = (props) => {
  const { dispatch } = props;
  const dom1: any = useRef();
  const dom2: any = useRef();
  const dom3: any = useRef();
  const [SELECTROWKEYS, setSELECTROWKEYS] = useState([]); // 列表多选框
  const [rowSelectedData, setRowSelectedData] = useState<Record<string, any>>({}); // 表格选中样式
  const [DETAIL, set_DETAIL] = useState();
  const [targetKeys, set_targetKeys] = useState<any>([]); // 选中的key的list

  const [searchInfo, set_searchInfo] = useState<any>({}) // 搜索框内容

  const [modelVisit1, set_modelVisit1] = useState<any>(false);
  const [modelName1, set_modelName1] = useState<any>(false);

  const [modelVisit2, set_modelVisit2] = useState<any>(false);

  const [modelVisit3, set_modelVisit3] = useState<any>(false);

  const [modelVisit4, set_modelVisit4] = useState<any>(false); // 计费设置

  const [pointList, set_pointList] = useState<any>([]);

  // 设备组信息存储
  const [basicList, set_basicList] = useState<any>(null);
  const [issuedList, set_issuedList] = useState<any>(null);
  const [readList, set_readList] = useState<any>(null);

  // 
  const [equipConfigDetail, set_equipConfigDetail] = useState<any>({}); //详情数据
  const [dynamoAttributeId, set_dynamoAttributeId] = useState<any>({}); // 详情的时候存储动态属性id 

  const [deviceTypeList, set_deviceTypeList] = useState<any>([]);//设备组list
  const [attributeList, set_attributeList] = useState<any>([]); // 属性表列表
  const [EnergyBillList, set_EnergyBillList] = useState<any>([]); // 能耗表列表

  const [dynamoColumn, set_dynamoColumn] = useState<any>([]);//动态表头

  const [updaInfobasic, set_updaInfobasic] = useState<any>(); // 存储基本属性的 value
  const [updaInfo, set_updaInfo] = useState<any>(); // 存储动态属性 value
  const [meterType, set_meterType] = useState<any>(0); // 表类型

  const [chargingMethodInfo, set_chargingMethodInfo] = useState<any>({}); // 计费方式信息

  const [dataScoreList, set_dataScoreList] = useState<any>([]);//配置数据源列表

  const onRowAction = (record: Record<string, any>, index?: number): any => {
    return {
      onClick: (e: any) => {
        setRowSelectedData(record);
      },
    };
  };

  const [form] = Form.useForm();
  const [form2] = Form.useForm();
  useEffect(() => {
    getdeviceGroupTypeList()
    getEnergyConsumptionBillTypeList()
    getAttributeTypeList()
    getAllPointList()
  }, [])
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
        url: '/energyMeterConfigureManger/getEquipConfigureList',
        payload: {
          pageNo: current,
          pageSize,
          meterType: 1,
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
      });
    });
  };

  const { tableProps, search } = useAntdTable(getTableData, {
    defaultPageSize: 10,
  });

  const { submit } = search

  // 下拉选择赋值框
  const selectChange = (propName: any, value: any, type: any) => {
    if (type == 1) {
      set_updaInfobasic({
        ...updaInfobasic,
        [propName]: value
      })
    } else {
      set_updaInfo({
        ...updaInfo,
        [propName]: value
      })
    }
  }

  //新增按键
  const addModal = () => {
    set_modelName1('新增')
    set_modelVisit1(true)
    form.resetFields()
    form2.resetFields()
  }

  // 获取设备组的下拉列表 -- 初始化之一
  const getdeviceGroupTypeList = () => {
    dispatch({
      type: 'common/getRequestData',
      method: 'GET',
      url: '/equipConfigureManger/getDeviceGroupList',
      payload: {
      },
      error: (error: any) => {
        message.warn(error)
      },
      callback: (_data: any) => {
        set_deviceTypeList(_data)
      },
    });
  }

  // 获取动态属性列表 -- 初始化之一
  const getAttributeTypeList = () => {
    dispatch({
      type: 'common/getRequestData',
      method: 'GET',
      url: '/equipConfigureManger/getAttributedictionaryList',
      payload: {
        meterType: 2
      },
      error: (error: any) => {
        message.warn(error)
      },
      callback: (_data: any) => {
        let newArry: any = []
        _data.map((res: any) => {
          newArry.push(res.paramName)
        })
        set_dynamoColumn([...newArry])
        set_attributeList(_data)
      },
    });
  }

  // 获取能耗类型列表 -- 初始化之一
  const getEnergyConsumptionBillTypeList = () => {
    dispatch({
      type: 'common/getRequestData',
      method: 'GET',
      url: '/energyMeterConfigureManger/energyConsumptionBillTypeList',
      payload: {
        meterType: 1
      },
      error: (error: any) => {
        message.warn(error)
      },
      callback: (_data: any) => {
        set_EnergyBillList(_data)
      },
    });
  }

  // 获取点位配置信息 设备组的信息
  const getPointConfig = (deviceGroupId: any, equipId: any) => {
    dispatch({
      type: 'common/getRequestData',
      method: 'GET',
      url: '/equipConfigureManger/getPointConfigureList',
      payload: {
        deviceGroupId,
        equipId
      },
      error: (error: any) => {
        message.warn(error)
      },
      callback: (_data: any) => {
        let basicList: any = []
        let readList: any = []
        let issuedList: any = []

        _data.map((res: any, idx: any) => {
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

        set_modelVisit2(true)
      },
    });
  }

  // 获取全部点位列表
  const getAllPointList = (key?: any) => {
    dispatch({
      type: 'common/getRequestData',
      method: 'GET',
      url: '/energyMeterConfigureManger/getAllPointTreeList',
      payload: {
        key: key || null
      },
      error: (error: any) => {
        message.warn(error)
      },
      callback: (_data: any) => {
        set_pointList(_data)
      },
    });
  }

  // 添加数据 // 修改数据
  const overData = async () => {

    await form.validateFields()

    let data1 = form.getFieldsValue();
    let data2 = form2.getFieldsValue();

    let configurePropertyList: any = [];
    let newParamList = Object.keys(data2);


    newParamList.map((res: any, idx: any) => {
      let attributeIdList = attributeList.filter((res1: any, idx1: any) => {
        return res == res1.attributeId
      })

      let attributeId = attributeIdList.length > 0 && attributeIdList[0]?.attributeId || null

      if (!!data2[res]) {
        configurePropertyList.push({
          name: attributeIdList.length > 0 && attributeIdList[0]?.paramName,
          attributeId,
          valueId: data2[res],
          value: updaInfo[res],
          id: dynamoAttributeId[res] || null
        })
      }
    })

    if (modelName1 == '编辑') {
      dispatch({
        type: 'common/getRequestData',
        method: 'post',
        url: '/energyMeterConfigureManger/updataData',
        payload: {
          equipId: equipConfigDetail.equipId,
          ...data1,
          ...updaInfobasic,
          configurePropertyList,
          meterType: 1
        },
        error: (error: any) => {
          message.warn(error)
        },
        callback: (_data: any) => {
          message.success('操作成功')
          submit()
          set_modelVisit1(false)
        },
      });
    } else {
      dispatch({
        type: 'common/getRequestData',
        method: 'post',
        url: '/energyMeterConfigureManger/addEquipConfigure',
        payload: {
          ...data1,
          ...updaInfobasic,
          configurePropertyList,
          meterType: 1
        },
        error: (error: any) => {
          message.warn(error)
        },
        callback: (_data: any) => {
          message.success('添加成功')
          submit()
          set_modelVisit1(false)
        },
      });
    }

  }

  // 获取详情
  const getDetail = (id: any) => {
    dispatch({
      type: 'common/getRequestData',
      method: 'GET',
      url: '/energyMeterConfigureManger/getequipConfigureDetail',
      payload: {
        id: id || equipConfigDetail.equipId,
        meterType: 1
      },
      error: (error: any) => {
        message.warn(error)
      },
      callback: (_data: any) => {
        let { attriList } = _data
        let newObj: any = {}
        let newObjValue: any = {}
        let newObjId: any = {}
        form.setFieldsValue(_data)

        form2.resetFields()

        set_updaInfobasic({
          deviceGroupName: _data.deviceGroupName,
          chargingMethodsValue: _data.chargingMethodsValue
        })

        set_meterType(
          _data.electricitymeterType
        )

        attriList.map((res: any, idx: any) => {
          newObj[res.attributeId] = res.valueId
          newObjValue[res.attributeId] = res.value
          newObjId[res.attributeId] = res.id
        })
        set_updaInfo(newObjValue)
        set_dynamoAttributeId({ ...newObjId })
        form2.setFieldsValue(newObj)

      },
    });
  }

  //批量删除
  const del = (id?: any, ids?: any) => {
    let flage = window.confirm('确认删除')
    if (!flage) {
      return
    }
    dispatch({
      type: 'common/getRequestData',
      method: 'post',
      url: '/energyMeterConfigureManger/delEquipConfigure',
      payload: {
        id,
        ids,
        meterType: 1
      },
      error: (error: any) => {
        message.warn(error)
      },
      callback: (_data: any) => {
        message.success('删除成功')
        submit()
      },
    });
  }

  // 批量修改计费方式
  const batchUpdata = () => {
    dispatch({
      type: 'common/getRequestData',
      method: 'post',
      url: '/energyMeterConfigureManger/batchUpdataChargingMethods',
      payload: {
        meterType: 1,
        chargingMethodsId: chargingMethodInfo.id,
        chargingMethodsValue: chargingMethodInfo.value,
        equipIds: [...SELECTROWKEYS]
      },
      error: (error: any) => {
        message.warn(error)
      },
      callback: (_data: any) => {
        message.success('操作成功')
        set_modelVisit4(false)
        submit()
      },
    });
  }

  // 保存点位列表
  const savePointList = () => {
    dispatch({
      type: 'common/getRequestData',
      method: 'post',
      url: '/energyMeterConfigureManger/savePointList',
      payload: {
        pointIdList: targetKeys,
        equipId: equipConfigDetail.equipId
      },
      error: (error: any) => {
        message.warn(error)
      },
      callback: (_data: any) => {
        message.success('操作成功')
        set_modelVisit3(false)
        submit()
      },
    });
  }

  // 获取点位数据源列表
  const getDetailPointList = (equipId: any) => {
    dispatch({
      type: 'common/getRequestData',
      method: 'GET',
      url: '/equipConfigureManger/getEquipPointList',
      payload: {
        equipId
      },
      error: (error: any) => {
        message.warn(error)
      },
      callback: (_data: any) => {
        let newArry: any = []
        _data.map((res: any) => {
          newArry.push(res.id)
        })
        set_targetKeys(newArry)
        set_dataScoreList(_data)
      },
    });
  }

  // 保存点位配置信息
  const savePointConfig = () => {
    let listData = getChildData();
    let endData: any = [];
    // let delData = [];
    const { basicList, readList, issuedList } = listData;

    const addInfo = (data: any, type: number) => {
      data.map((res: any, idx: any) => {
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


    dispatch({
      type: 'common/getRequestData',
      method: 'post',
      url: '/energyMeterConfigureManger/updataPointConfigInfo',
      payload: {
        pointConfigList: endData,
        equipId: equipConfigDetail.equipId
      },
      error: (error: any) => {
        message.warn(error)
      },
      callback: (_data: any) => {
        message.success('操作成功')
        set_modelVisit2(false)
        submit()
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

  return <div className='right-main-box' style={{position:"relative", height: "93%" }} >
    <div className="rightbox-headBox" style={{ justifyContent: 'space-between' }}>
      <ButBox type={'left'}>
        {
          AllButton('添加设备', () => { addModal() }, { type: 'add' })
        }
        {
          AllButton('批量删除', () => { del(null, SELECTROWKEYS) }, { type: 'delte' })
        }
        {
          AllButton('计费方式设置', () => {
            if (!!SELECTROWKEYS && SELECTROWKEYS?.length != 0) {
              set_chargingMethodInfo({})
              set_modelVisit4(true)
            } else {
              message.warn('还未选中任何数据')
            }
          }, { type: 'primary' })
        }
        {/* {
          AllButton('导入', () => { }, { type: 'primary' })
        }
        {
          AllButton('导出', () => { }, { type: 'primary' })
        } */}
      </ButBox>
      <div style={{ display: "flex" }}>

        <FormLineBox lableWidth={'4.5vw'} style={{ width: '14vw' }}>
          <span>设备组类型</span>
          <Select
            style={{ width: '100%' }}
            placeholder={'设备组类型'}
            value={
              searchInfo['deviceGroupId']
            }
            onChange={
              (e1, e2: any) => {
                set_searchInfo({
                  ...searchInfo,
                  deviceGroupId: e2.value
                })
              }
            }
          >
            {
              deviceTypeList.map(res => {
                return <Option value={res.id} key={res.name}>{res.name}</Option>
              })
            }
          </Select>
        </FormLineBox>

        <FormLineBox>
          <span>关键字</span>
          <Input
            placeholder="设备组名称"
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
            AllButton('重置', () => { set_searchInfo({}); setTimeout(() => { submit() }, 200); },)
          }
        </ButBox>
      </div>

    </div>

    <div className={`${commonStyle['tableBox']}`}>
      {/* <Table columns={columns} rowKey="id" {...tableProps} /> */}
      <Table
        rowKey="equipId"
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
        scroll={{ x: 600 + dynamoColumn.length * 200 }}
      >
        {columns.tableColumns
          ? columns.tableColumns(props, tableProps, null, { deviceTypeList }).map((i: any, idx: number) => {
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
        {
          dynamoColumn.map((res, idx) => {
            return <Column
              title={res}
              dataIndex={res}
              key={res}
              className='no-flex'
              align='center'
              onCell={(): any => ({ width: "200" })}
              onHeaderCell={(): any => ({ width: "200" })}
              render={(text: any, record: any) => {
                let end = record.attriList.filter((res1: any) => {
                  return res1.name == res
                })
                if (!!end && end?.length != 0) {
                  return end[0].value
                } else {
                  return ''
                }
              }}
            ></Column>
          })
        }
        {(
          <Column
            title="操作"
            align='center'
            onCell={(): any => ({ width: 300 })}
            onHeaderCell={(): any => ({ width: 300 })}
            fixed='right'
            render={(text: any, record: any) => {
              return (
                <div>
                  <a onClick={() => { set_modelName1('编辑'), set_modelVisit1(true), set_equipConfigDetail(record), getDetail(record.equipId) }}
                    style={{ marginRight: '15px' }}>编辑</a>
                  <a onClick={() => { set_modelVisit3(true), set_equipConfigDetail(record), getDetailPointList(record.equipId) }} style={{ marginRight: '15px' }}>点位绑定</a>
                  <a onClick={() => {

                    set_equipConfigDetail(record)
                    getPointConfig(record.deviceGroupId, record.equipId)
                    getDetailPointList(record.equipId)
                  }} style={{ marginRight: '15px' }}>点位配置</a>
                  <a onClick={() => { del(record.equipId) }} style={{ color: 'red' }}>删除</a>
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
      <div className={`${styles['modal-maxHeight']}`}>
        <Form
          form={form}
          layout="vertical"
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
            <Form.Item
              className={`${styles['formItemStyle']}`}
              label="设备编号"
              name="equipNumber"
              rules={[{ required: true, message: '请输入设备编号!' }]}
            >
              <Input maxLength={100} />
            </Form.Item>

            <Form.Item
              label="设备名称"
              name="name"
              className={`${styles['formItemStyle']}`}
              rules={[{ required: true, message: '请输入设备名称!' }]}
            >
              <Input maxLength={35} />
            </Form.Item>

            <Form.Item
              label="设备组"
              name="deviceGroupId"
              className={`${styles['formItemStyle']}`}
              rules={[{ required: true, message: '请选择设备组的信息!' }]}
            >
              <Select
                style={{ width: '100%' }}
                onChange={
                  (e1, e2: any) => {
                    selectChange('deviceGroupName', e2.key, 1)
                  }
                }
              >
                {
                  deviceTypeList.map(res => {
                    return <Option value={res.id} key={res.name}>{res.name}</Option>
                  })
                }
              </Select>
            </Form.Item>

            <Form.Item
              label="表分类"
              name="electricitymeterType"
              className={`${styles['formItemStyle']}`}
              rules={[{ required: true, message: '请选择设备组的信息!' }]}
            >
              <Select
                style={{ width: '100%' }}
                onChange={
                  (e1, e2: any) => {
                    set_meterType(e2.value)
                    // selectChange('chargingMethodsValue', e2, 1)
                  }
                }
              >
                {
                  [{ name: '总表', id: 2 }, { name: '分表', id: 1 }].map(res => {
                    return <Option value={res.id} key={res.name}>{res.name}</Option>
                  })
                }
              </Select>
            </Form.Item>

            {
              meterType == 1 ?
                <Form.Item
                  label="总表编号"
                  name="electricitymeterNumber"
                  className={`${styles['formItemStyle']}`}
                  rules={[{ required: true, message: '请输入总表编号!' }]}
                >
                  <Input maxLength={35} />
                </Form.Item>
                : ''
            }

            <Form.Item
              label="计费方式"
              name="chargingMethodsId"
              className={`${styles['formItemStyle']}`}
              rules={[{ required: true, message: '请选择计费方式!' }]}
            >
              <Select
                style={{ width: '100%' }}
                onChange={
                  (e1, e2: any) => {
                    selectChange('chargingMethodsValue', e2.key, 1)
                  }
                }
              >
                {
                  EnergyBillList.map(res => {
                    return <Option value={res.id} key={res.name}>{res.name}</Option>
                  })
                }
              </Select>
            </Form.Item>

          </div>
        </Form>

        {/* 动态属性 */}
        <Form
          form={form2}
          layout="vertical"
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
            {
              attributeList.map((res: any, idx: any) => {
                return <Form.Item
                  className={`${styles['formItemStyle']}`}
                  label={res.paramName}
                  name={res.attributeId}
                  rules={[{ required: false, message: `请选择${res.paramName}!` }]}
                >
                  <Select
                    style={{ width: '100%' }}
                    onChange={
                      (e1, e2: any) => {
                        selectChange(res.attributeId, e2.key, 2)
                      }
                    }
                  >
                    {
                      res?.attriList?.map((res2: any, idx2: any) => {
                        return <Option value={res2.id} key={res2.name}>{res2.name}</Option>
                      })

                    }
                  </Select>
                </Form.Item>
              })
            }
          </div>
        </Form>
      </div>


      <div style={{ padding: '20px 0px 5px', display: 'flex', justifyContent: 'center' }}>
        <ButBox type={'left'} >
          {
            AllButton('取消', () => {
              set_modelVisit1(false)
            }, { type: '' })
          }
          <Button type="primary"
            onClick={() => {
              overData()
            }}>确认</Button>
        </ButBox>
      </div>
    </Modal>

    {/* 点位配置 */}
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
          <ActiveTable
            dataSource={
              basicList != null ?
                [
                  ...basicList
                ] : []
            }
            tableColumn={
              columns.otherTableColumns(true, null, {
                dataScoureList: dataScoreList
              })
            }
            isedit={false}
            dom={dom1}
          >

          </ActiveTable>
        </Tabs.TabPane>
        <Tabs.TabPane tab="读取" key="item-2">
          <ActiveTable
            dataSource={
              readList != null ?
                [
                  ...readList
                ] : []
            }
            tableColumn={
              columns.otherTableColumns(true, null, {
                dataScoureList: dataScoreList
              })
            }
            isedit={false}
            dom={dom2}
          >

          </ActiveTable>
        </Tabs.TabPane>
        <Tabs.TabPane tab="下发" key="item-3">
          <ActiveTable
            dataSource={
              issuedList != null ?
                [
                  ...issuedList
                ] : []
            }
            tableColumn={
              columns.otherTableColumns(true, null, {
                dataScoureList: dataScoreList
              })
            }
            isedit={false}
            dom={dom3}
          >

          </ActiveTable>
        </Tabs.TabPane>
      </Tabs>
      <div style={{ padding: '20px 0px 5px', display: 'flex', justifyContent: 'center' }}>
        <ButBox type={'left'} >
          {
            AllButton('取消', () => {
              set_modelVisit2(false)
            }, { type: '' })
          }
          <Button type="primary"
            onClick={() => {
              savePointConfig()
            }}>确认</Button>
        </ButBox>
      </div>
    </Modal>

    {/* 点位绑定 */}
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
        <TreeTransfer
          dataSource={pointList}
          targetKeys={targetKeys}
          setTargetKeys={set_targetKeys}
          getAllPointListMeth={getAllPointList}
          onChange={
            (e: any) => {
              set_targetKeys(e);
            }
          }
        >
        </TreeTransfer>
        <div style={{ padding: '20px 0px 5px', display: 'flex', justifyContent: 'center' }}>
          <ButBox type={'left'} >
            {
              AllButton('取消', () => {
                set_modelVisit3(false)
              }, { type: '' })
            }
            <Button type="primary"
              onClick={() => {
                savePointList()
              }}>确认</Button>
          </ButBox>
        </div>
      </div>
    </Modal>

    {/* 计费设置 */}
    <Modal
      visible={modelVisit4}
      onCancel={() => {
        set_modelVisit4(false)
      }}
      width={'35%'}
      footer={false}
      title={'计费设置'}
    >
      <Form
        layout="vertical"
      >
        <Form.Item
          label={'计费方式选择'}
          name={'al'}
          rules={[{ required: false, message: 'Please input your username!' }]}
        >
          <Select
            style={{ width: '100%' }}
            value={chargingMethodInfo.id}
            onChange={
              (e1, e2: any) => {
                set_chargingMethodInfo({
                  id: e2.value,
                  value: e2.key
                })
              }
            }
          >
            {
              EnergyBillList.map(res => {
                return <Option value={res.id} key={res.name}>{res.name}</Option>
              })
            }
          </Select>
        </Form.Item>
      </Form>
      <div style={{ padding: '20px 0px 5px', display: 'flex', justifyContent: 'center' }}>
        <ButBox type={'left'} >
          {
            AllButton('取消', () => {
              set_modelVisit4(false)
            }, { type: '' })
          }
          <Button type="primary"
            onClick={() => {
              if (!!SELECTROWKEYS && SELECTROWKEYS?.length != 0) {
                batchUpdata()
              } else {
                message.warn('请至少选中一个数据来操作')
              }
            }}>确认</Button>
        </ButBox>
      </div>
    </Modal>
  </div>
};

export default connect(({ common, select }) => ({
  common,
  select
}))(User);
