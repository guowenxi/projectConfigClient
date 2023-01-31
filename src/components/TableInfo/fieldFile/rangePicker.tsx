import React, {useState, useEffect, useContext} from 'react';
import styled, {ThemeProvider} from 'styled-components';

import {connect} from "dva";
import {DatePicker as _DatePicker} from 'antd';
import {TimePicker as _TimePicker} from 'antd';
import type {Iconf} from '../TableInfo';
import {wrapContext} from '../TableInfo';
import {ShowData} from './_css_comm';

import {
  Form,
} from 'antd';


const ARangePicker = _DatePicker.RangePicker;
const ARangeTimePicker = _TimePicker.RangePicker;
const MRangeTimePicker = styled(ARangeTimePicker)`
  width: 100%;

  && {
    padding: 1vh;
  }
`;
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

function formatDate(date) {
  const filter = ["YYYY", "MM", "SS"];
  var bol = filter.find(function (item, idx) {
    return date.indexOf(item) != -1
  })
  return bol;
}

const RangePicker: React.FC<Iinput> = (props) => {
  const _: any = props.conf;
  const {name} = props;
  const theme: any = useContext(wrapContext);

  const data = theme.form.getFieldValue(name);

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
              {
                formatDate(_.format || 'YYYY/MM/DD hh:mm:ss') ?
                  <MRangePicker
                    style={_.style} showTime={_.showTime} showToday={_.showToday}
                    disabled={_data.state === 'disabled'}
                    format={_.format || 'YYYY/MM/DD hh:mm:ss'}
                  />
                  :
                  <MRangeTimePicker
                    style={_.style} showTime={_.showTime} showToday={_.showToday}
                    disabled={_data.state === 'disabled'}
                    format={_.format || 'hh:mm:ss'}
                  />
              }

            </Form.Item>
            break;
        }
      }}
    </wrapContext.Consumer>
  );
};
export default connect(({}) => ({}))(RangePicker);
