import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import ContentItem from './item';
import { Scrollbars } from 'react-custom-scrollbars';
import { Form, Button, Space } from 'antd';
import { connect } from "dva";
import { useEventEmitter } from 'ahooks';
import moment from 'moment/moment';
import { FormView } from './fieldFile/_css_comm';
import styles from './styles.css';
import { instanceOf } from 'prop-types';

{
  /* <wrapContext.Provider value={{ state, form, focus$, event$ }}> */
}

export const wrapContext = React.createContext<any>({ state: '' });
export const WrapBox = styled(Scrollbars) <{
  minHeight?: string;
  itemWidth?: string;
  border?: boolean;
}>`
  box-shadow: ${(props) => (props.border ? `0 0 0 1px #ccc` : `0`)};
`;

export const CssContentItem = styled(ContentItem) <{ toggle?: boolean }>`
  display: ${(props) => (props.toggle ? 'none' : 'flex')};
`;
const TableTitle = styled.div<{ lineColor?: string }>`
  width: 100%;
  height: 45px;
  line-height: 45px;
  font-weight: bold;
  font-size:16px;
  padding: 0 3vh;
  position: relative;
  display: flex;
  &:before {
    position: absolute;
    top: 50%;
    left: 1vh;
    width: 5px;
    height: 40%;
    background: ${(props) => (props.lineColor ? props.lineColor : `#000`)};
    transform: translateY(-50%);
    content: '';
  }
`;

export interface Iconf {
  disabled: boolean;
  size?: 'large' | 'middle' | 'small';
  style: {
    width: string;
  };
}
interface Iprops {
  defaultValue: string;
}
export interface Ifield {
  col?: 7;
  type: 'input' | 'inputNumber' | any;
  props: Iprops;
  name?: string;
}

export interface IitemData {
  costomNode?: any;
  name?: string;
  width?: string;
  height?: string;
  label: {
    name: string;
    col?: number;
    style: Record<string, any>;
  };
  style?: Record<string, any>;
  field: Ifield;
  rules: [
    {
      required: boolean;
      message: string;
    },
  ];
}
interface TitleIitemData extends IitemData {
  type: string;
  lineColor: string;
  text: string;
  className: string;
  toggle: boolean;
}

interface TableList {
  htmlType: any;
  name: string;
  type: 'link' | 'text' | 'default' | 'ghost' | 'primary' | 'dashed' | undefined;
  click: (arg: any) => void;
}
interface TableInfoProps {
  data: IitemData[] | any;
  state: 'new' | 'edit' | 'default' | 'disabled' | '';
  onValuesChange?: (changedValues: any, allValues: any) => void;
  onSubmit: (arg: any) => void;
  onCancel: (arg: any) => void;
  form: Record<string, any>;
  buttons: TableList[];
  border: boolean;
  detail: any;
  children?: any;
}
interface DataList {
  name: any;
  toggle: boolean;
  field: { props: { requiredStatus: null | undefined } };
  rules: { required: boolean }[];
  toggleValues: String | undefined;
}
/**
 * 不太建议用这种懒的办法去操作时间数据 还是建议自己拼接
 */
function judgeDate(_date) {
  if (moment(_date).isValid()) {
    return moment(_date);
  }
  let hash = {};
  let num = '', _ = 0, __ = 0;
  for (let i = 0; i < _date.length; i++) {
    if (_date[i] != '-' && _date[i] != ':') {
      num = num + _date[i];
    }
    if (_date[i] == '-' || (i == _date.length - 1 && __ == 0)) {
      switch (_) {
        case 0:
          hash['year'] = num;
          break;
        case 1:
          hash['month'] = num;
          break;
      }
      num = ''
      _++;
    } else if (_date[i] == ' ') {
      hash['date'] = num;
      num = '';
    } else if (_date[i] == ':' || i == _date.length - 1) {
      switch (__) {
        case 0:
          hash['hour'] = num;
          break;
        case 1:
          hash['minute'] = num;
          break;
        case 2:
          hash['seconds'] = num;
          break;
      }
      num = '';
      __++;
    }
  }
  return moment(hash);
}
//用来存储一些需要重置的状态
export let __status: Record<string, any> = {};
let $names: String[] = [];
let relateHash: Record<string, any> = {};
function clearHashData() {
  __status = {};
  $names = [];
  relateHash = {};
}
const TableInfo = (props: TableInfoProps) => {
  const { children, detail, data, state, buttons, border, onSubmit, onCancel, onValuesChange } = props;
  const focus$ = useEventEmitter();
  const event$ = useEventEmitter();
  const [DATALIST, setDATALIST] = useState(data);
  const [form] = Form.useForm();
  function fiterData(data: any, key: any) {
    // 如果是时间字段 则进行时间字段过滤
    if (Date.parse(data) && isNaN(data) || key.toUpperCase().indexOf('TIME') >= 0) {
      return filterDate(data);
    }
    return data;
  }
  function filterDate(data: any) {
    //因为时间-的问题暂时不判断
    // if(data.indexOf("-") != -1){
    //   return data = data.split("-").map(function(_date: moment.MomentInput){
    //     return moment(_date)
    //   })
    // }else
    if (data.indexOf(",") != -1) {
      return data = data.split(",").map(function (_date: moment.MomentInput) {
        return judgeDate(_date)
      })
    } else if (data instanceof Array) {
      return data = data.map(function (_date: moment.MomentInput) {
        return judgeDate(_date)
      })
    } else {
      return judgeDate(data);
    }
  }
  const setDefualtVal = (info: {}) => {
    // 如果info是空值则返回
    if (Object.keys(info).length === 0) return;
    const list: any = [];
    // 对数据进行重组
    function formatData(data: Record<string, any>, pkey?: string | undefined) {
      for (const key in data) {
        if (data[key] === null || $names.indexOf(key) != -1) {
          list[key] = data[key];
        } else if (typeof data[key] !== 'object' || data[key].constructor !== Object) {
          // 如果有父级则进行.进行标记
          if (pkey) {
            // 先将数据过滤 如果有附带子集的数据 则改成"xx.xx"格式
            list[`${pkey}.${key}`] = fiterData(data[key], key);
          } else {
            // 默认的字段过滤
            list[key] = fiterData(data[key], key);
          }
        } else {
          formatData(data[key], key);
        }
      }
    }
    formatData(info);

    if (list.hasOwnProperty('longitude')) {
      form.setFields([
        {
          name: 'lnglat',
          value: [list.longitude, list.latitude],
        },
      ]);
    } else if (list.hasOwnProperty('x')) {
      form.setFields([
        {
          name: 'lnglat',
          value: [list.x, list.y],
        },
      ]);
    }
    form.setFieldsValue(list);
  };

  function filterToggleDATALIST(_data: any) {
    const _list: any[] = [];
    JSON.parse(JSON.stringify(DATALIST)).map(function (item: DataList, idx: number) {
      const _idx: any = _data.relateNames.indexOf(item.name);
      if (_idx >= 0) {
        if (item.toggleValues) {
          try {
            if (item.toggleValues.indexOf(_data.value) >= 0) {
              item.toggle = false; //false隐藏

              if (item.name === 'meetingInvitees') {
                form.setFieldsValue({
                  [item.name]: []
                })
              }
            } else {
              item.toggle = true; //true 隐藏
              form.setFieldsValue({
                [item.name]: null
              })
            }
          } catch (err) {
            console.log(err);
          }
        } else {
          item.toggle = !item.toggle;
        }
        item.rules[0].required = item.toggle ? false : data[idx].rules[0].required;
      }
      _list.push(item);
    });
    setDATALIST(_list);
  }
  function juggleData(list1, list2) {
    let s = false;
    for (let d of list1) {
      if (list2.includes(d.toString())) {
        s = true;
        break;
      }
    }
    return s;
  }
  function filterDefaultToggleDATALIST() {
    const _list: any[] = [];
    JSON.parse(JSON.stringify(DATALIST)).map(function (item: DataList, idx: number) {
      if (!item.name) return;
      if (item.toggleValues && state !== 'new') {
        try {
          if (juggleData(relateHash[item.name], item.toggleValues.split(","))) {
            item.toggle = false; //false 显示
          } else {
            if (item.field.type === "input" && relateHash[item.name]?.length > 0) {
              item.toggle = false;
            }
            item.toggle = true; //true 隐藏
          }
        } catch (err) {
          console.log(err);
        }
      }
      console.log(item.toggle);
      if (item.type !== "title") item.rules[0].required = item.toggle ? false : data[idx].rules[0].required;
      _list.push(item);
    });
    setDATALIST(_list);
  }
  function parseData() {
    DATALIST.map(function (item: DataList) {
      if (!item.name) return;
      if (item.name.indexOf("$") != -1) {
        item.name = item.name.slice(1);
        $names.push(item.name);
      }
      let { relateNames } = item.field?.props || {};
      if (!relateNames) return;
      relateNames instanceof Array ? null : relateNames = relateNames.split(",");
      relateNames.map(function (_name: string, idx: number) {
        if (relateHash[_name] instanceof Array) {
          relateHash[_name].push(detail[item.name])
        } else {
          relateHash[_name] = [detail[item.name]]
        }
      })
    })
  }
  focus$.useSubscription((data: any) => {
    switch (data.type) {
      case 'toggle':
        filterToggleDATALIST(data);
        break;
      case 'onChange':
        event$.emit(data);
        break;
    }
  });
  useEffect(() => {
    if (detail) parseData(); //一些预处理在这个方法里
    if (detail) filterDefaultToggleDATALIST();
    // 如果有detail 则认为是带默认值的,进行数据过滤处理并赋值
    if (detail && Object.keys(detail).length && state !== 'new') {
      //这个一定要优先加载,里面有方法对数据进行预处理
      setDefualtVal(detail);
    } else {
      form.resetFields();
    }
  }, [detail]);

  const onFinish = (data: any) => {
    clearHashData();
    const _form = form.getFieldsValue(true)
    if (onSubmit) { onSubmit(_form) };
  };

  const cancel = (data: any) => {
    clearHashData();
    onCancel(data);
  };

  // 默认过滤初始值
  const initialValues_fn = (data: IitemData[]) => {
    const list: IitemData[] = [];
    data.forEach((item: any) => {
      item.field ? (list[item.name] = item.field.props.defaultValue) : null;
    });
    return list;
  };
  // 回调传出form的值改变
  function _onValuesChange(changedValues, allValues): void {
    if (props.onValuesChange) {
      props.onValuesChange(changedValues, allValues)
    }
  }

  return (
    <wrapContext.Provider value={{ state, form, focus$, event$ }}>
      <FormView
        style={{ height: '100%' }}
        border={border}
        form={form}
        onFinish={onFinish}
        initialValues={initialValues_fn(data)}
        onValuesChange={_onValuesChange}
      >
        <WrapBox border={border}>
          {DATALIST.map((item: TitleIitemData, idx: string | number | undefined) => {
            if (item.type === 'title') {
              return <TableTitle lineColor={item.lineColor}>{item.text}</TableTitle>;
            }
            return (
              <CssContentItem
                key={idx}
                className={item.className}
                _item={item}
                toggle={item.toggle}
              ></CssContentItem>
            );

          })}
          {children}
        </WrapBox>
        <Space className="sub-button-box">
          {buttons &&
            buttons.map((item) => {
              return (
                <Button
                  style={{ display: item.show || item.show == undefined ? 'block' : 'none' }}
                  type={item.type ? item.type : 'primary'}
                  onClick={() => {
                    clearHashData();
                    if (item.htmlType) {
                      form.validateFields().then((values) => {
                        item.click(form.getFieldsValue(true))
                      })
                    } else {
                      item.click(form.getFieldsValue(true))
                    }
                  }}
                >
                  {item.name}
                </Button>
              );
            })}
          {onSubmit && (
            <Button htmlType="submit" type="primary">
              确定
            </Button>
          )}
          {onCancel && (
            <Button type="primary" onClick={cancel}>
              取消
            </Button>
          )}
        </Space>
      </FormView>
    </wrapContext.Provider>
  );
};

export default connect(({ }) => ({}))(TableInfo);
