import React, {  } from 'react';
import styled from 'styled-components';

import {connect} from "dva";
import { DatePicker as ADatePicker } from 'antd';
import type { Iconf } from '../TableInfo';
import { wrapContext } from '../TableInfo';
import { ShowData } from './_css_comm';
import moment from 'moment';
import { Form } from 'antd';

const MDatePicker = styled<any>(ADatePicker)`
  width: 100%;
  && {
    padding: 1vh;
  }
`;



interface IconfInput extends Iconf {
  placeholder?: string;
  disabledDate?: object | string;
  disabledTime?: object | string;
  showTime?: boolean;
}
interface Iinput {
  dispatch?: any;
  conf: IconfInput;
  name: string;
  rules: any;
}

const DatePicker: React.FC<Iinput> = (props) => {
  const _: any = props.conf;
  const { name } = props;

  return (
    <wrapContext.Consumer>
      {(_data): any => {
        switch (_data.state) {
          case 'default':
            return <ShowData>{_.defaultValue || '　'}</ShowData>;
            break;
          case 'edit':
          case 'new':
          case 'disabled':
            return (
              <Form.Item name={name} rules={props.rules}>
                <MDatePicker
                  style={_.style}
                  showTime={_.showTime}
                  disabledDate={(current: number) => {
                    if (typeof _.disabledDate === 'function') {
                      return _.disabledDate(current);
                    }
                    if (_.disabledDate === '>') {
                      return current && current > Number(moment().endOf('day').subtract(1, 'days'));
                    }
                    if (_.disabledDate === '<') {
                      return current && current < Number(moment().endOf('day').subtract(1, 'days'));
                    }
                  }}
                  disabledTime={_.showTime && _.disabledTime ? _.disabledTime : null}
                  disabled={_data.state === 'disabled'}
                  format={_.showTime ? 'YYYY/MM/DD HH:mm:ss' : 'YYYY/MM/DD'}
                />
              </Form.Item>
            );
            break;
        }
      }}
    </wrapContext.Consumer>
  );
};
export default connect(({}) => ({}))(DatePicker);
