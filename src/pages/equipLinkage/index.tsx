import React, { useEffect, useState, useRef } from 'react';
import { useAntdTable, useEventEmitter } from 'ahooks';
import { connect } from "dva";
import styled from 'styled-components';
import { Spin, Modal, Form, Pagination, Switch, Button, InputNumber, Row, Col, Radio, Table, Input, Select, Checkbox, DatePicker, message } from 'antd';
// import { RightCircleOutlined } from '@ant-design/icons';
import type { Icommon } from '@/models/common';
import type { PaginatedParams } from 'ahooks/lib/useAntdTable';
import styles from './styles.less';
import commStyle from './myStyle.less'
import columns from './columns'
// import { filterKeys } from '@/utils/utils';
const { Column } = Table;
const Option = Select.Option;
const Group = Checkbox.Group;
import { AllButton, ButBox, FormLineBox } from '@/commonStyles/commonTsx'
import commonStyle from '@/commonStyles/common.module.less'
// import SlideCarousel from './components/SlideshowList';
import TimeChoose from './components/timeChoose'
// import TimeChoose from '@/components/ActiveTimeChoose/timeChoose'
// import TodayAlarm from './components/TodayAlarm';
import type { AProps } from '@/globalTyping';

import { Scrollbars } from 'react-custom-scrollbars';
import { G } from '@/global';
import { SearchOutlined } from '@ant-design/icons';
const { rbacToken } = G;

// 按键box
// export const ButBox = styled.div<{ butSize: any, pos?: any }>`
//   display: flex;
//   ${(props) => {
//     if (props.pos) {
//       if (props.pos == 'right') {
//         return ` 
//         width:'100%';
//         justify-content: right;
//         `
//       }
//     }
//     return `
//     width:${props.butSize * 110}px;
//     justify-content: space-between;
//     `
//   }}
// `;
// 搜索按键
export const SearchBut = () => {
  return <span style={{ display: "inline-block", backgroundColor: '#1db0ff', padding: '3px 12px 0px', borderRadius: '4px' }}>
    <SearchOutlined style={{ color: 'white', fontSize: '23px' }} />
  </span>
}
// 报格样式
const FormItem = styled.div`
  display:flex;
  align-items:center;
  margin-bottom:27px;
  >div:nth-child(1){
    // color:white;
    min-width:120px;
    letter-spacing: 7px;
  }
  >div:nth-child(2){
    min-width:300px;
  }
`

// 静态数据
const chekcRule = [
  // {
  //   key: '1',
  //   value: '始终触发'
  // },
  {
    key: '2',
    value: '定时触发'
  },
  // {
  //   key: '3',
  //   value: '自定义触发'
  // },
];
const loopList = [
  { key: '1', value: '否' },
  { key: '2', value: '是' }
]
const weekDataType1 = [
  { value: '1', label: '星期一' },
  { value: '2', label: '星期二' },
  { value: '3', label: '星期三' },
  { value: '4', label: '星期四' },
  { value: '5', label: '星期五' },
  { value: '6', label: '星期六' },
  { value: '7', label: '星期日' }
]
// 可能需要设置滚动条，所以抽出来自己搞
const TableMoreBox = styled.div`
  .time-line-box {
    margin-top: 1vh;
  }
  .ant-spin-nested-loading {
    position: relative;
    height: 100%;
    .ant-spin-container {
      position: absolute;
      top: 0;
      display: flex;
      flex-flow: column;
      width: 100%;
      height: 100%;
      .top-btn-box {
        margin-bottom: 2.04vh;
      }
      .fy-common-bottom-box {
        display: flex;
        flex-flow: column;
        height: 100%;
        flex: 1;
      }
      .ant-table-wrapper {
        flex: 1;
        height: 85%;
        .ant-table {
          flex: 1;
          height: 85%;
          .ant-table-container {
            height: 100%;
            overflow-y: auto;
          }
        }
      }
      .ant-pagination {
        display: flex;
        justify-content: flex-end;
      }
    }
  }
`;

interface _Props extends AProps {
  dispatch: any;
}
const template = (props: any) => {

  const { dispatch } = props
  const [SELECTROWKEYS, setSELECTROWKEYS] = useState([]); // 列表多选框
  const [rowSelectedData, setRowSelectedData] = useState<Record<string, any>>({}); // 表格选中样式
  const [modelState, set_modelState] = useState(false);//弹出框开关
  const [timeChoose, set_timeChoose] = useState<any>([[], [], [], [], [], [], []]); // 存储定时器的内容
  const [showTime, set_showTime] = useState<any>([[], [], [], [], [], [], []]);
  const [edit, set_edit] = useState(false); // 是否是编辑 编辑有一个内容的赋值
  // table相关
  const [form] = Form.useForm();
  const [allUpdateInfo, setallUpdateInfo] = useState<any>({
    triggerState: 2,
    loopState: 1
  });//信息存储
  const [taskSetState, set_taskSetState] = useState(false);
  const [searchInfo, set_searchInfo] = useState<any>({});
  /* 行选中 */
  const onRowAction = (record: Record<string, any>, index?: number): any => {
    return {
      onClick: (e: any) => {
        setRowSelectedData(record);
      },
    };
  };
  // http://192.168.1.145:3000/evalCode/getSCheduleList?pageNo=1&pageSize=10
  // let url = 'http://192.168.1.244:30000'; //线上
  let url = 'http://192.168.1.145:30000'; //线下
  // ----------------------------------------------
  // 列表加载数据的方法
  const getTableData = (
    { current, pageSize }: PaginatedParams[0],
    formData: Object,
  ): any => {
    return new Promise((resolve) => {
      dispatch({
        type: 'common/getRequestData',
        method: 'GET',
        url: url + columns.url,
        payload: {
          pageNo: current,
          pageSize,
          ...searchInfo
        },
        callback: (_data: any) => {
          const { data, list } = _data;
          resolve({
            list: list,
            total: _data.total,
          });
        },
      });
    });
  };

  const { tableProps, search } = useAntdTable(getTableData, {
    defaultPageSize: 10,
    form
  })
  const { submit, reset } = search;

  //-----------------------------------------------------
  // const focus$ = useEventEmitter();
  // const send$ = useEventEmitter();
  // (
  //   function () {
  //     focus$.useSubscription((e) => {

  //     })
  //   }()
  // )

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
      type: 'common/getRequestData',
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
      type: 'common/getRequestData',
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
        set_modelState(false)
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
      type: 'common/getRequestData',
      method: 'POST',
      url: url + '/evalCode/updateSChedule',
      isother: true,
      payload: {
        ...allUpdateInfo,
        timeSetting
      },

      callback: (_data: any) => {
        set_modelState(false)
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
    let flage = window.confirm('确认删除')
    if (!flage) {
      return
    }
    if (SELECTROWKEYS.length == 0) {
      message.error('未选中任何数据')
      return
    }
    dispatch({
      type: 'common/getRequestData',
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

  return <div className='right-main-box' >
    <Spin spinning={false}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <ButBox type={'left'} style={{ marginBottom: '15px' }}>
          {
            AllButton('添加报警', () => {
              clearInfo()
              set_modelState(true)
              set_edit(false)
            }, { type: 'add' })
          }
          {
            AllButton('批量删除', () => {
              delAllInfo()
            }, { type: 'delte' })
          }
        </ButBox>
        {/* <ButBox butSize={2}>
          <Button onClick={() => {
            clearInfo()
            set_modelState(true)
            set_edit(false)
          }} className={commStyle['but-color-glod-all']}>新增</Button>
          <Button onClick={() => {
            delAllInfo()
          }} className={commStyle['but-color-glod-line']}>批量删除</Button>
        </ButBox> */}
        <span style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ marginRight: '15px', minWidth: '60px' }}>计划名称</span>
          <span style={{ marginRight: '15px' }}>
            <Input
              placeholder='计划名称'
              maxLength={25}
              style={{ minWidth: '200px' }}
              onInput={(e: any) => {
                set_searchInfo({
                  name: e.target.value
                })
              }}
            />
          </span>
          <span onClick={
            submit
          }>
            {SearchBut()}
          </span>
        </span>
      </div>

      <div className={`${commonStyle['tableBox']}`}>
        <Table
          rowKey="id"
          {...tableProps}
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
          className={`virtual-table  ${styles['scroll-table-box']}`}
          rowClassName={(record: Record<string, any>) =>
            record.id === rowSelectedData.id ? styles['select-bg-color'] : ''
          }
        >
          {columns.tableColumns
            ? columns.tableColumns(props, tableProps, { changeSwitch: changeSwitch }).map((i: any, idx: number) => {
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
              width="15%"
              align='center'
              render={(text: any, record: any) => {
                return (
                  <div className={styles['tableOperateBox']}>
                    <a
                      style={{ marginRight: '15px' }}
                      onClick={() => {
                        let arry1 = record.timeSetting.split(',')
                        let arry2: any = []
                        arry1.map((res1: any, idx1: any) => {
                          let arry = res1.split('-')
                          arry2.push({
                            startTime: arry[0],
                            endTime: arry[1]
                          })
                        })
                        // set_showTime([[...arry2]])
                        set_timeChoose([[...arry2]])
                        set_edit(true)
                        set_modelState(true)
                        setallUpdateInfo({ ...record })
                      }}>
                      编辑
                    </a>
                    {/* <a >查看</a> */}
                    <Button
                      type='primary'
                      onClick={() => {
                        setallUpdateInfo({ ...record })
                        set_taskSetState(true)
                      }}
                      className={commStyle['but-color-glod-all']}>任务设定</Button>
                  </div>
                );
              }}
            ></Column>
          )}
        </Table>
      </div>
    </Spin>
    {/* 弹出框 */}
    {
      modelState ?
        <Modal
          visible={modelState}
          title={edit ? "计划编辑" : "计划新增"}
          onCancel={() => {
            clearInfo();
            set_modelState(false)
          }}
          footer={false}
          style={{
            minWidth: '35vw'
          }}
        >
          <div>
            <FormItem>
              <div><span style={{ color: 'red' }}>*</span>计划名称</div>
              <div>
                <Input
                  maxLength={25}
                  placeholder='请输入'
                  value={allUpdateInfo['name']}
                  onInput={(e: any) => {
                    onChange(e.target.value, 'name')
                  }}
                />
              </div>
            </FormItem>

            <FormItem>
              <div>
                <span style={{ color: 'white' }}>*</span>描&nbsp;&nbsp;&nbsp;&nbsp;述
              </div>
              <div>
                <Input
                  maxLength={50}
                  placeholder='请输入'
                  value={allUpdateInfo['describe']}
                  onInput={(e: any) => {
                    onChange(e.target.value, 'describe')
                  }}
                />
              </div>
            </FormItem>

            <FormItem>
              <div><span style={{ color: 'white' }}>*</span>触发规则</div>
              <div>
                <Select style={{ width: '100%' }}
                  value={chekcRule[allUpdateInfo['triggerState'] - 2].value}
                  onChange={
                    (value, e: any) => {
                      onChange(e.key, 'triggerState')
                    }
                  }
                >
                  {
                    chekcRule.map((res, idx) => {
                      return <Option key={res.key} value={res.value}>
                        {res.value}
                      </Option>
                    })
                  }
                </Select>
              </div>
            </FormItem>

            <FormItem>
              <div><span style={{ color: 'white' }}>*</span>循环触发</div>
              <div>
                <Select style={{ width: '100%' }}
                  value={loopList[allUpdateInfo['loopState'] - 1].value}
                  onChange={
                    (value, e: any) => {
                      onChange(e.key, 'loopState')
                    }
                  }
                >
                  {
                    loopList.map((res, idx) => {
                      return <Option key={res.key} value={res.value}>
                        {res.value}
                      </Option>
                    })
                  }
                </Select>
              </div>
            </FormItem>

            <FormItem style={{ alignItems: "flex-start" }}>
              <div><span style={{ color: 'red' }}>*</span>时间设定</div>
              {
                allUpdateInfo.triggerState == 2 ?
                  <div style={{ minWidth: '329px', maxWidth: '400px' }}>
                    <Checkbox.Group
                      style={{ marginBottom: '15px' }}
                      options={weekDataType1}
                      defaultValue={allUpdateInfo['daySetting']?.split(',')}
                      onChange={(value) => {
                        onChange(value.join(','), 'daySetting')
                      }} />
                    <div style={{ minWidth: '250px', overflowY: 'auto', maxHeight: '350px', padding: '0px 2px' }}>
                      <TimeChoose
                        isMuuilt={false}
                        setTimeSend={set_timeChoose}
                        TimeSend={timeChoose}
                        edit={edit}
                      ></TimeChoose>
                    </div>
                  </div> :
                  allUpdateInfo.triggerState == 3 ?
                    <div style={{ minWidth: '329px', overflowY: 'auto', maxHeight: '400px', padding: '0px 10px' }}>
                      <Group
                        onChange={(e) => {
                          onChange(e, 'daySetting')
                        }}
                      >
                        {
                          weekDataType1.map((res, idx) => {
                            return <div style={{ marginBottom: '10px', display: 'flex' }}>
                              <Checkbox value={res.value} key={idx} style={{ color: 'white', marginTop: '5px' }}>
                                {res.label}
                              </Checkbox>
                              <div>
                                <TimeChoose
                                  // isMuuilt={true}
                                  setTimeIdx={idx}
                                  TimeSend={showTime}
                                  setTimeSend={set_timeChoose}
                                  edit={edit}
                                ></TimeChoose>
                              </div>
                            </div>
                          })
                        }
                      </Group>
                    </div> : ''
              }
            </FormItem>
          </div>
          <div style={{ padding: '20px 0px 5px', display: 'flex', justifyContent: 'center' }}>
            <ButBox type={'left'} >
              {
                AllButton('取消', () => {
                  clearInfo();
                  set_modelState(false)
                }, { type: '' })
              }
              <Button
                type="primary"
                onClick={() => {
                  if (edit) {
                    upInfo()
                  } else {
                    UploadInfo()
                  }
                }}>确认</Button>
            </ButBox>
          </div>
          {/* <ButBox butSize={'2'} pos={'right'}>
            <Button
              onClick={() => {
                clearInfo();
                set_modelState(false)
              }}
              className={`${commStyle['but-color-lightblue-line']}`}>取消</Button>
            <Button
              className={`${commStyle['but-color-lightblue-all']}`}
              style={{ marginLeft: '20px' }}
              onClick={() => {
                if (edit) {
                  upInfo()
                } else {
                  UploadInfo()
                }
              }}>确认</Button>
          </ButBox> */}

        </Modal>
        : ''
    }

    {
      taskSetState ?
        <Modal
          title="任务设定"
          visible={taskSetState}
          width={'85%'}
          footer={false}
          onCancel={
            () => {
              set_taskSetState(false)
            }
          }
        >
          <div style={{ width: '100%', height: '70vh' }}>
            <iframe
              // src={`http://127.0.0.1:20085/blockly-demo/index.html?id=${allUpdateInfo.id}&rbacToken=${JSON.parse(localStorage.getItem('loginParam'))?.tokenValue}`}
              src={`http://192.168.1.244:8888/index.html?id=${allUpdateInfo.id}&rbacToken=${JSON.parse(localStorage.getItem('loginParam'))?.tokenValue}`}
              style={{ width: '100%', border: '0px', height: '100%' }}
            >
            </iframe>
          </div>
        </Modal>
        : ''
    }
  </div>
}

export default connect(({ common, select, nestcommon }: { common: Icommon; select: any; nestcommon: any }) => ({
  common,
  select,
  nestcommon
}))(template);