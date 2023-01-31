import React, { useEffect, useState } from "react";
import { connect } from "dva";
import { Button, DatePicker, Form, Input, Modal, Pagination, Radio, Table, Select, Checkbox, message } from 'antd';
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
  const [showTime, set_showTime] = useState<any>([[], [], [], []]);
  const [DETAIL, set_DETAIL] = useState();

  const [modalVisit, set_modalVisit] = useState<any>(false);
  const [modalName, set_modalName] = useState<any>('编辑');

  const [modalVisit1, set_modalVisit1] = useState<any>(false);

  const [timeChoose, set_timeChoose] = useState<any>([[], [], [], [], [], [], []]); // 存储定时器的内容
  const [edit, set_edit] = useState(false); // 是否是编辑 编辑有一个内容的赋值
  const [allUpdateInfo, setallUpdateInfo] = useState<any>({
    triggerState: 2,
    loopState: 1
  });//信息存储
  const onRowAction = (record: Record<string, any>, index?: number): any => {
    return {
      onClick: (e: any) => {
        setRowSelectedData(record);
      },
    };
  };
  const [form] = Form.useForm();
  const [form2] = Form.useForm();

  let options: any = [
    { label: '星期一', value: '1' },
    { label: '星期二', value: '2' },
    { label: '星期三', value: '3' },
    { label: '星期四', value: '4' },
    { label: '星期五', value: '5' },
    { label: '星期六', value: '6' },
    { label: '星期日', value: '7' },
  ]

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
        url: '/evalCode/getSCheduleList',
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
  const { submit, reset } = search;

  let url = ''

  // 内容修改
  const onChange = (value: any, key: any) => {

    let newdata = {
      ...allUpdateInfo
    }

    newdata[key] = value

    setallUpdateInfo({ ...newdata })
  }

  const changeSwitch = (id: any, execute: any) => {
    dispatch({
      type: 'common/requestData',
      method: 'POST',
      url: url + '/evalCode/executeSChedule',
      payload: {
        id,
        execute
      },
      callback: (_data: any) => {
      },
    });
  }
  // 清空内容
  const clearInfo = () => {
    set_timeChoose([[], [], [], [], [], [], []])
    setallUpdateInfo({
      triggerState: 2,
      loopState: 1
    })
  }

  // 上传信息
  const UploadInfo = () => {
    let newUploadInfo = { ...allUpdateInfo }
    let timeSetDay = allUpdateInfo['timeSetting']
    let timeSetting = '';

    if (allUpdateInfo.triggerState == 2) {
      timeChoose[0] != undefined && timeChoose[0]?.map((res: any, idx: any) => {
        if (idx == timeChoose[0].length - 1) {
          timeSetting += `${res.startTime}-${res.endTime}`
        } else {
          timeSetting += `${res.startTime}-${res.endTime},`
        }
        // timeSetting.push(`${res.startTime}-${res.endTime}`)
      })
    } else if (allUpdateInfo.triggerState == 3) {
      let timechooseArry: any = [];
      timeSetDay.map((res: any, idx: any) => {
        let timeChooseObj = timeChoose[res - 1];
        if (timeChooseObj[0].startTime != '') {
          timechooseArry.push(timeChooseObj)
        }
      })
      // timeSetting = timechooseArry.join(',');
    }
    // return
    if (newUploadInfo['name'] == undefined || newUploadInfo['name'] == '') {
      message.warn('请输入计划名称')
      return
    }
    if (newUploadInfo['daySetting'] == undefined || newUploadInfo['daySetting'] == '') {
      message.warn('请设定周期')
      return
    }
    if (timeSetting == '-') {
      message.warn('请设定具体时间')
      return
    }
    dispatch({
      type: 'common/requestData',
      method: 'POST',
      url: url + '/evalCode/createSChedule',
      isother: true,
      payload: {
        ...newUploadInfo,
        timeSetting,
        execute: 0,
        triggerState: 2,
      },
      callback: (_data: any) => {
        set_modalVisit(false)
        message.success('上传成功')
        reset()
      },
    });
  }

  // 更新信息
  const upInfo = () => {
    let newUploadInfo = { ...allUpdateInfo }
    let timeSetDay = allUpdateInfo['timeSetting']
    let timeSetting = '';

    if (allUpdateInfo.triggerState == 2) {
      timeChoose[0].map((res: any, idx: any) => {
        if (idx == timeChoose[0].length - 1) {
          timeSetting += `${res.startTime}-${res.endTime}`
        } else {
          timeSetting += `${res.startTime}-${res.endTime},`
        }
        // timeSetting.push(`${res.startTime}-${res.endTime}`)
      })
    } else if (allUpdateInfo.triggerState == 3) {
      let timechooseArry: any = [];
      timeSetDay.map((res: any, idx: any) => {
        let timeChooseObj = timeChoose[res - 1];
        if (timeChooseObj[0].startTime != '') {
          timechooseArry.push(timeChooseObj)
        }
      })
      // timeSetting = timechooseArry.join(',');
    }

    dispatch({
      type: 'common/requestData',
      method: 'POST',
      url: url + '/evalCode/updateSChedule',
      isother: true,
      payload: {
        ...allUpdateInfo,
        timeSetting
      },

      callback: (_data: any) => {
        set_modalVisit(false)
        message.success('编辑成功')
        reset()
      },
    });
  }

  // 批量删除数据
  const delAllInfo = () => {
    // let id = ''
    // SELECTROWKEYS.map((res, idx) => {
    //   if (SELECTROWKEYS.length - 1 == idx) {
    //     id = id + res + ','
    //   } else {
    //     id += res
    //   }
    // })
    dispatch({
      type: 'common/requestData',
      method: 'POST',
      url: url + '/evalCode/deleteSCheduleList',
      isother: true,
      payload: {
        id: SELECTROWKEYS.join(',')
      },
      callback: (_data: any) => {
        reset()
      },
    });
  }


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
            <FormLineBox
              contentWidth={'10vw'}
            >
              <span>引擎方式</span>
              <div className="infoBox">
                <Select
                  style={{ width: '100%' }}
                  defaultValue="lucy"
                // onChange={handleChange}
                >
                  <Option value="jack">Jack</Option>
                  <Option value="lucy">Lucy</Option>
                </Select>
              </div>

            </FormLineBox>
          </Form.Item>

          <Form.Item
            label=""
            name="uname2"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <FormLineBox contentWidth={'10vw'}>
              <span>触发规则</span>
              <div className="infoBox">
                <Select
                  style={{ width: '100%' }}
                  defaultValue="lucy"
                // onChange={handleChange}
                >
                  <Option value="jack">Jack</Option>
                  <Option value="lucy">Lucy</Option>
                </Select>
              </div>

            </FormLineBox>
          </Form.Item>

          <Form.Item
            label=""
            name="uname2"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <FormLineBox>
              <span>执行情况</span>
              <div style={{ paddingTop: '8px' }}>
                <Radio.Group >
                  <Radio value={1}>全部</Radio>
                  <Radio value={2}>启用</Radio>
                  <Radio value={3}>禁用</Radio>
                </Radio.Group>
              </div>
            </FormLineBox>
          </Form.Item>

          <Form.Item
            label=""
            name="uname2"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <FormLineBox>
              <span>关键字</span>
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
    <ButBox type={'left'} style={{ marginBottom: '15px' }}>
      {
        AllButton('添加任务', () => { set_modalName('添加任务'), set_modalVisit(true) }, { type: 'add' })
      }
      {
        AllButton('批量删除', () => { }, { type: 'delte' })
      }
    </ButBox>

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
            width="20%"
            align='center'
            render={(text: any, record: any) => {
              return (
                <div>
                  <a onClick={() => { set_modalName('查看任务'), set_modalVisit(true) }} style={{ marginRight: '15px' }}>查看</a>
                  <a onClick={() => { set_modalName('编辑任务'), set_modalVisit(true) }} style={{ marginRight: '15px' }}>编辑</a>
                  <a style={{ marginRight: '15px' }}>逻辑设定</a>
                  <a onClick={() => { set_modalVisit1(true) }} style={{ marginRight: '15px' }}>执行记录</a>
                  <a style={{ color: 'red' }}>删除</a>
                </div>
              );
            }}
          ></Column>
        )}
      </Table>
    </div>

    {/* 详情 */}
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
            label="计划名称"
            name="uname1"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            style={{ width: '48%' }}
            label="引擎方式"
            name="uname1"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Select
              style={{ width: '100%' }}
            >
              <Option value="jack">Jack</Option>
              <Option value="lucy">Lucy</Option>
            </Select>
          </Form.Item>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Form.Item
            style={{ width: '48%' }}
            label="触发规则"
            name="uname1"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Select>
              <Option value="jack">Jack</Option>
            </Select>
          </Form.Item>
          <Form.Item
            style={{ width: '48%' }}
            label="循环方式"
            name="uname1"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Select
              style={{ width: '100%' }}
            >
              <Option value="jack">Jack</Option>
              <Option value="lucy">Lucy</Option>
            </Select>
          </Form.Item>
        </div>
        <Form.Item
          style={{ width: '100%' }}
          label="描述"
          name="uname1"
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          style={{ width: '100%' }}
          label="时间设定"
          name="t1"
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <div>
            <div style={{ marginBottom: '18px' }}>
              <Checkbox.Group options={options} defaultValue={['Pear']} />
            </div>

            <TimeChoose
              edit={false}
              setTimeIdx={0}
              TimeSend={timeset}
              setTimeSend={set_timeset}
            >
            </TimeChoose>
          </div>
        </Form.Item>
      </Form>
    </Modal>

    <Modal
      title='执行记录'
      visible={modalVisit1}
      onCancel={() => { set_modalVisit1(false) }}
      width={'50%'}
    >
      <div style={{ display: 'flex', marginBottom: '15px' }}>
        <FormLineBox
          contentWidth={'10vw'}
        >
          <span>引擎方式</span>
          <div className="infoBox">
            <Input />
          </div>

        </FormLineBox>
        <FormLineBox
          contentWidth={'10vw'}
        >
          <span>指令类型</span>
          <div className="infoBox">
            <Input />
          </div>

        </FormLineBox>
        <ButBox type={'left'}>
          {
            AllButton('搜索', () => { }, { type: 'primary' })
          }
          {
            AllButton('重置', () => { }, { type: '' })
          }
        </ButBox>
      </div>
      <div className={`${commonStyle['tableBox']}`}>
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
          {columns.tableColumns2
            ? columns.tableColumns2(props, tableProps).map((i: any, idx: number) => {
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
    </Modal>

  </div >
};

export default connect(({ common, select }) => ({
  common,
  select
}))(User);
