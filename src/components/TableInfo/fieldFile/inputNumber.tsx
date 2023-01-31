import React, {useState, useEffect} from 'react';
import styled, {ThemeProvider} from 'styled-components';

import {connect} from "dva";
import {InputNumber as AInputNumber} from 'antd';
import type {Iconf} from '../TableInfo';
import {wrapContext} from '../TableInfo';
import {Form} from 'antd';
import {ShowData} from './_css_comm';

const MInputNumber = styled(AInputNumber)`
  .ant-input-number-input {
    height: auto;
    padding: 0 11px 0 0;
  }

  && {
    width: 100%;
    padding: 1vh;
  }
`;

interface IconfInputNumber extends Iconf {
  min?: number;
  max?: number;
  defaultValue?: number;
  decimalSeparator?: string;
}

interface InputNumber {
  dispatch?: any;
  conf: IconfInputNumber;
  name: string;
  rules: any;
}

const InputNumber: React.FC<InputNumber> = (props) => {
  const _: any = props.conf;
  const {name} = props;


  useEffect(() => {
  }, []);
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
              <Form.Item name={name}
                         rules={props.rules}>
                <MInputNumber
                  style={_.style}
                  min={_.min ? _.min : 0}
                  max={_.max ? _.max : 9999}
                  disabled={_data.state === 'disabled' || _.disabled === true}


                  addonAfter={_.text}

                  placeholder={_.placeholder}
                  size={_.size}/>
              </Form.Item>
            );
            break;
        }
      }}
    </wrapContext.Consumer>
  );
};

export default InputNumber;
// export default connect(({  }: ConnectState) => ({

// }))(Input);
