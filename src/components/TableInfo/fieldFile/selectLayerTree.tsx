import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';

import {connect} from "dva";

import { Button, Modal, Tag } from 'antd';
import type { Iconf } from '../TableInfo';
import { wrapContext } from '../TableInfo';
import { ShowData } from './_css_comm';
import { Form } from 'antd';

import TreeBox from '../../TreeBox/TreeBox';
import MixinTable from '../../MixinTable/MixinTable';

const AModal = styled(Modal)`
  && {
    width: 70vw !important;
    .select-tree-modal-box {
      display: flex;
      width: 100%;
      margin-top: 5vh;
      .tree-box-main-box {
        width: 30%;
        margin-right: 1vw;
      }
    }
  }
`;

const NButton = styled(Button)`
  margin: 1vh;
`;

const DisplayTextBox = styled.div`
  display: flex;
  flex-flow: row wrap;
  .text-display {
    margin: 1vh;
    line-height: 32px;
  }
`;

const SelectTableBox = styled.div`
  width: 100%;
  border: 1px solid #ccc;
  display: flex;
  align-items: center;
  .select-main-box {
    display: flex;
    flex-flow: row wrap;
    .select-item-box {
      margin: 1vh;
    }
  }
`;

interface Ioptions {
  name: string;
  id: number;
}
interface IconfSelect extends Iconf {
  placeholder?: string;
  relationType: string;
  options: Ioptions[];
  defaultValue: string;
}
interface ISelect {
  dispatch?: any;
  conf: IconfSelect;
  name: string;
  rules: any;
}

const SelectTree: React.FC<ISelect> = (props) => {
  const _: any = props.conf;
  const { name } = props;
  const theme: any = useContext(wrapContext);
  const __ = _.tableSetting ? _.tableSetting : {};

  const [visible, setVISIBLE] = useState(false); /* 模态层状态 */
  const [OPTION, setOPTION] = useState<any>([]); /* 树形数据 */
  const [selTreeListData, setSelTreeListData] = useState(_.defaultValue);
  const [tableData, setTableData] = useState([]);

  const selTree = () => {
    setVISIBLE(true);
  };

  /* 获取数据 */
  function filterData(namespace: string, conf: any) {
    let _op = [];
    if (conf.relationType) {
      _op = props[namespace][conf.relationType];
    } else if (conf.url) {
      // 暂不支持使用url地址
      // let data = useRequest({
      //   url:process.env.ROOT_URL_HTTP+joinUrl(conf.url,conf.params),
      //   method:"GET",
      // })
      // setOPTION(data.data);
    } else {
      _op = conf.options;
    }
    setOPTION(_op);
    getDefaultData(_op);
  }

  // 只在初始化时进行加载
  useEffect(() => {
    filterData('select', _);
  }, []);

  /* 选中数据 */
  const onCheck = (data: any, info: any) => {
    // if(Array.isArray(data.data[0].userList)){

    // }
    if (__.getValueKey) {
      switch (__.getValueKey) {
        case 'item':
          setSelTreeListData(data);
          setTableData(info.checkedNodes);
          break;
      }
    } else {
      setSelTreeListData(info.checkedNodes);
      setTableData(info.checkedNodes[0].userList);
    }
  };
  /* 选中数据 */
  const onSelect = (data: any) => {
    setSelTreeListData(data.list);
    if (Array.isArray(data.data[0].userList)) {
    }
    setTableData(data.data);
  };

  /* 取消弹框 */
  const cancelModal = () => {
    setVISIBLE(false);
  };

  /* 展示数据 */
  const displayText = () => {
    const info = theme.form.getFieldValue(name);
    const list: any = [];
    if (Array.isArray(info)) {
      OPTION.map((item01: any) => {
        info.map((item02: any) => {
          if (item01.id === item02) {
            list.push(item01.name);
          }
        });
      });
    }
    return list;
  };

  /* 赋初始值 */
  const getDefaultData = (optionList: any) => {
    const info = theme.form.getFieldValue(name);
    const list: any = [];
    if (Array.isArray(info)) {
      optionList.map((item01: any) => {
        info.map((item02: any) => {
          if (item01.id === item02) {
            list.push(item01);
          }
        });
      });
    }
    setSelTreeListData(info);
    setTableData(list);
  };

  return (
    <wrapContext.Consumer>
      {(_data: any): any => {
        switch (_data.state) {
          case 'default':
            // return <ShowData>{VAL}</ShowData>;
            return <ShowData></ShowData>;
            break;
          case 'edit':
          case 'new':
          case 'disabled':
            return (
              <DisplayTextBox>
                <Form.Item name={name} noStyle rules={props.rules}>
                  {/* <NButton onClick={selTree}>选择</NButton>
                  <div className="text-display">{displayText()}</div> */}
                  <SelectTableBox>
                    <div className="select-main-box">
                      {Array.isArray(displayText())
                        ? displayText().map((item: any) => {
                            return (
                              <Tag
                                className="select-item-box"
                                // closable
                                // onClose={e => {
                                //   e.preventDefault();
                                //   deleteTableData(item,idx)
                                // }}
                              >
                                {item}
                              </Tag>
                            );
                          })
                        : ''}
                    </div>
                    <NButton type="primary" onClick={() => selTree()}>
                      选择
                    </NButton>
                  </SelectTableBox>
                </Form.Item>
                <AModal
                  visible={visible}
                  onOk={() => {
                    cancelModal();
                    theme.form.setFieldsValue({
                      [name]: selTreeListData,
                    });
                  }}
                  onCancel={() => {
                    cancelModal();
                    const info = theme.form.getFieldValue(name);
                    theme.form.setFieldsValue({
                      [name]: info,
                    });
                    getDefaultData(OPTION);
                  }}
                >
                  <div className={'select-tree-modal-box'}>
                    <TreeBox
                      data={OPTION}
                      selectable={false}
                      onCheck={onCheck}
                      onSelect={onSelect}
                      checkedTreeKeys={selTreeListData}
                      className={'tree-box-main-box'}
                    ></TreeBox>
                    <MixinTable
                      columns={__.columnList}
                      data={tableData}
                      handle={[
                        {
                          type: 'popconfirm',
                          bolName: '删除',
                          click: (text: any, record: any, search: any) => {
                            tableData.map((item: any, idx: number) => {
                              if (item.key == text.key) {
                                tableData.splice(idx, 1);
                              }
                            });
                            setTableData(tableData);
                            search.reset();
                            if (__.getValueKey) {
                              switch (__.getValueKey) {
                                case 'item':
                                  const list: any = [];
                                  tableData.map((item: any) => {
                                    list.push(item.id);
                                  });
                                  setSelTreeListData(list);
                                  break;
                              }
                            }
                          },
                          config: {
                            okText: '确认',
                            cancelText: '取消',
                            title: '是否确认删除？',
                          },
                        },
                      ]}
                      changeKey={tableData}
                    ></MixinTable>
                  </div>
                </AModal>
              </DisplayTextBox>
            );
            break;
        }
      }}
    </wrapContext.Consumer>
  );
};
export default connect(({ select }: { select: any }) => ({
  select,
}))(SelectTree);
