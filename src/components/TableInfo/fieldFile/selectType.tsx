import React, {useState, useEffect, useContext} from 'react';
import styled, {ThemeProvider} from 'styled-components';
import {connect} from "dva";
import {useRequest} from 'ahooks';
import {Select as ASelect, Badge} from 'antd';
import type {Iconf} from '../TableInfo';
import {wrapContext} from '../TableInfo';
import {ShowData} from './_css_comm';
import {Form} from 'antd';

import {EventEmitter} from 'ahooks/lib/useEventEmitter';

import {joinUrl} from '@/utils/utils';

const {Option} = ASelect;


const MSelect = styled(ASelect)`
  && {
    width: 100%;
    height: 100%;

    .ant-select-selector {
      height: 100%;
      display: flex;
      align-items: center;
    }

    .ant-select-selection-search-input {
      height: 100% !important;
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

  async function filterData(namespace: string, conf: any, keyWord: any) {
    let _op = [];
    if (conf.relationType) {
      _op = props[namespace][conf.relationType];
    } else if (conf.url) {


      let startTime_endTime = theme.form.getFieldValue(conf.params.keyName)
      let developTime = ""
      let startTime = ""
      let endTime = ""

      let params = {};

      if (startTime_endTime === null || startTime_endTime === "" || startTime_endTime === undefined) {
        params = {
          ...conf.params,
          siteName: keyWord
        }
      } else {

        startTime = startTime_endTime[0].format("YYYY/MM/DD HH:mm");
        endTime = startTime_endTime[1].format("YYYY/MM/DD HH:mm");
        developTime = startTime_endTime[0].format("YYYY/MM/DD HH:mm") + '-' + startTime_endTime[1].format("YYYY/MM/DD HH:mm");

        params = {
          ...conf.params,
          siteName: keyWord,
          'developTime': developTime,
          'startTime': startTime,
          'endTime': endTime
        }
      }
      const data = await dispatch({
        type: 'common/requestData',
        url: conf.url,
        method: 'GET',
        payload: params,
      })

      if (conf.keyName) {
        data.map(function (item: any, idx: number) {
          item.name = item[conf.keyName];
          item.id = item[conf.keyId];
          item.siteStatus = item.siteStatus
          item.siteStatusName = item.siteStatusName
        })
      }


      // const { data, error, loading } = useRequest()
      _op = data;
    } else {
      _op = conf.options;
    }
    console.log(_op)
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

    filterData("select", _, '')

  }, [])

  theme.event$.useSubscription((data: any) => {
    const i = data.relateNames.indexOf(name);
    if (i >= 0) {
      switch (data.type) {
        case "onChange":
          if (!_.params) return;
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
              <Form.Item name={name} rules={props.rules}>
                <MSelect

                  placeholder={_.defaultValue === '' ? _.placeholder : _.placeholder}
                  disabled={_data.state === 'disabled'}
                  onChange={(val) => {
                    if (_.relateNames) {
                      _data.focus$.emit({
                        relateNames: _.relateNames,
                        relatekeys: _.relatekeys,
                        type: _.clickType ? _.clickType : "onChange",
                        value: val
                      });
                    }
                  }}
                  showSearch
                  optionLabelProp="label"
                  optionFilterProp="children"
                  onSearch={(input) => {
                    // onSearch(input)

                    filterData("select", _, input)

                  }}
                  filterOption={(input, option) => {
                    return true
                  }}
                >
                  {
                    OPTION.map((item: any, idx: number) => {
                      return <Option title={item[_.keyName || 'name']}
                                     value={item[_.keyId || 'id']}
                                     key={item[_.keyId || 'id']} label={item[_.keyName || 'name']}
                                     disabled={item.siteStatus === 1 ? true : false}


                      >


                        <div style={{display: 'flex'}}>

                          <span aria-label={item[_.keyName || 'name']}
                                style={{width: '90%'}}>{item[_.keyName || 'name']}</span>

                          {
                            item.siteStatus === 0 ? <Badge status='success' aria-label={item[_.keyName || 'name']}
                                                           text={item.siteStatusName}/>
                              : <Badge status="error" aria-label={item[_.keyName || 'name']} text={item.siteStatusName}
                                       style={{color: '#ccc'}}/>
                          }

                        </div>

                      </Option>
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
