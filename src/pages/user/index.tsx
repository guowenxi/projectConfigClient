import React, { useEffect } from "react";
import { connect } from "dva";
import { Table } from 'antd';
import { useAntdTable } from 'ahooks';
import type { PaginatedParams } from 'ahooks/lib/useAntdTable';


const columns = [
  {
    title: 'title',
    dataIndex: 'title',
    key: 'title',
  },

  {
    title: 'create_time',
    dataIndex: 'create_at',
    key: 'create_at',
  },
];

const User: React.FC<any> = (props) => {
  console.log(props)
  const { dispatch } = props;

  // 列表加载数据的方法
  //---------------
  const getTableData = (
    { current, pageSize }: PaginatedParams[0],
    formData: Object,
  ): Promise<any> => {
    return new Promise((resolve) => {
      dispatch({
        type: 'test/getRequestData',
        method: 'GET',
        url: '/testApi/v1/topics',
        payload: {
          pageNo: current,
          pageSize,
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
      });
    });
  };
  const { tableProps, search } = useAntdTable(getTableData, {
    defaultPageSize: 10,
  });


  return <Table columns={columns} rowKey="id" {...tableProps} />;
};

export default connect(({ common, select }) => ({
  common,
  select
}))(User);
