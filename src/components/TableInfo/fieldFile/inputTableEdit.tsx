import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';

import {connect} from "dva";

import { Select as ASelect, Input, InputNumber } from 'antd';
import type { Iconf } from '../TableInfo';
import { wrapContext } from '../TableInfo';
import { ShowData } from './_css_comm';
import { Form } from 'antd';

import { MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';

const FromList = styled.div`
  padding: 1vh;
  border: 1px solid #d9d9d9;
  .table-title-box {
    display: flex;
    flex-flow: row;
    margin: 0;
    padding: 0;
    line-height: 3.76vh;
    border: 1px solid #d9d9d9;
  }
  .title-item-option {
    flex: 1;
    text-align: center;
  }
  .title-item {
    box-shadow: 1px 1px 0 #d9d9d9;
    &::last-child {
      border-right: none;
    }
  }
  .option-btn-box {
    flex: 1;
    height: 4.3vh;
    box-shadow: 1px 1px 0 #d9d9d9;
    .ant-form-item-control-input-content {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1vw;
      .icon-item {
        margin-right: 1vw;
      }
    }
  }
  .input-item {
    height: 100%;
    text-align: center;
    border: none;
    border-right: 1px solid #d9d9d9;
    outline: none;
  }
  .ant-input-number {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    border-right: 1px solid #d9d9d9;
    .ant-input-number-input-wrap {
      width: 100%;
      input {
        text-align: center;
      }
    }
  }
  .input-content-box {
    border-left: 1px solid #d9d9d9;
  }
  .input-content-item {
    height: 4.3vh;
    border-bottom: 1px solid #d9d9d9;
  }
  .row-index-box {
    display: flex;
    align-items: center;
    justify-content: center;
    border-right: 1px solid #d9d9d9;
  }
  .row-text-index {
    border-bottom: 1px solid #d9d9d9;
  }
  .count-box {
    display: flex;
    margin: 0;
    padding: 0;
    line-height: 3.76vh;
    .row-index-box {
      border: 1px solid #d9d9d9;
      border-top: none;
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

const inputTable: React.FC<ISelect> = (props) => {
  const theme: any = useContext(wrapContext);
  const _: any = props.conf;
  const { name } = props;

  const [list, setList] = useState([]);

  const [columnList, setColumnList] = useState(_.columnList ? _.columnList : []);

  const filterData = (_: any) => {
    const data = theme.form.getFieldsValue();
    let list = [];
    if (!data[name] || data[name].length === 0) {
      list = [{}];
    } else {
      list = data[name];
    }
    setList(list);
    theme.form.setFields([
      {
        name,
        value: list,
      },
    ]);
  };

  // 只在初始化时进行加载
  useEffect(() => {
    filterData(props);
  }, []);

  /* list变化时加载 */
  useEffect(() => {
    countNum(null);
  }, [list]);

  const inputDisplay = (item: any, index: number) => {
    let dom: any = '';
    if (item.type === 'number' && item.range) {
      dom = (
        <InputNumber
          min={item.range ? item.range[0] : ''}
          max={item.range ? item.range[1] : ''}
          className="input-item"
          onChange={(value) => {
            changeValue(value, item.key, index);
          }}
          disabled={!!item.disabled}
        />
      );
    } else if (item.type === 'number') {
      dom = (
        <InputNumber
          className="input-item"
          onChange={(value) => {
            changeValue(value, item.key, index);
          }}
          disabled={!!item.disabled}
        />
      );
    } else {
      dom = (
        <Input
          className="input-item"
          onChange={(value) => {
            changeValue(value, item.key, index);
          }}
          disabled={!!item.disabled}
        />
      );
    }
    return dom;
  };

  /* 计算总数 */
  const countNum = (_: any) => {
    const data = theme.form.getFieldsValue();
    const list = data[name];
    if (Array.isArray(list)) {
      columnList.map((item01: any) => {
        if (item01.type == 'number') {
          item01.countNum = 0;
          list.map((item02: any) => {
            for (const key in item02) {
              if (item01.key === key) {
                if (item02 && item02[key]) {
                  item01.countNum += item02[key];
                }
              }
            }
          });
        }
      });
    }
    const dataList = columnList;
    setColumnList(JSON.parse(JSON.stringify(dataList)));
  };

  /* 改变输入框中的值 */
  const changeValue = (value: any, key: any, index: any) => {
    const data = theme.form.getFieldsValue();
    data[name][index][key] = value.target ? value.target.value : value;
    setList(data);
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
              <Form.List name={name}>
                {(fields, { add }) => (
                  <FromList>
                    <ul className="table-title-box">
                      {_.isRowIndex ? (
                        <li
                          className="row-index-box"
                          style={{ width: _.rowIndexWidth ? _.rowIndexWidth : '5%' }}
                        >
                          {_.isRowIndex}
                        </li>
                      ) : null}
                      {columnList.map((item: any, index: number) => {
                        return (
                          <li
                            key={index}
                            style={{
                              width: item.width,
                              textAlign: item.align ? item.align : 'left',
                            }}
                            className="title-item"
                          >
                            {item.title}
                          </li>
                        );
                      })}

                      {!_.isNeedAdd ? <li className="title-item title-item-option">操作</li> : null}
                    </ul>
                    {fields.map((field: any, index: number) => (
                      <div
                        key={index}
                        style={{ display: 'flex' }}
                        className="input-content-box"
                      >
                        {_.isRowIndex ? (
                          <div
                            className="row-index-box row-text-index"
                            style={{ width: _.rowIndexWidth ? _.rowIndexWidth : '5%' }}
                          >
                            {index + 1}
                          </div>
                        ) : null}

                        {columnList.map((item: any) => {
                          return (
                            <Form.Item
                              {...field}
                              name={[field.name, item.key]}
                              fieldKey={[field.fieldKey, item.key]}
                              style={{
                                width: item.width,
                                textAlign: item.align ? item.align : 'left',
                              }}
                              rules={props.rules}
                              className="input-content-item"
                            >
                              {inputDisplay(item, index)}
                            </Form.Item>
                          );
                        })}
                        <Form.Item className="option-btn-box">
                          {!_.isNeedAdd ? (
                            <PlusCircleOutlined
                              onClick={() => {
                                add();
                                const data = theme.form.getFieldsValue();
                                setList(data[name]);
                              }}
                              className="icon-item"
                            ></PlusCircleOutlined>
                          ) : null}

                          {!_.isNeedAdd ? (
                            <MinusCircleOutlined
                              onClick={() => {
                                const data = theme.form.getFieldsValue();
                                data[name].splice(field.name, 1);
                                let list = [];
                                if (!data[name] || data[name].length === 0) {
                                  list = [{}];
                                } else {
                                  list = data[name];
                                }
                                setList(list);
                                theme.form.setFields([
                                  {
                                    name,
                                    value: list,
                                  },
                                ]);
                              }}
                            />
                          ) : null}
                        </Form.Item>
                      </div>
                    ))}

                    {/* 合计 */}
                    {!_.isNeedTotal ? (
                      <ul className="count-box">
                        {_.isRowIndex ? (
                          <li
                            className="row-index-box"
                            style={{ width: _.rowIndexWidth ? _.rowIndexWidth : '5%' }}
                          >
                            合计
                          </li>
                        ) : null}
                        {columnList.map((item: any, index: number) => {
                          return (
                            <li
                              key={index}
                              style={{
                                width: item.width,
                                textAlign: item.align ? item.align : 'left',
                              }}
                              className="title-item"
                            >
                              {item.countNum}
                            </li>
                          );
                        })}
                        {!_.isNeedAdd ? <li className="title-item title-item-option"></li> : null}
                      </ul>
                    ) : null}
                  </FromList>
                )}
              </Form.List>
            );
            break;
        }
      }}
    </wrapContext.Consumer>
  );
};
export default connect(({ select }: {select: any}) => ({
  select,
}))(inputTable);
