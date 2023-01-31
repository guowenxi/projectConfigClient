import React, {useState, useMemo, useEffect} from 'react';
import {useImperativeHandle, forwardRef} from 'react';
import {Table, Form, Input, Spin, Popconfirm} from 'antd';
import type {Icommon} from '@/models/common';
import type {Iselect} from '@/models/select';

import {connect} from "dva";
import styled from 'styled-components';
import {useList} from 'react-use';
import {useAntdTable, useUpdate, useDynamicList, useUpdateEffect} from 'ahooks';
import type {PaginatedParams} from 'ahooks/lib/useAntdTable';

import {ButtonBox} from '@/globalStyled';
import type {AProps, AColumns} from '@/globalTyping';
import Item from '_antd@4.12.2@antd/lib/list/Item';


const {Column} = Table;
const {Search} = Input;

const TableBox = styled.div`
  flex: 1;

  .top-box {
    padding: 0 1.04vw;
    margin: 1.85vh 0 2.04vh;
  }

  .first-span {
    line-height: 36px;
    height: 36px;
    border-radius: 4px;
    color: #fff;
    background: #1572e8;
    margin-right: 10px;
    padding: 0 10px;
    cursor: pointer;

    &:hover {
      opacity: .8;
    }

    &:last-child {
      margin-right: 0;
    }
  }
`;
const MainBox = styled.div`
  display: flex;
  flex-flow: column;

  .table-full-box {
    width: 100%;
  }

  .pagination-box {
    padding: 1vh 0;

    .Pagination {
      float: right;
    }
  }

  .search-box {
    margin: 1vh 0;
    float: right;
  }
`;


interface Props extends AProps {
  common: any,
  params: any,
  url: string,
  columns: AColumns[],
  handle: Handle[],
  data: Record<string, any>,
  rowSelection: {},
  changeKey: string,
  rowKey: string,
  defaultValue: never[],
}

interface Handle {
  type: string,
  config?: {
    title: string,
    okText: string,
    cancelText: string,
  },
  name: string,
  bolName: string,
  click: any
}

let MixinTable: React.FC<Props> = (props) => {
  const {params, url, columns, handle, data, rowSelection, changeKey, defaultValue, changeList,checkboxType} = props;
  const {noSearch} = props;
  const update = useUpdate();
  const [form] = Form.useForm();
  const [SELINDEX] = useState(null);
  const [SELECTROWKEYS, setSELECTROWKEYS] = useState([]);

  const [list, {set, push}] = useList();

  const {dispatch} = props;
  const _params = !params ? {} : params;


  // useImperativeHandle(childRef, () => ({
  //   focus: () => {
  //     childRef.current.focus();
  //   },
  //   fun: () => {
  //     console.log('子组件的方法')
  //   }
  // }));


  // 默认加载的数据

  const getTableData = (
    {current, pageSize}: PaginatedParams[0],
    formData: Object,
  ): Promise<any> => {
    if (url) {
      return new Promise((resolve) => {
        dispatch({
          type: 'common/requestData',
          url,
          payload: {
            pageNo: current,
            pageSize,
            ...formData,
            ..._params,
          },
          callback: (_data: any) => {
            // 目前使用初始化过滤会造成无返回值的情况
            // filterList(_data.list)
            // const _list = _data.list ? _data.list : _data.data;
            resolve({
              list: _data.list || _data.data || _data,
              total: _data.total || _data.length
            })
          },
        });
      })
    }
    ;
    return new Promise((resolve) => {
      if (!data) resolve([]);
      data.total ?
        resolve(data)
        :
        resolve({
          list: data,
          total: data.length
        })
      // filterList(data)
    });

  };

  const {tableProps, search, loading} = useAntdTable(getTableData, {
    defaultPageSize: 10,
    form,
  });

  const {submit, reset} = search;
  props.childRef ? props.childRef.current = {
    reset: reset,
  } : null;
  // -------------------------------状态操作-------------------------------


  useEffect(() => {
    reset();
    (!defaultValue) ? setSELECTROWKEYS([]) : setSELECTROWKEYS(defaultValue);
  }, [changeKey]);

  //借此判断data值是否是默认取值(通过外部异步加载方式)
  useEffect(() => {
    if (!url && data && data.length > 0) {
      reset();
    }
  }, [data]);


  const filterList = (data) => {
    data.map((item) => {
      if (defaultValue.indexOf(item.id) >= 0) push(item);
    })
  }

  return (
    <TableBox>
      <Spin spinning={loading}>
        <MainBox>
          {
            !noSearch ?
              <Form
                form={form}
              >
                <Form.Item name={"keyword"} noStyle>
                  <Search
                    placeholder="姓名查询"
                    onSearch={submit}
                    style={{width: 200}}
                    className='search-box'
                  />
                </Form.Item>
              </Form> : null
          }
          <Table
            rowKey="id"
            // 无法刷新dom 因为数据层指向问题 先这么写
            dataSource={JSON.parse(JSON.stringify(tableProps.dataSource))}
            loading={tableProps.loading}
            onChange={tableProps.onChange}
            pagination={tableProps.pagination}
            // //如果要对列表进行多选的时候可以打开
            rowSelection={
              rowSelection ?
                {
                  preserveSelectedRowKeys: true,
                  selectedRowKeys: SELECTROWKEYS,
                  type: checkboxType ? checkboxType : "checkbox",
                  // getCheckboxProps(record){
                  //   return {
                  //     defaultChecked: SELECTROWKEYS.indexOf(record.id)>=0 ? true : false
                  //   }
                  // },
                  onChange: (ids: never[], items: Record<string, any>[]) => {
                    setSELECTROWKEYS(ids);
                    if (typeof (rowSelection) === "function") rowSelection(ids, items);
                  }
                } : null
            }
            // 如果当前行可选中则放开
            // onRow={rowSelect}
            className="virtual-table"
            rowClassName={(record) => (record.id === SELINDEX ? 'select-bg-color' : '')}
          >
            {columns.map((i) => {
              return (
                <Column
                  title={i.title}
                  dataIndex={i.dataIndex}
                  key={i.key}
                  className={i.className}
                  align={i.align}
                  width={i.width}
                  render={i.render}
                  onCell={(): any => ({width: i.width})}
                  onHeaderCell={(): any => ({width: i.width})}
                ></Column>
              );
            })}
            {
              handle ?
                <Column
                  title="操作"
                  render={(text, record) => {
                    return (
                      <ButtonBox>
                        {
                          handle.map((it: any): JSX.Element => {
                            let dom: JSX.Element;
                            switch (it.type) {
                              case "popconfirm" :
                                dom = <Popconfirm
                                  title={it.config.title}
                                  onConfirm={() => {
                                    text[it.booleanKey] = text[it.booleanKey] !== 1;
                                    it.click(text, record, search);
                                    update();
                                  }}
                                  okText={it.config.okText}
                                  cancelText={it.config.cancelText}
                                >
                                  <a>{
                                    text[it.booleanKey] === 1 ?
                                      it.name
                                      :
                                      it.bolName
                                  }</a>
                                </Popconfirm>
                                break;
                              case "boolean":
                                dom = <a onClick={() => {
                                  text[it.booleanKey] = !text[it.booleanKey];
                                  update();
                                  it.click(text, record, search)
                                }}>{
                                  text[it.booleanKey] === 1 ?
                                    it.name
                                    :
                                    it.bolName
                                }</a>
                                break;
                              default:
                                dom = <a onClick={(e) => (it.click(text, record, search))}>{it.name}</a>
                                break;
                            }
                            if (it.show == undefined || it.show) {
                              return dom;
                            } else {
                              return "";
                            }
                          })
                        }
                      </ButtonBox>
                    );
                  }}
                ></Column>
                : null
            }

          </Table>
        </MainBox>

      </Spin>
    </TableBox>
  );
};
// const TIMP =
export default connect(({common, select}: { common: Icommon, select: Iselect }) => ({
  common,
  select,
}))(MixinTable);

function ev(text: any, record: unknown, search: { type: "simple" | "advance"; changeType: () => void; submit: () => void; reset: () => void; }, ev: any): void {
  throw new Error('Function not implemented.');
}

// export default forwardRef((props, ref) => <TIMP {...props} refInstance={ref} />);
