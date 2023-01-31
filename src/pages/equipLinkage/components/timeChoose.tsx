import React, { useEffect, useState, useRef } from 'react';
import { useAntdTable } from 'ahooks';
import { connect } from "dva";
import type { Icommon } from '@/models/common';
import moment from 'moment';
import { PlusCircleOutlined, DeleteOutlined } from '@ant-design/icons';
import { Spin, Modal, Form, Pagination, Switch, Button, InputNumber, Input, Select, Checkbox, DatePicker } from 'antd';
interface prosType {
}
class NewTYpe {
  startTime: any
  endTime: any
}
interface timeChooseType {
  edit: boolean // 是否为编辑
  setTimeIdx?: number // 为自定义触发的时候 使用为二维的下标
  TimeSend: any // 
  setTimeSend: any //  set useState 参数 用来给父组件传递参数
}
const template = (props: any) => {
  let { TimeSend, setTimeSend, edit } = props
  let setTimeIdx = props['setTimeIdx'] || 0
  // 组件联动
  const [timeList, settimeList] = useState<any>(
    [
      {
        startTime: '',
        endTime: ''
      }
    ]
  );
  useEffect(() => {
    if (edit) {
      settimeList(TimeSend[setTimeIdx])
    }
  }, [])

  useEffect(() => {
    let newProps = TimeSend;
    newProps[setTimeIdx] = timeList;
    setTimeSend([...newProps])
  }, [timeList])

  // 时间选择
  const timeChange = (type: String, time: any, index: any) => {
    let newTimeList = [...timeList];

    if (type == 'start') {
      if (judgeTime(time, newTimeList[index]['endTime'])) {
        return
      }
      newTimeList[index]['startTime'] = time;

    } else {
      if (judgeTime(newTimeList[index]['startTime'], time)) {
        return
      }
      newTimeList[index]['endTime'] = time;

    }

    settimeList([...newTimeList])
  }
  const changeNum = (type: string, idxNo?: any) => {
    let newTimeList = [...timeList];
    if (type == 'add') {
      const type1 = new NewTYpe();
      newTimeList.push(type1)
      settimeList([...newTimeList])
    } else {
      if (newTimeList.length == 1) {
        return
      }
      newTimeList.splice(idxNo, 1)
      settimeList([...newTimeList])
    }
  }

  let judgeTime = (start: any, end: any) => {
    if (!(!!start) || !(!!end)) {
      return false
    }
    const format = 'HH:mm'
    const startTime = moment(start, format);
    const endTime = moment(end, format);

    const diff = moment(endTime).diff(moment(startTime), 'minutes')
    if (diff > 0) {
      return false
    } else {
      return true
    }

  }

  return (
    <>
      {
        timeList.map((res, idx) => {
          return <div style={{ marginBottom: '10px' }}>
            <DatePicker
              picker={'time'}
              format={'HH:mm'}
              value={(res.startTime != '' && res.startTime != null) ? moment(res.startTime, 'HH:mm') : ''}
              onChange={(e) => {
                timeChange('start', moment(e).format('HH:mm'), idx)
                // moment(e).format('LTS')
              }} />
            <span style={{ margin: '0px 5px', color: 'gray' }}> ——</span>
            <DatePicker
              picker={'time'}
              format={'HH:mm'}
              value={(res.endTime != '' && res.endTime != null) ? moment(res.endTime, 'HH:mm') : ''}
              onChange={(e) => {
                timeChange('end', moment(e).format('HH:mm'), idx)
              }} />
            <span onClick={() => {
              changeNum('add')
            }}>
              <PlusCircleOutlined style={{ fontSize: '20px', color: '#1db0ff', margin: '0px 12px' }} />
            </span>
            <span
              onClick={() => {
                changeNum('decrease', idx)
              }}
            >
              <DeleteOutlined style={{ color: '#c95f74', fontSize: '20px' }} />
            </span>
          </div>
        })
      }
      {/* <Button onClick={() => {
        console.log(timeList, '123546')
      }}>123</Button> */}
    </>
  )
}

export default connect(({ common, select }: { common: Icommon; select: any }) => ({
  common,
  select,
}))(template);

