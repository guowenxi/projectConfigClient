import React, {useState, useEffect, useContext} from 'react';
import styled from 'styled-components';
import {connect} from "dva";
import {Select as ASelect} from 'antd';
import type {Iconf} from '../TableInfo';
import {wrapContext} from '../TableInfo';
import {ShowData} from './_css_comm';
import {Form} from 'antd';
import type {AProps} from '@/globalTyping';


const {Option} = ASelect;


const MSelect = styled<any>(ASelect)`
  && {
    width: 100%;
    height: 43px;

    .ant-select-selector {
      height: 100%;
      //padding:1vh;
    }

    .ant-select-selection-search-input {
      height: 100% !important;
    }

    .ant-select-selection-item {
    }

  }
`;

interface Ioptions {
  name: string,
  id: number
}

interface IconfSelect extends Iconf {
  placeholder?: string,
  relationType: string,
  options: Ioptions[],
  defaultValue: string
}

interface MProps extends AProps {
  dispatch: any;
  conf: IconfSelect;
  name: string;
  rules: any;
}

const Select = (props: MProps) => {
  const _: any = props.conf;
  const {name} = props;
  // const { dispatch } = props;
  const {dispatch} = props

  const theme: any = useContext(wrapContext);
  const [OPTION, setOPTION] = useState([]);
  const [VAL, setVAL] = useState("　");

  theme.event$.useSubscription((data: any) => {
    const i = data.relateNames.indexOf(name);
    if (i >= 0) {
      _.params[data.relatekeys[i]] = data.value;
      theme.form.setFieldsValue({
        [name]: [],
      });
      filterData("select", _)
    }
  });

  async function filterData(namespace: string, conf: any) {
    let _op = [];
    if (conf.relationType) {
      _op = props[namespace][conf.relationType];
    } else if (conf.url) {
      // 暂不支持使用url地址 ---
      // 已修复 可以使用url地址
      // select组件需要copy代码片段过去
      const data = await dispatch({
        type: 'common/requestData',
        url: conf.url,
        method: 'GET',
        payload: {
          ...conf.params
        },
      })

      if (conf.keyName) {
        data.map(function (item: any) {
          item.name = item[conf.keyName];
          item.id = item[conf.keyId];
        })
      }


      // const { data, error, loading } = useRequest()
      _op = data;
    } else {
      _op = conf.options;
    }
    setOPTION(_op);
    filterDefaultValue(_op, _.defaultValue)
  }

  function filterDefaultValue(OPTION: Ioptions[], id: string) {
    if (Number(id)) {
      const val: any = OPTION.find(function (item) {
        return Number(item.id) === Number(id);
      })
      setVAL(val.name)
    }
  }

  const filterDefaultData = function () {
    const data = theme.form.getFieldValue(name);

    let _data: any = [];
    switch (typeof data) {
      case 'string':
        data == '' ? _data = [] : _data = data.split(',');
        break;
      case 'object':
        data == [] ? _data = [] : _data = data;
        break;
      default:
        _data = [];
        break;
    }
    theme.form.setFieldsValue({[name]: _data});
    // theme.form.setFieldsValue({[name.substring(0, name.length - 3)]: _data});
  };
  // 只在初始化时进行加载
  useEffect(() => {
    //过滤默认列表
    filterData("select", _)
    //过滤默认展示列表字段
    filterDefaultData();
  }, [])

  return (
    <wrapContext.Consumer>
      {(_data) => {
        switch (_data.state) {
          case 'default':
            return <ShowData>{VAL}</ShowData>;
            break;
          case 'edit':
          case "new" :
          case 'disabled':
            return (
              <Form.Item name={name} rules={props.rules}>
                <MSelect
                  initialValue="null"
                  mode="multiple"
                  placeholder={_.placeholder}
                  showSearch
                  disabled={_data.state === 'disabled'}
                  onChange={(value: any, option: any) => {
                    theme.form.setFieldsValue({[name]: value});
                    theme.form.setFieldsValue({[name.substring(0, name.length - 3)]: option});
                  }}
                  filterOption={(input: any, option: any) => {
                    return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }}
                >
                  {
                    OPTION.map((item: any) => {
                      return <Option title={item[_.keyName || 'name']} value={item[_.keyId || 'id'].toString()}
                                     peopleType={item.peopleType ? item.peopleType : ''}
                                     participantId={item.id ? item.id : ''}
                                     key={item[_.keyId || 'id']}>{item[_.keyName || 'name']}</Option>
                    })
                  }
                </MSelect>
              </Form.Item>

            );
            break;
        }
      }}
    </wrapContext.Consumer>
  );
};
export default connect(({
                          select
                        }: { select: any }) => ({
  select
}))(Select);
