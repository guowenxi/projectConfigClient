import React, { useState, useEffect } from 'react';
import styled, { ThemeProvider } from 'styled-components';

import {connect} from "dva";
import { InputNumber as AInputNumber } from 'antd';
import { DatePicker as ADatePicker } from 'antd';
import type { Iconf} from '../TableInfo';
import { wrapContext } from '../TableInfo';
import { ShowData } from './_css_comm';
import moment from 'moment';
import { Form } from 'antd';

const FlexBox = styled.div`
  display: flex;
  flex-flow: row nowrap;
`;
const MInputNumber = styled(AInputNumber)`
  .ant-input-number-input {
    height: auto;
    padding: 0 11px 0 0;
  }
  flex: 2;
  && {
    width: 100%;
    padding: 1vh;
  }
`;
const MDatePicker = styled(ADatePicker)`
  flex: 1;
  && {
    height: 100%;
    padding: 1vh;
  }
`;

interface IconfInput extends Iconf {
  placeholder?: string;
}
interface Iinput {
  dispatch: any;
  conf: IconfInput;
  name: string;
  rules: any;
}

let defaultValueData: number=0;

const Input: React.FC<Iinput> = (props) => {
  const _: any = props.conf;
  const {name} = props;
  // const { dispatch } = props;
  const {dispatch} = props
  const [NOWDATE, setNOWDATE] = useState(moment(new Date(), 'YYYY/MM/DD'));



  async function changeData(params: any) {
    if (!params) params = 0;
    const data = await dispatch({
      type: 'common/requestData',
      url: _.url,
      method: 'GET',
      payload: {
        limitNum: params,
        beginDate: moment().format('YYYY/MM/DD'),
      },
    });

    setNOWDATE(moment(data));
  }

  /* 获取当前值 */
  const getCurrentValue=(data: any)=>{
   const value: any=data.getFieldValue(name);
   defaultValueData=value;
  }

  useEffect(()=>{
    if(defaultValueData!=undefined || defaultValueData!=null){
      changeData(defaultValueData);
    }
  },[defaultValueData])


  return (
    <wrapContext.Consumer>
      {(_data: any): any => {
        switch (_data.state) {
          case 'default':
            return <ShowData>{_.defaultValue || '　'}</ShowData>;
            break;
          case 'edit':
          case 'new':
          case 'disabled':
            return (
              <FlexBox>
                <Form.Item name={name} rules={props.rules}>
                  <MInputNumber
                    onChange={(e) => {
                      changeData(e);
                    }}
                    style={_.style}
                    disabled={_data.state === 'disabled'}
                    placeholder={_.placeholder}
                    size={_.size}
                    min={0}
                  />
                </Form.Item>
                <MDatePicker disabled value={NOWDATE} />
                {getCurrentValue(_data.form)}
              </FlexBox>
            );
            break;
        }
      }}
    </wrapContext.Consumer>
  );
};
export default connect(({}) => ({}))(Input);
