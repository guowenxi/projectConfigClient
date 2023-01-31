import React, { useEffect, useState } from "react";
import { connect } from "dva";
import { Button, DatePicker, Form, Input, Modal, Pagination, Radio, Table, Tabs } from 'antd';
import { useAntdTable } from 'ahooks';
import globalStyle from '@/styles/global.less'
import { AllButton, ButBox, FormLineBox } from '@/commonStyles/commonTsx'
import columns from './column'
import styles from './index.module.less'
import commonStyle from '@/commonStyles/common.module.less'

import T1 from './compants/T1/index'
import T2 from './compants/T2/index'
import T3 from './compants/T3/index'

const { Column } = Table
const User: React.FC<any> = (props) => {
  const { dispatch } = props;
  const [SELECTROWKEYS, setSELECTROWKEYS] = useState([]); // 列表多选框
  const [rowSelectedData, setRowSelectedData] = useState<Record<string, any>>({}); // 表格选中样式
  const [DETAIL, set_DETAIL] = useState();
  const onRowAction = (record: Record<string, any>, index?: number): any => {
    return {
      onClick: (e: any) => {
        setRowSelectedData(record);
      },
    };
  };
  // 列表加载数据的方法
  //---------------

  return <div style={{ width: '100%', height: '100%' }}>
    <Tabs type='card'>
      <Tabs.TabPane tab="设备组" key="item-1">
        <T1 />
      </Tabs.TabPane>
      <Tabs.TabPane tab="设备参数" key="item-2">
        <T2 />
      </Tabs.TabPane>
      <Tabs.TabPane tab="能耗计费" key="item-3">
        <T3 />
      </Tabs.TabPane>
    </Tabs>
  </div>
};

export default connect(({ common, select }) => ({
  common,
  select
}))(User);
