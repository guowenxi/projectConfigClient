import React, { useEffect, useRef, useState } from "react";
import { connect } from "dva";
import {
  Button, DatePicker, Form, Input, Modal,
  Pagination, Radio, Table, Select, Checkbox, Row, Col, Tabs, Tag, message
} from 'antd';
import { useAntdTable } from 'ahooks';
import type { PaginatedParams } from 'ahooks/lib/useAntdTable';
import globalStyle from '@/styles/global.less'
import { AllButton, ButBox, FormLineBox } from '@/commonStyles/commonTsx'
import columns from './column'
import styles from './index.module.less'
import commonStyle from '@/commonStyles/common.module.less'
import CheckAllCheckBox from '@/components/checkAllCheckBox/checkAllCheckBox' // 带全部的多选框
import locale from 'antd/es/date-picker/locale/zh_CN';
import moment from "moment";

const { RangePicker } = DatePicker;

const { Column } = Table
const { Option } = Select
const { TextArea } = Input;

const pushTypeList = [
  {
    id: 1,
    name: '钉钉'
  },
  {
    id: 2,
    name: '短信'
  }
]

const thePushWayList1 = [{ id: 1, name: '钉钉群机器人' }]

const thePushWayList2 = [{ id: 2, name: '阿里云短信' }]

const User: React.FC<any> = (props) => {
  const { dispatch } = props;

  const [SELECTROWKEYS, setSELECTROWKEYS] = useState([]); // 列表多选框
  const [rowSelectedData, setRowSelectedData] = useState<Record<string, any>>({}); // 表格选中样式
  const [timeset, set_timeset] = useState([[], [], [], []]); // 存储时间数组 根据有多少的数组来算
  const [DETAIL, set_DETAIL] = useState<any>({});

  const [AtCheck, set_AtCheck] = useState<any>(0);

  const [modalVisit, set_modalVisit] = useState<any>(false)
  const [modalName, set_modalName] = useState<any>('添加报警')

  const [modalVisit2, set_modalVisit2] = useState<any>(false)

  const [modalVisit3, set_modalVisit3] = useState<any>(false)

  const [modalVisit4, set_modalVisit4] = useState<any>(false)
  const [modalName4, set_modalName4] = useState<any>(false)

  const [pushType, set_pushType] = useState<any>(1);

  var checkBoxs1 = [
    {
      value: '112',
      key: '1'
    },
    {
      value: '22',
      key: '2'
    },
    {
      value: '12',
      key: '1'
    },
    {
      value: '13',
      key: '1'
    },
  ]
  var modalValue = '伽壹智慧物联提醒您，您管理的【默认】中【空调机组F01】的【伽壹空调当前温度】点位已触发报警，当前值为【25.0】，' +
    '报警类型为【数值报警】，【设定温度异常，请将空调设备成26度】'

  const [checkBoxs, set_checkBoxs] = useState<any>([]);

  const [systemAlarmList, set_systemAlarmList] = useState<any>([])
  const [RuleSystemList, set_RuleSystemList] = useState<any>([]);

  const [checekSystemAlarm, set_checekSystemAlarm] = useState<any>([]) // 系统报警check
  const [checekRuleAlarm, set_checekRuleAlarm] = useState<any>([]) // 规则报警check

  const [templateValue1, set_templateValue1] = useState<any>(null); // 系统报警模板
  const [templateValue2, set_templateValue2] = useState<any>(''); // 系统报警模板

  const [pushDetail, set_pushDetail] = useState<any>(null); // 推送详情

  const onRowAction = (record: Record<string, any>, index?: number): any => {
    return {
      onClick: (e: any) => {
        setRowSelectedData(record);
      },
    };
  };

  const [form] = Form.useForm();// 搜索框
  const [form2] = Form.useForm();// 添加配置
  const [form3] = Form.useForm(); // 推送记录form
  const [form4] = Form.useForm(); // 推送详情form

  const dom: any = useRef();

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
        url: '/systemAlarmPushManger/getSystemAlarmPushList',
        payload: {
          pageNo: current,
          pageSize,
          ...formData
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

  const getTableData2 = (
    { current, pageSize }: PaginatedParams[0],
    formData: any,
  ): Promise<any> => {
    formData = JSON.parse(JSON.stringify(formData))
    if (!(!!DETAIL && !!DETAIL.id)) {
      return
    }
    if (!!formData.time) {
      let [stateTime, endTime] = formData.time
      formData['startTime'] = moment(stateTime).format('YYYY-MM-DD')
      formData['endTime'] = moment(endTime).format('YYYY-MM-DD')
      formData['time'] = null
    }

    return new Promise((resolve) => {
      dispatch({
        type: 'common/getRequestData',
        method: 'GET',
        url: '/project-config/logs/getLogs',
        payload: {
          pageNo: current,
          pageSize,
          id: DETAIL.id,
          ...formData
        },
        callback: (_data: any) => {
          let list = _data.list;
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


  const tableObj2 = useAntdTable(getTableData2, {
    defaultPageSize: 10,
    form: form3
  });
  const tableProps2 = tableObj2.tableProps;
  const search2 = tableObj2.search;

  const submit2 = search2.submit
  const reset2 = search2.reset

  useEffect(() => {
    getPeopleList();
    getSytemAlarmList();
    getRuleAlarmList();
    getArryTest();
  }, [])

  const getArryTest = () => {
    let newString = "[\"{\\\"channelId\\\":\\\"ac511539\\\",\\\"connectionTime\\\":\\\"2022-12-16 11:47:29\\\",\\\"heartbeat\\\":\\\"60\\\",\\\"ipPort\\\":\\\"/192.168.1.52:51106\\\",\\\"status\\\":\\\"1\\\"}\"]"
    let i: any = newString.replaceAll('\\', '')
    i = newString.replaceAll('/', '')
    i = JSON.parse(i)
    let newarry: any = []
    i.map(res => {
      let newString = res.replaceAll('\\', '')
      newString = JSON.parse(newString)
      newarry.push({ ...newString })
    })
    console.log(newarry)
  }

  // 操作数据
  const overData = async () => {

    await form2.validateFields()
    let isAt = -1
    let data1 = form2.getFieldsValue()
    if (!!data1.receiverListJson) {
      isAt = data1.receiverListJson.indexOf('@')
    }

    if (isAt > -1) {
      data1.isAppoint = 1
      data1.receiverListJson.splice(isAt, 1)
    }
    if (modalName == '添加配置') {
      dispatch({
        type: 'common/getRequestData',
        method: 'POST',
        url: '/systemAlarmPushManger/addsystemAlarmPush',
        payload: {
          ...data1
        },
        callback: (_data: any) => {
          submit()
          message.success('添加成功')
          set_modalVisit(false)
        },
        error: (error: any) => {
          message.warn(error)
        },
      })
    } else {
      dispatch({
        type: 'common/getRequestData',
        method: 'POST',
        url: '/systemAlarmPushManger/editsystemAlarmPus',
        payload: {
          id: DETAIL.id,
          ...data1
        },
        callback: (_data: any) => {
          submit()
          message.success('添加成功')
          set_modalVisit(false)
        },
        error: (error: any) => {
          message.warn(error)
        },
      })
    }
  }

  const getDetail = (id: any) => {
    dispatch({
      type: 'common/getRequestData',
      method: 'GET',
      url: '/systemAlarmPushManger/getSystemAlarmPushDetail',
      payload: {
        id
      },
      callback: (_data: any) => {

        if (_data.isAppoint == 1) {
          _data.receiverListJson.push('@')
        }
        set_pushType(_data.pushType)
        form2.setFieldsValue({ ..._data, ..._data.pushConfig })
      },
      error: (error: any) => {
        message.warn(error)
      },
    });
  }

  // 获取人员列表
  const getPeopleList = () => {
    dispatch({
      type: 'common/getRequestData',
      method: 'GET',
      url: '/systemAlarmPushManger/getPeopleList',
      payload: {
      },
      callback: (_data: any) => {
        set_checkBoxs(_data)
      },
      error: (error: any) => {
        message.warn(error)
      },
    });
  }

  // 修改状态
  const changeInitiateMode = (id: any, status: any) => {
    dispatch({
      type: 'common/getRequestData',
      method: 'POST',
      url: '/systemAlarmPushManger/changeInitiateMode',
      payload: {
        id,
        status
      },
      callback: (_data: any) => {
        message.success('修改成功')
      },
      error: (error: any) => {
        message.warn(error)
      },
    });
  }

  //获取系统报警列表
  const getSytemAlarmList = (key?: any) => {
    dispatch({
      type: 'common/getRequestData',
      method: 'GET',
      url: '/systemAlarmPushManger/getSytemAlarmList',
      payload: {
        key
      },
      callback: (_data: any) => {
        set_systemAlarmList(_data)
      },
      error: (error: any) => {
        message.warn(error)
      },
    });
  }

  //获取规则报警列表
  const getRuleAlarmList = () => {
    dispatch({
      type: 'common/getRequestData',
      method: 'GET',
      url: 'http://192.168.1.244:30000/evalCode/getSCheduleWarningList',
      payload: {
      },
      callback: (_data: any) => {
        set_RuleSystemList(_data)
      },
      error: (error: any) => {
        message.warn(error)
      },
    });
  }

  // 保存数据报警关联列表
  const saveWarnBerelated = () => {

    let system_obj = [
      {
        value: '{项目名称}',
        replaceVale: '$1'
      },
      {
        value: '{设备名称}',
        replaceVale: '$2'
      },
      {
        value: '{参数项}',
        replaceVale: '$3'
      },
      {
        value: '{点位报警值}',
        replaceVale: '$4'
      },
      {
        value: '{报警类型}',
        replaceVale: '$5'
      },
      {
        value: '{文本}',
        replaceVale: '$6'
      },
      {
        value: '{任务名称}',
        replaceVale: '$7'
      },
    ]

    let before_system = document.getElementById('warnModal1')?.innerText.toString()
    system_obj.map((res) => {
      before_system = before_system?.replace(res.value, res.replaceVale)
    })

    let before_rule = document.getElementById('warnModal2')?.innerText.toString()
    system_obj.map((res) => {
      before_rule = before_rule?.replace(res.value, res.replaceVale)
    })

    let newConnectionList: any = []

    let newObj = {
      pushRecordType: 0,
      relationPushRecordId: DETAIL.id,
      relationAlarmId: null
    }

    checekSystemAlarm.map((res: any) => {
      newObj.pushRecordType = 1
      newObj.relationAlarmId = res
      newConnectionList.push({ ...newObj })
    })

    checekRuleAlarm.map((res: any) => {
      newObj.pushRecordType = 2
      newObj.relationAlarmId = res
      newConnectionList.push({ ...newObj })
    })

    dispatch({
      type: 'common/getRequestData',
      method: 'POST',
      url: '/systemAlarmPushManger/saveWarnBerelated',
      payload: {
        id: DETAIL.id,
        alarmTemplateSystem: before_system,
        alarmTemplateRule: before_rule,
        bindConfig: newConnectionList
      },
      callback: (_data: any) => {
        set_modalVisit2(false)
        message.success('修改成功')
      },
      error: (error: any) => {
        message.warn(error)
      },
    });

  }

  // 回显报警关联数据
  const dataBack = (id: any) => {
    dispatch({
      type: 'common/getRequestData',
      method: 'GET',
      url: '/systemAlarmPushManger/getWarnBerelated',
      payload: {
        id
      },
      callback: (_data: any) => {
        const { bindConfig, alarmTemplateSystem, alarmTemplateRule } = _data

        let newArry1: any = []
        let newArry2: any = []

        bindConfig.map((res: any, idx) => {
          if (res.pushRecordType == 1) {
            newArry1.push(res.relationAlarmId)
          } else if (res.pushRecordType == 2) {
            newArry2.push(res.relationAlarmId)
          }
        })

        set_checekSystemAlarm(newArry1)
        set_checekRuleAlarm(newArry2)

        set_templateValue1(alarmTemplateSystem)
        set_templateValue2(alarmTemplateRule)
      },
      error: (error: any) => {
        message.warn(error)
      },
    });
  }

  const replaceText = (templete: any, type: any) => {

    let newString = ''
    let endModal: any = null
    if (type == 1) {
      endModal = !!templete ? null : <>
        伽壹智慧物联提醒您， 您管理的
        <span contentEditable="false" className={`${styles['bluespan']}`}>{`{项目名称}`}</span>中
        <span contentEditable="false" className={`${styles['bluespan']}`}>{`{设备名称}`}</span>的
        <span contentEditable="false" className={`${styles['bluespan']}`}>{`{参数项}`}</span>参数已触发报警，当前值为
        <span contentEditable="false" className={`${styles['bluespan']}`}>{`{点位报警值}`}</span>，报警类型为
        <span contentEditable="false" className={`${styles['bluespan']}`}>{`{报警类型}`}</span>，
        <span contentEditable="false" className={`${styles['bluespan']}`}>{`{文本}`}</span>。
      </>
    } else if (type == 2) {
      endModal = !!templete ? null : <>
        伽壹智慧物联提醒您， 您管理的
        <span contentEditable="false" className={`${styles['bluespan']}`}>{`{项目名称}`}</span>中
        <span contentEditable="false" className={`${styles['bluespan']}`}>{`{任务名称}`}</span>任务已触发报警。
      </>
    }

    let system_obj = [
      {
        value: '{项目名称}',
        replaceVale: '$1'
      },
      {
        value: '{设备名称}',
        replaceVale: '$2'
      },
      {
        value: '{参数项}',
        replaceVale: '$3'
      },
      {
        value: '{点位报警值}',
        replaceVale: '$4'
      },
      {
        value: '{报警类型}',
        replaceVale: '$5'
      },
      {
        value: '{文本}',
        replaceVale: '$6'
      },
      {
        value: '{任务名称}',
        replaceVale: '$7'
      },
    ]

    if (!!templete) {
      system_obj.map((res: any, idx) => {
        if (!!newString) {
          if (newString.indexOf(res.replaceVale) > -1) {
            let [e1, e2] = newString?.split(res.replaceVale)
            newString = e2
            endModal = <>
              {
                endModal
              }
              {e1}<span contentEditable="false" className={`${styles['bluespan']}`}>{`${res.value}`}</span>
            </>
          }
        } else {
          if (templete.indexOf(res.replaceVale) > -1) {
            let [e1, e2] = templete?.split(res.replaceVale)
            newString = e2
            endModal = <>
              {e1}<span contentEditable="false" className={`${styles['bluespan']}`}>{`${res.value}`}</span>
            </>
          }
        }
      })
    }

    return endModal
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
      url: '/systemAlarmPushManger/delEquipConfigure',
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

  //设置推送详情 
  const setPushDetail = (record: any) => {
    if(!record.warnContent) record.warnContent = '暂无数据';
    form4.setFieldsValue(record)
    set_pushDetail(record)
  }

  // 调试发送短信
  const sendInfo = () => {
    dispatch({
      type: 'common/getRequestData',
      method: 'POST',
      url: '/project-config/logs/testPush',
      payload: {
        content: modalValue,
        type: DETAIL.pushType,
        id: DETAIL.id
      },
      callback: (_data: any) => {
        message.success('推送成功！')
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
      // layout="vertical"
      >
        <div style={{ display: 'flex' }}>
          <Form.Item
            label=""
            name="configName"
            rules={[{ required: false, message: '!' }]}
          >
            <FormLineBox
            >
              <span>配置名称</span>
              <Input placeholder="请输入配置名称" />
            </FormLineBox>
          </Form.Item>

          <Form.Item
            label=""
            name="pushType"
            rules={[{ required: false, message: '!' }]}
          >
            <FormLineBox style={{ width: '13vw' }}>
              <span>推送类型</span>
              <Select
                placeholder={'请选择推送类型'}
                style={{ width: '100%' }}
                onChange={(e1: any) => {
                  form.setFieldsValue({
                    pushType: e1
                  })
                }}
              >
                {
                  pushTypeList.map((res, idx) => {
                    return <Option value={res.id} key={res.name}>{res.name}</Option>
                  })
                }
              </Select>
            </FormLineBox>
          </Form.Item>

          {/* <Form.Item
            label=""
            name="uname2"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <FormLineBox>
              <span>关键字</span>
              <Input />
            </FormLineBox>
          </Form.Item> */}

          <Form.Item
            label=""
            name="status"
            rules={[{ required: false, message: '!' }]}
          >
            <FormLineBox>
              <span>启用状态</span>
              <div style={{ paddingTop: '8px' }}>
                <Radio.Group >
                  {/* <Radio value={'all'}>全部</Radio> */}
                  <Radio value={1}>启用</Radio>
                  <Radio value={0}>停用</Radio>
                </Radio.Group>
              </div>
            </FormLineBox>
          </Form.Item>

          <ButBox type={'right'}>
            {
              AllButton('搜索', () => { submit() }, { type: 'primary' })
            }
            {
              AllButton('重置', () => {
                reset()
              }, {})
            }
          </ButBox>
        </div>
      </Form>
      <ButBox type={'left'} style={{ marginBottom: '15px' }}>
        {
          AllButton('添加配置', () => { set_modalVisit(true), set_modalName('添加配置'), form2.resetFields() }, { type: 'add' })
        }
        {
          AllButton('删除配置', () => { delData(null, SELECTROWKEYS) }, { type: 'delte' })
        }
      </ButBox>
    </div>



    <div className={`${commonStyle['tableBox']}`}>
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
          ? columns.tableColumns(props, tableProps, { changeInitiateMode }).map((i: any, idx: number) => {
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
            width="20%"
            align='center'
            render={(text: any, record: any) => {
              return (
                <div>
                  <a onClick={() => {
                    set_modalVisit(true), set_modalName('修改配置'),
                      getDetail(record.id),
                      set_DETAIL(record)
                  }} style={{ marginRight: '15px' }}>编辑</a>
                  <a onClick={() => { set_modalVisit2(true), set_DETAIL(record), dataBack(record.id), getSytemAlarmList() }} style={{ marginRight: '15px' }}>报警关联</a>
                  <a onClick={() => {
                    set_modalVisit4(true);
                    set_modalName4('调试');
                    set_DETAIL(record)
                  }} style={{ marginRight: '15px' }}>调试</a>
                  <a onClick={() => {
                    set_modalVisit3(true)
                    set_DETAIL(record)
                    setTimeout(() => {
                      submit2()
                    }, 300);
                  }}
                    style={{ marginRight: '15px' }}>推送记录</a>
                  <a onClick={() => { delData(record.id) }} style={{ color: 'red' }}>删除</a>
                </div>
              );
            }}
          ></Column>
        )}
      </Table>
    </div>

    {/* 添加 - 修改 推送信息 */}
    <Modal
      visible={modalVisit}
      footer={false}
      width={'45%'}
      title={modalName}
      onCancel={() => { set_modalVisit(false) }}
    >
      <Form
        form={form2}
        layout="vertical"
      >
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Form.Item
            style={{ width: '48%' }}
            label="告警名称"
            name="name"
            rules={[{ required: true, message: '请输入告警名称!' }]}
          >
            <Input maxLength={25} />
          </Form.Item>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Form.Item
            style={{ width: '48%' }}
            label="推送类型"
            name="pushType"
            rules={[{ required: true, message: '请选择推送类型!' }]}
          >
            <Select
              style={{ width: '100%' }}
              onChange={
                (e1, e2: any) => {
                  set_pushType(e1)
                  form2.setFieldsValue({
                    pushName: ''
                  })
                }
              }
            >
              {
                pushTypeList.map((res, idx) => {
                  return <Option value={res.id} key={res.name}>{res.name}</Option>
                })
              }
            </Select>
          </Form.Item>
          <Form.Item
            style={{ width: '48%' }}
            label="推送方式"
            name="pushName"
            rules={[{ required: true, message: '请选择推送方式!' }]}
          >
            <Select
              style={{ width: '100%' }}
              onChange={
                (e1, e2: any) => {
                  // selectChange(res.attributeId, , 2)
                }
              }
            >
              {
                pushType == 1 ?
                  thePushWayList1.map((res, idx) => {
                    return <Option value={res.name} key={res.name}>{res.name}</Option>
                  }) :
                  thePushWayList2.map((res, idx) => {
                    return <Option value={res.name} key={res.name}>{res.name}</Option>
                  })
              }
            </Select>
          </Form.Item>
        </div>
        {
          pushType == 1 ?
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Form.Item
                  style={{ width: '48%' }}
                  label="webhook"
                  name="webhook"
                  rules={[{ required: true, message: '请输入webhook!' }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  style={{ width: '48%' }}
                  label="加签"
                  name="jiaqian"
                  rules={[{ required: false, message: '请输入加签!' }]}
                >
                  <Input />
                </Form.Item>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Form.Item
                  style={{ width: '100%' }}
                  label="指定人"
                  name="receiverListJson"
                  rules={[{ required: false, message: 'Please input your username!' }]}
                >
                  <Checkbox.Group
                    style={{ width: '100%' }}>
                    <Row>
                      <Col >
                        <Checkbox value={'@'}>@</Checkbox>
                      </Col>
                      {
                        checkBoxs.map((res: any, idx: any) => {
                          return <Col >
                            <Checkbox value={res.id}>{res.name}</Checkbox>
                          </Col>
                        })
                      }
                    </Row>
                  </Checkbox.Group>
                </Form.Item>
              </div>
            </>
            : <>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Form.Item
                  style={{ width: '48%' }}
                  label=" AccessKey ID"
                  name="AccessKeyId"
                  rules={[{ required: true, message: '请输入AccessKey ID' }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  style={{ width: '48%' }}
                  label="AccessKey Secret"
                  name="AccessKeySecret"
                  rules={[{ required: true, message: '请输入AccessKey Secret' }]}
                >
                  <Input />
                </Form.Item>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Form.Item
                  style={{ width: '48%' }}
                  label="签名"
                  name="sign"
                  rules={[{ required: true, message: '请输入签名' }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  style={{ width: '48%' }}
                  label="模板CODE"
                  name="CODE"
                  extra={<div style={{ color: "gray" }}>注：先按平台要求填写模版再添加到阿里云</div>}
                  rules={[{ required: true, message: '请输入模板CODE' }]}
                >
                   <Input />
                </Form.Item>
              </div>

              <div>
                <Form.Item
                  style={{ width: '100%' }}
                  label="联系人"
                  name="receiverListJson"
                  rules={[{ required: false, message: '请选择联系人!' }]}
                >

                  <Checkbox.Group style={{ width: '100%' }}>
                    <Row>
                      {
                        checkBoxs.map((res: any, idx: any) => {
                          return <Col>
                            <Checkbox value={res.id}>{res.name}</Checkbox>
                          </Col>
                        })
                      }
                    </Row>
                  </Checkbox.Group>
                </Form.Item>
              </div>

            </>
        }
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
      </Form>

    </Modal>

    {/* 报警关联 */}
    {
      modalVisit2 ? <Modal
        visible={modalVisit2}
        onCancel={() => { set_modalVisit2(false) }}
        footer={false}
        width={'45%'}
        title='报警关联'
      >
        <Tabs>
          <Tabs.TabPane tab="系统报警" key="item-1">
            <div className={`${styles['warnContentBox']}`}>
              <div className={`${styles['contentBox']}`}>
                <div className={`${styles['contentTitle']}`}>
                  系统报警列表
                </div>
                <div className={`${styles['warnListBox']}`} >
                  <Input onInput={(e1) => {
                    getSytemAlarmList(e1.currentTarget.value)
                  }} />
                  <Checkbox.Group
                    style={{ width: '100%', marginTop: "15px" }}
                    value={checekSystemAlarm}
                    onChange={(e1) => {
                      set_checekSystemAlarm(e1)
                    }}>
                    {
                      systemAlarmList.map((res: any, idx: any) => {
                        return <div>
                          <Checkbox
                            value={res.id}
                          >
                            {res.name}</Checkbox>
                        </div>
                      })
                    }
                  </Checkbox.Group>
                </div>
              </div>

              <div className={`${styles['contentBox']}`}>
                <div className={`${styles['contentTitle']}`} style={{ width: '100%', height: '18px' }}> </div>
                <div className={`${styles['modalBoxStyle']}`}>
                  <FormLineBox>
                    <span>报警模板</span>
                    <div className={`${styles['modalContentBox']}`} id='warnModal1' contentEditable="true">
                      {
                        replaceText(templateValue1, 1)
                      }
                    </div>
                  </FormLineBox>
                </div>
              </div>
            </div>

          </Tabs.TabPane>

          <Tabs.TabPane tab="规则报警" key="item-2">
            <div className={`${styles['warnContentBox']}`}>
              <div className={`${styles['contentBox']}`}>
                <div className={`${styles['contentTitle']}`}>
                  规则报警列表
                </div>
                <div className={`${styles['warnListBox']}`} >
                  <Input />
                  <Checkbox.Group style={{ width: '100%', marginTop: '15px' }}
                    value={checekRuleAlarm}
                    onChange={(e1) => {
                      set_checekRuleAlarm(e1)
                    }}
                  >
                    {
                      RuleSystemList.map((res: any, idx: any) => {
                        return <div>
                          <Checkbox value={res.warnId}>{res.name}</Checkbox>
                        </div>
                      })
                    }
                  </Checkbox.Group>
                </div>
              </div>

              <div className={`${styles['contentBox']}`}>
                <div className={`${styles['contentTitle']}`} style={{ width: '100%', height: '18px' }}> </div>
                <div className={`${styles['modalBoxStyle']}`}>
                  <FormLineBox>
                    <span>报警模板</span>
                    <div className={`${styles['modalContentBox']}`} id='warnModal2' contentEditable="true">
                      {
                        replaceText(templateValue2, 2)
                      }
                      {/* 伽壹智慧物联提醒您， 您管理的
                    <span contentEditable="false" className={`${styles['bluespan']}`}>{`{项目名称}`}</span>中
                    <span contentEditable="false" className={`${styles['bluespan']}`}>{`{任务名称}`}</span>任务已触发报警。 */}
                      {/* <span contentEditable="false">
                      <span className={`${styles['bluespan']}`} contentEditable="false">{`{条件1}`}</span>触发，
                      <span className={`${styles['bluespan']}`} contentEditable="false">{`{条件2}`}</span>触发。
                    </span> */}
                    </div>
                  </FormLineBox>
                </div>
              </div>
            </div>
          </Tabs.TabPane>
        </Tabs>

        <div style={{ padding: '20px 0px 5px', display: 'flex', justifyContent: 'center' }}>
          <ButBox type={'left'} >
            {
              AllButton('取消', () => {
                set_modalVisit2(false)
              }, { type: '' })
            }
            <Button type="primary"
              onClick={() => {
                saveWarnBerelated()
              }}>确认</Button>
          </ButBox>
        </div>
      </Modal >
        : ''
    }


    {/* 推送记录 */}
    < Modal
      visible={modalVisit3}
      onCancel={() => { search2.reset() ; set_modalVisit3(false) }}
      footer={false}
      width={'80%'}
      title='推送记录'
    >
      <Form
        form={form3}
        colon={false}
      >
        <div style={{ display: 'flex' }}>
          <Form.Item
            label="时间选择"
            name="time"
            style={{ marginRight: '15px' }}
            rules={[{ required: false, message: 'Please input your username!' }]}
          >
            {/* <DatePicker></DatePicker> */}
            <RangePicker locale={locale} />
          </Form.Item>

          <Form.Item
            label="关键字"
            name="keywords"
            style={{ marginRight: '15px' }}
            rules={[{ required: false, message: 'Please input your username!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="推送结果"
            name="pushResult"
            rules={[{ required: false, message: 'Please input your username!' }]}
          >
            <div >
              <Radio.Group >
                {/* <Radio value={1}>全部</Radio> */}
                <Radio value={1}>成功</Radio>
                <Radio value={0}>失败</Radio>
              </Radio.Group>
            </div>
          </Form.Item>

          <ButBox type={'right'}>
            {
              AllButton('搜索', () => { submit2() }, { type: 'primary' })
            }
            {
              AllButton('重置', () => { reset2() }, {})
            }
          </ButBox>
        </div>

        <div className={`${commonStyle['tableBox']}`} >
          <Table
            rowKey="id"
            {...tableProps2}
            pagination={{ ...tableProps2.pagination, showQuickJumper: true }}
            // 如果当前行可选中则放开
            onRow={onRowAction}
          >
            {columns.tableColumns2
              ? columns.tableColumns2(props, tableProps2).map((i: any, idx: number) => {
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
                      {/* <a style={{ marginRight: '15px' }}>重发</a> */}
                      <a onClick={() => {
                        set_modalVisit4(true);
                        set_modalName4('推送详情');
                        setPushDetail(record)
                      }} >详情</a>
                    </div>
                  );
                }}
              ></Column>
            )}
          </Table>
        </div>
      </Form>
    </ Modal>

    {/* 调试 - 详情*/}
    {
      modalVisit4 ? <Modal
        title={modalName4}
        visible={modalVisit4}
        onCancel={() => {
          set_modalVisit4(false)
        }}
        footer={false}
        width={'40%'}
      >
        {
          modalName4 == '调试' ? <>
            <FormLineBox style={{ marginBottom: '15px' }} lableWidth='5vw'>
              <span>调试内容</span>
              <div className="infoBox">
                <TextArea
                  autoSize={true}
                  rows={4}
                  style={{ width: '100%' }} disabled={true} value={modalValue} />
              </div>
            </FormLineBox>

            <FormLineBox lableWidth='5vw'>
              <span>调试结果</span>
              {
                AllButton('发送', () => { sendInfo() }, { type: 'primary' })
              }
            </FormLineBox>
          </>
            : ''
        }
        {
          modalName4 == '推送详情' ? <>
            <Form
              form={form4}
              colon={false}
            >
              <Form.Item
                label="推送内容"
                name="warnContent"
                rules={[{ required: false, message: '!' }]}
              >
                <TextArea
                  disabled={true}
                  autoSize={true}
                  rows={4} style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item
                label="发送结果"
                name="pushResult"
                rules={[{ required: false, message: '!' }]}
              >
                {
                  pushDetail.pushResult == 1 ? <Tag color="#0c98ec">成功</Tag>
                    : <Tag color="#ff6868">失败</Tag>
                }
              </Form.Item>
              <Form.Item
                label="失败原因"
                name="failReason"
                rules={[{ required: false, message: '!' }]}
              >
                <TextArea
                  disabled={true}
                  autoSize={true}
                  rows={4} style={{ width: '100%' }} />
              </Form.Item>
            </Form>
          </>
            : ''
        }
      </Modal>
        : ''
    }
  </div >
};

export default connect(({ common, select }) => ({
  common,
  select
}))(User);
