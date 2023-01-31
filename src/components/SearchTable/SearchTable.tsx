import React, { useState, useEffect,useMemo } from 'react';
import thisStyle from './SearchMore.less';
import { DatePicker, Input, Select, Button, InputNumber, TimePicker ,Tree, Table} from 'antd';
import moment from 'moment/moment';
import styled from 'styled-components';
import { Form } from 'antd';
import { useAntdTable } from 'ahooks';
import type { PaginatedParams } from 'ahooks/lib/useAntdTable';
import {filterKeys } from '@/utils/utils';

import {connect} from "dva";

// const { MonthPicker, RangePicker, WeekPicker } = DatePicker;
const { Column } =Table;

const ContentBox = styled.div`
position: relative;
left:0;
width: 100%;
`;

interface Props{
  columnList: [
    {
      title: string,
      dataIndex: string,
      key: string,
      align: string,
      width: string,
    }
  ],/* 列表设置 */
  url: string;
  params: Record<string, string>;
  tableUrl: string,/* 列表接口 */
  dispatch: any;
}


const SearchTable= (props: Props) => {
  const { dispatch } = props;
  const [form] = Form.useForm();

  const {columnList,url,params } = props;


    // 默认加载的数据

    const getTableData = (
      { current, pageSize }: PaginatedParams[0],
      formData: Object,
    ): Promise<any> => {
      if (url) {

        return dispatch({
          type: 'common/requestData',
          url,
          payload: {
            pageNo: current,
            pageSize,
            ...formData,
            ...params,
          },
          callback: (_data) => {},
        });
      }
        return new Promise(function(reslove,reject){
          data.total ?
          reslove(data)
          :
          reslove({
            list:data,
            total:data.length
          })
      });

    };

    const { tableProps, search, loading } = useAntdTable(getTableData, {
      defaultPageSize: 10,
      form,
    });


    const { type, changeType, submit, reset } = search;


  useMemo(() => {

  }, []);


  /* 按钮操作 */
  const tableClick=(text,record)=>{
    props.tableClick(text,record)
  }


  return (
    <ContentBox >
      <Table  {...tableProps}
            // 如果当前行可选中则放开
            // onRow={rowSelect}
            className="virtual-table"
            // rowClassName={(record) => (record.id === SELINDEX ? 'select-bg-color' : '')}
            >
                  {
                columnList.map((i,idx)=>{
                  if(i.btnList){
                    return <Column title={i.title} dataIndex={i.dataIndex} key={i.key} className={i.className} align={i.align}  width={i.width}
                  onCell={() => ({width: i.width})}
                  onHeaderCell={() => ({width: i.width})}
                  render={(text, record) => {
                    return (
                      <span>
                        {
                          i.btnList.map((item,index)=>{
                          return <a onClick={()=>(tableClick(item,record))}>{item}</a>
                          })
                        }
                    </span>
                    );
                  }}
                  >
                  </Column>
                  }
                    return <Column title={i.title} dataIndex={i.dataIndex} key={i.key} className={i.className} align={i.align}  width={i.width}
                  onCell={() => ({width: i.width})}
                  onHeaderCell={() => ({width: i.width})}
                  >
                  </Column>

                })
                }
            </Table>
    </ContentBox>
  );
};

export default connect(({ common, select }: { common: Icommon }) => ({
  common,
  select,
}))(SearchTable);

