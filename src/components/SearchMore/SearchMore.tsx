import type {ReactText} from 'react';
import React, {useState, useMemo} from 'react';
import {DatePicker, Input, Select, Button, InputNumber, TimePicker, TreeSelect} from 'antd';
import styled from 'styled-components';
import {Form} from 'antd';
import type {AProps} from '@/globalTyping';
import {connect} from "dva";

const {RangePicker} = DatePicker;

const {Search} = Input;
const ContentBox = styled.div`
  position: relative;
  left: 0;
  top: 2px;
  margin-bottom: 1vw;
  width: 100%;

  .top-btn-box {
    display: flex;
    flex-flow: row;
    justify-content: flex-end;
  }

  .search-box {
    display: flex;
    flex-flow: row wrap;
    margin: 0 auto;
    margin-bottom: 1vh;
  }

  .search-item {
    display: flex;
    min-width: 20%;
    margin-bottom: 1vh;
    height: 30px;
    line-height: 30px;
  }

  .title {
    display: block;
    text-overflow: ellipsis;
    overflow: hidden;
    width: 5vw;

    &:after {
      content: '';
      width: 100%;
      display: inline-block;
    }
  }

  .right-side-box {
    flex: 1;
    margin-right: 2vw;

    .select-box {
      width: 100%;
    }


    .range-picker {
      width: 100% !important;
    }

    .treeSelect-box {
      width: 240px;
    }
  }

  .number-interval {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .input-number-item {
      width: 45% !important;
    }
  }

  .btn {
    float: right;
    padding: 0 1vw;
    margin-right: 10px;
    cursor: pointer;
    height: 32px;
  }

  .btn-box {
    display: flex;
    justify-content: center;

    &:last-child {
      margin-right: 0;
    }
  }
`;
const MoreSearchBox = styled(Form)<{ state?: string | boolean }>`
  position: relative;
  left: 0;
  width: 100%;
  display: ${(props) => (props.state === 'true' ? 'none' : 'block')};
`;

const AnimateDivSearch = styled(Form)<{ state?: string | boolean }>`
  margin-right: 1vw !important;
  width: 200px;
  float: right;
  transition: all 300ms;
  overflow: hidden;

  width: ${(props) => (props.state === 'true' ? '200px' : '0')};
  opacity: ${(props) => (props.state === 'true' ? '100' : '0')};
  height: ${(props) => (props.state === 'true' ? 'auto' : '0')};
`;
const AnimateDiv = styled.div<{ state?: string | boolean }>`
  overflow: hidden;
  transform-origin: top;
  margin-top: 1vh;
  display: ${(props) => (props.state === 'true' ? 'block' : 'none')};
`;

interface AsearchList {
  title: string | number;
  type:
    | 'input'
    | 'select'
    | 'period'
    | 'number-interval'
    | 'input-number'
    | 'time-period'
    | 'month-period'
    | 'select-Level';
  key: string;
  placeholder: string;
  sendType: string;
  filterList: string;
}

interface Props_SreachBoxMain extends AProps {
  type: string;
  selectFn?: (arg0: any, arg1: any, arg: AsearchList['type']) => void;
  form: any;
  searchList: AsearchList;
  submit: (arg: any) => void;
  reset: () => void;
  STATE?: boolean;
}

const SreachBoxMain = (props: Props_SreachBoxMain) => {
  console.log(props)
  const {searchList, submit, reset, form, selectFn} = props;
  const {STATE} = props;
  // 默认过滤初始值
  const initialValues_fn = () => {
    const list: undefined[] = [];
    return list;
  };
  const onFinish = (data: any) => {
    submit(data);
  };

  const onReset = () => {
    form.resetFields();
    reset();
  };

  return (
    <MoreSearchBox
      form={form}
      // onFinish={onFinish}
      initialValues={initialValues_fn()}
    >
      <ul className="search-box" style={{float: STATE ? 'left' : 'none'}}>
        {Array.isArray(searchList)
          ? searchList.map((item, idx) => {
            return (
              <li key={idx} className="search-item">
                <span className="title">{item.title}</span>
                <div className="right-side-box">
                  {/* 如果是输入框 */}
                  {item.type == 'input' ? (
                    <Form.Item name={item.key} noStyle>
                      <Input placeholder={item.placeholder}/>
                    </Form.Item>
                  ) : null}

                  {/* 如果是选择框 */}
                  {item.type == 'select' ? (
                    <Form.Item name={item.key} noStyle>
                      <Select
                        placeholder={item.placeholder}
                        className="select-box"
                        showSearch
                        filterOption={(input, option: any) => {
                          return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
                        }}
                      >
                        {props.select[item.filterList] && Array.isArray(props.select[item.filterList])
                          ? props.select[item.filterList].map(
                            (
                              item01: { [x: string]: React.Key; name: string },
                              index01: { toString: () => ReactText },
                            ) => {
                              return (
                                <Select.Option
                                  key={index01.toString()}
                                  title={item.sendName ? item01[item.sendName] : item01.name}
                                  value={item.sendType ? item01[item.sendType] : item01.name}
                                >
                                  {item.sendName ? item01[item.sendName] : item01.name}
                                </Select.Option>
                              );
                            },
                          )
                          : props[item.filterList] && Array.isArray(props[item.filterList]) ? props[item.filterList].map(
                            (
                              item01: { [x: string]: React.Key; name: string },
                              index01: { toString: () => ReactText },
                            ) => {
                              return (
                                <Select.Option
                                  key={index01.toString()}
                                  title={item.sendName ? item01[item.sendName] : item01.name}
                                  value={item.sendType ? item01[item.sendType] : item01.name}
                                >
                                  {item.sendName ? item01[item.sendName] : item01.name}
                                </Select.Option>
                              );
                            },
                          ) : null


                        }
                      </Select>
                    </Form.Item>
                  ) : null}

                  {/* 如果是连级选择框 */}
                  {item.type == 'select-Level' ? (
                    <Form.Item name={item.key} noStyle>
                      <Select
                        placeholder={item.placeholder}
                        className="select-box"
                        showSearch
                        onChange={(value) => {
                          selectFn ? selectFn(value, item.key, 'select-Level') : null;
                        }}
                        filterOption={(input, option: any) => {
                          return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
                        }}
                      >
                        {props[item.filterList] && Array.isArray(props[item.filterList])
                          ? props[item.filterList].map(
                            (item01: any, index01: number) => {
                              return (
                                <Select.Option
                                  key={index01.toString()}
                                  title={item01.name}
                                  value={item.sendType ? item01[item.sendType] : item01.name}
                                >
                                  {item01.name}
                                </Select.Option>
                              );
                            })
                          : null}
                      </Select>
                    </Form.Item>
                  ) : null}
                  {/* 如果是日期周期 */}
                  {item.type == 'period' ? (
                    <Form.Item name={item.key} noStyle>
                      <RangePicker
                        // showTime={{ format: 'HH:mm:ss' }}
                        // format="YYYY/MM/DD HH:mm:ss"
                        format="YYYY/MM/DD"
                        placeholder={['开始时间', '结束时间']}
                        className="range-picker"
                      />
                    </Form.Item>
                  ) : null}

                  {/* 如果是月周期 */}
                  {item.type == 'period-month' ? (
                    <Form.Item name={item.key} noStyle>
                      <RangePicker
                        picker="month"
                        format="YYYY-MM"
                        placeholder={['开始月份', '结束月份']}
                        className="range-picker"
                      />

                    </Form.Item>
                  ) : null}

                  {/* 如果是数字区间 */}
                  {item.type == 'number-interval' ? (
                    <div className="number-interval">
                      <Form.Item name={item.key[0]} noStyle>
                        <InputNumber
                          placeholder={item.placeholder[0]}
                          min={0}
                          className="input-number-item"
                        />
                      </Form.Item>
                      <span className="text-icon">~</span>
                      <Form.Item name={item.key[1]} noStyle>
                        <InputNumber
                          placeholder={item.placeholder[1]}
                          min={0}
                          className="input-number-item"
                        />
                      </Form.Item>
                    </div>
                  ) : null}

                  {/* 如果是数字 */}
                  {item.type == 'input-number' ? (
                    <Form.Item name={item.key} noStyle>
                      <InputNumber
                        placeholder={item.placeholder}
                        min={0}
                        className="input-number"
                      />
                    </Form.Item>
                  ) : null}

                  {/* 如果是时间段 */}
                  {item.type == 'time-period' ? (
                    <div className="time-period">
                      <Form.Item name={item.key[0]} noStyle>
                        <TimePicker format={'HH:mm'}/>
                      </Form.Item>
                      <span className="text-icon">~</span>
                      <Form.Item name={item.key[1]} noStyle>
                        <TimePicker format={'HH:mm'}/>
                      </Form.Item>
                    </div>
                  ) : null}

                  {/* 如果是选择月份 */}
                  {item.type == 'month-period' ? (
                    <div className="time-period">
                      <Form.Item name={item.key} noStyle>
                        <DatePicker picker="month" format="YYYY-MM"/>
                      </Form.Item>
                    </div>
                  ) : null}


                  {/* 树形框 */}
                  {item.type == 'treeSelect' ? (
                    <Form.Item name={item.key} noStyle>

                      {
                        props[item.filterList] && Array.isArray(props[item.filterList]) ?
                          <TreeSelect
                            dropdownStyle={{maxHeight: 400,  overflow: 'auto'}}
                            placeholder={item.placeholder}
                            allowClear
                            treeDefaultExpandAll

                            treeData={props[item.filterList]}
                            className="treeSelect-box"
                          >
                          </TreeSelect> : null
                      }


                    </Form.Item>
                  ) : null}

                </div>
              </li>
            );
          })
          : null}
      </ul>
      <div className="btn-box" style={{float: STATE ? 'left' : 'none'}}>

        <Button
          className="btn"
          size="small"
          type="primary"
          // htmlType="submit"
          onClick={onFinish}
        >
          查询
        </Button>
        <Button className="btn" onClick={onReset} size="small" type="primary" ghost>
          重置
        </Button>
      </div>
    </MoreSearchBox>
  );
};
connect(({select}: { select: any }) => ({
  select,
}))(SreachBoxMain);

/*
  type类型
  complexQuery 复杂的带关键字的查询
  singleQuery 简单的只带关键字的查询
  multipleQuery 单行多条查询
*/
interface Props_SearchMore extends AProps {
  type: 'complexQuery' | 'singleQuery' | 'multipleQuery';
  form: any;
  searchList: AsearchList;
  submit: (arg: any) => void;
  reset: () => void;
}

const SearchMore = (props: Props_SearchMore) => {
  const {submit, reset, form} = props;
  const {type} = props;
  const [STATE, setSTATE] = useState<boolean>(false);
  /* 是否进行高级刷选 */
  const changeModel = () => {
    form.resetFields();
    setSTATE(!STATE);
    reset();
  };
  useMemo(() => {
    // 如果不存在高级搜索
  }, []);
  const sureSearch = (data?: any): void => {
    submit(data);
  };
  return (
    <ContentBox>
      <div className="top-btn-box">
        <div className="right-side-item">
          {['complexQuery'].includes(type) ? (
            <Button className="btn" onClick={changeModel} size="small" type="primary">
              {STATE ? '收起筛选' : '高级筛选'}
            </Button>
          ) : null}
          <AnimateDivSearch
            state={(!STATE && ['singleQuery', 'complexQuery'].includes(type).toString())}
            form={form}
          >
            <Form.Item name={'name'} noStyle>
              <Search
                placeholder="名称查询"
                onSearch={sureSearch}
                style={{width: 200}}
                className="search-item-top"
              />
            </Form.Item>
          </AnimateDivSearch>
        </div>
      </div>

      {['complexQuery'].includes(type) ? (
        <AnimateDiv state={STATE.toString()}>
          <SreachBoxMain {...props}></SreachBoxMain>
        </AnimateDiv>
      ) : null}

      {['multipleQuery'].includes(type) ? (
        <SreachBoxMain STATE={['multipleQuery'].includes(type)} {...props}></SreachBoxMain>
      ) : null}
    </ContentBox>
  );
};

export default connect(({select}: { select: any }) => ({
  select,
}))(SearchMore);
;
