import React, {useState, useEffect, useContext} from 'react';
import styled, {ThemeProvider} from 'styled-components';

import {connect} from "dva";
import {useRequest} from 'ahooks';
import {Select as ASelect} from 'antd';
import type {Iconf} from '../TableInfo';
import {wrapContext} from '../TableInfo';
import {ShowData} from './_css_comm';
import {Form} from 'antd';

import {EventEmitter} from 'ahooks/lib/useEventEmitter';

import {joinUrl} from '@/utils/utils';

const {Option} = ASelect;

const InputNumberIntervalBox = styled.div`
  .ant-form-item-control-input-content {
    display: flex;

    .ant-input-number {
      width: 48%;
      flex: 1;
    }

    .ant-divider {
      min-width: 40px;
      width: 40px;
    }
  }

  .display-box {
    display: flex;

    .display-right-side-box {
      flex: 7;

      .ant-space-item {
        flex: 1;

        &:nth-child(2) {
          flex: 0;
          width: 20px;
        }

        .ant-divider-horizontal {
          width: 20px;
        }
      }
    }
  }
`;

const Label = styled.div<{ col?: string | number; style?: Record<string, any> | undefined }>`
  flex: ${(props) => (props.col ? props.col : 3)};
  position: relative;
  /* ::after{
    content:"*";
    position: absolute;
    left:0;
    top:0;
    color:red;
  } */
`;

const MSelect = styled(ASelect)`
  && {
    width: 100%;
    height: 43px;

    .ant-select-selector {
      height: 100%;
    }

    .ant-select-selection-search-input {
      height: 100% !important;
    }

    .ant-select-selection-item {
      line-height: 43px;
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

interface ISelect {
  dispatch: any;
  conf: IconfSelect;
  name: string;
  rules: any;
}

const Select: React.FC<ISelect> = (props) => {
  const _: any = props.conf;
  const {name} = props;
  const {dispatch} = props
  const theme: any = useContext(wrapContext);
  const [OPTION, setOPTION] = useState([]);
  const [VAL, setVAL] = useState("　");

  async function filterData(namespace: string, conf: any) {
    let _op = [];
    if (conf.relationType) {
      _op = props[namespace][conf.relationType];
    } else if (conf.url) {

      const data = await dispatch({
        type: 'common/requestData',
        url: conf.url,
        method: 'GET',
        payload: {
          ...conf.params
        },
      })

      if (conf.keyName) {
        data.map(function (item: any, idx: number) {
          item.name = item[conf.keyName];
          item.id = item[conf.idName];
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

  // 只在初始化时进行加载
  useEffect(() => {

    filterData("select", _)
  }, [])

  theme.event$.useSubscription((data: any) => {
    const i = data.relateNames.indexOf(name);
    if (i >= 0) {
      switch (data.type) {
        case "onChange":
          if (!_.params) return;

          console.log("useSubscription data", data)
          _.params[data.relatekeys[i]] = data.value;
          theme.form.setFieldsValue({
            [name]: [],
          });


          if (_.optionsKeyName) {
            _.optionsList.map((item: any, index: number) => {
              if (item[_.keyName] === data.value) {
                setOPTION(item[_.optionsKeyName]);
              }
            })
          } else {
            filterData("select", _)
          }
          break;
      }
    }
  });


  /// relateNames

  return (
    <wrapContext.Consumer>
      {(_data: any): any => {
        switch (_data.state) {
          case 'default':
            return <ShowData>{VAL}</ShowData>;
            break;
          case 'edit':
          case "new" :
          case 'disabled':
            return (
              <InputNumberIntervalBox>

                <div className="display-box">
                  <Label
                    style={{
                      width: '100%'
                    }}
                    col={3}
                    className="contentItem-name"
                  >
                    <span className="required">*</span>
                    类型
                  </Label>
                  <div className="display-right-side-box">
                    <Form.Item
                      rules={props.rules}>
                      <MSelect
                        placeholder={_.placeholder}
                        showSearch
                        disabled={_data.state === 'disabled'}
                        onChange={(val) => {

                        }}
                        filterOption={(input, option: any) => {
                          return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }}
                      >
                        {
                          OPTION.map((item: any, idx: number) => {
                            return <Option title={item.name}
                                           value={item.id}>{item.name}</Option>
                          })
                        }
                      </MSelect>
                    </Form.Item>
                  </div>
                </div>
              </InputNumberIntervalBox>

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
