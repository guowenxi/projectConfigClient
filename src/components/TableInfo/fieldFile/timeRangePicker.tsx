import React, {useState, useEffect} from 'react';
import styled, {ThemeProvider} from 'styled-components';

import {connect} from "dva";
import {TimePicker as _DatePicker} from 'antd';
import type {Iconf} from '../TableInfo';
import {wrapContext} from '../TableInfo';
import {ShowData} from './_css_comm';

import {
  Form,
} from 'antd';


const ARangePicker = _DatePicker.RangePicker;
const MRangePicker = styled(ARangePicker)`

  width: 100%;

  && {
    padding: 1vh;
  }

`;


interface IconfInput extends Iconf {
  placeholder?: string;
}

interface Iinput {
  dispatch?: any;
  conf: IconfInput;
  name: string;
  rules: any;
}

const TimeRangePicker: React.FC<Iinput> = (props) => {
  const _: any = props.conf;
  const {name} = props;

  return (
    <wrapContext.Consumer>

      {(_data): any => {
        switch (_data.state) {
          case "default" :
            return <ShowData>{_.defaultValue || "　"}</ShowData>;
            break;
          case "edit" :
          case "new" :
          case "disabled" :
            return <Form.Item name={name} noStyle
                              rules={props.rules}>
              <MRangePicker
                style={_.style}
                disabled={_data.state === 'disabled'}
                format={_.showTime ? 'HH:mm' : 'HH:mm'}
              />
            </Form.Item>
            break;
        }
      }}
    </wrapContext.Consumer>
  );
};
export default connect(({}) => ({}))(TimeRangePicker);
