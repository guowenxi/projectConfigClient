import React, { Component } from 'react';
import { useState, useEffect } from 'react';
import classNames from 'classnames';
import commonStyle from '@/common.less';
import { Table, Pagination } from 'antd';

import {connect} from "dva";
import type { Icommon } from '@/models/common';

const TablePagination: React.FC = (props) => {
  const [selectId, set_selectId] = useState<string>('');
  debugger;
  const { columns, listData } = props;
  const { pagination } = props.common;

  const { CURRENT, TOTAL, PAGESIZE } = pagination;

  return (
    <>
      <Table
        columns={columns}
        dataSource={listData}
        pagination={false}
        className={commonStyle['table-full-box']}
        onRow={rowSelect}
        //   rowClassName={(record) => (record.id === selectId ? 'select-bg-color' : '')}
      />
      <div className={commonStyle['pagination-box']}>
        <Pagination
          className={commonStyle.Pagination}
          defaultCurrent={1}
          current={CURRENT}
          total={TOTAL}
          pageSize={PAGESIZE}
          onChange={(page) => {
            changePage(page);
          }}
          showTotal={(total) => `共${total}条`}
        ></Pagination>
      </div>
    </>
  );
};

export default connect(({ common }: { common: Icommon }) => ({
  common,
}))(TablePagination);
