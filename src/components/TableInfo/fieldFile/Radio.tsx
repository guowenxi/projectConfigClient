import React, { useState, useEffect,useContext } from 'react';
import styled from 'styled-components';

import {connect} from "dva";
import { Radio as ARadio } from 'antd';

import type { Iconf} from '../TableInfo';
import { wrapContext } from '../TableInfo';
import { ShowData } from './_css_comm';
import { Form } from 'antd';


const WRadio = styled(ARadio.Group)`
  width:100% !important;
  height:100% !important;
  border:1px solid #ccc;
`;

const MRadio = styled(ARadio)`
  && {
    float: left;
    /* height: 43px; */
    position: relative;
    top: 50%;
    transform: translateY(-50%);
    padding: 0 10px;
    .ant-select-selector{
      height:100%;
    }
    .ant-select-selection-search-input{
      height:100% !important;
    }
  }
`;

interface Ioptions {
  name: string,
  id: number
}
interface IconfSelect extends Iconf {
  placeholder?: string;
  relationType: string;
  options: Ioptions[];
  defaultValue: string;
  relateNames: string;
  relatekeys: string;
  clickType: string;

}
interface IRadio {
  dispatch?: any;
  conf: IconfSelect;
  name: string;
  rules: any;
}

const Radio: React.FC<IRadio> = (props) => {
  const _: any = props.conf;
  const {name} = props;
  const {dispatch} = props;
  const [OPTION, setOPTION ]  = useState([]);
  const [VAL, setVAL]  = useState("　");
  const theme: any = useContext(wrapContext);

  const data = theme.form.getFieldValue(name);

  async function filterData(namespace: string,conf: any){
    let _op = [];
    if(conf.relationType){
      _op = props[namespace][conf.relationType];
    }else if(conf.url){

      const data = await dispatch({
        type: 'common/requestData',
        url: conf.url,
        method: 'GET',
        payload: {
          ...conf.params
        },
      })

      if(conf.keyName){
        data.map(function(item: any,idx: number){
          item.name = item[conf.keyName];
          item.id = item[conf.idName];
        })
      }
      // const { data, error, loading } = useRequest()
      _op = data;
    }else{
      _op = conf.options;
    }
    setOPTION(_op);
    filterDefaultValue(_op,_.defaultValue)
  }

  function filterDefaultValue(OPTION: Ioptions[],id: string){
    if(Number(id)){
      const val: any =  OPTION.find(function(item){
        return Number(item.id) ===Number(id);
      })
      setVAL(val?val.typeId:'')
    }
  }
  // 只在初始化时进行加载
  useEffect(()=>{
    filterData("select",_)
  },[])

  theme.event$.useSubscription((data: any) => {
    const i= data.relateNames.indexOf(name);
    if(i>=0){
      switch(data.type){
        case "onChange":
          if( !_.url && !_.params ){
            theme.form.setFieldsValue({
              [name]:data.value,
            });
          }else{
            _.params[data.relatekeys[i]] = data.value;
            theme.form.setFieldsValue({
              [name]:[],
            });
            if(_.optionsKeyName){
              _.optionsList.map((item: any,index: number)=>{
                if(item[_.keyName]===data.value){
                  setOPTION(item[_.optionsKeyName]);
                }
              })
            }else{
              filterData("select",_)
            }
          };
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
            return <ShowData>{_.defaultValue || '　'}</ShowData>;
            break;
          case 'edit':
          case "new" :
          case 'disabled':
            return (
              <Form.Item name={name}
                         rules={props.rules}>
                <WRadio disabled={_data.state === 'disabled'}
                        onChange={(e)=>{
                          if(_.relateNames){
                            _data.focus$.emit({
                              relateNames:_.relateNames,
                              relatekeys:_.relatekeys,
                              type:_.clickType ? _.clickType  : "onChange",
                              value:e.target.value
                            })
                          }
                        }}>
                  {OPTION && OPTION.map((item: any,idx: number)=>{
                    return <MRadio key={idx} value={item[_.idName || 'id']}>{item[_.keyName || 'name']}</MRadio>
                  })}
                </WRadio>
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
                        }: {select: any}) => ({
  select
}))(Radio);
