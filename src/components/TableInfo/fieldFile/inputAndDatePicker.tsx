import React, {useContext, useEffect, useState} from 'react';
import styled from 'styled-components';

import {connect} from "dva";
import {DatePicker as ADatePicker, Input as AInput} from 'antd';
import type {Iconf} from '../TableInfo';
import {wrapContext} from '../TableInfo';
import {ShowData} from './_css_comm';
import moment from 'moment';
import {Form} from 'antd';
import {useList} from "react-use";


const InputDatePicker = styled.div`
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

  .box {
    display: flex;
    width: 100%;

    .box-right-side-box {
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

const Minput = styled(AInput)`
  && {
    height: 100%;
    padding: 1vh;
  }
`;
const MDatePicker = styled<any>(ADatePicker)`
  width: 100%;

  && {
    padding: 1vh;
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

const InputAndDatePicker: React.FC<Iinput> = (props) => {
  const _: any = props.conf;
  const theme: any = useContext(wrapContext);


  const getBirthday = (value) => {
    if (value.length === 18) {
      // 18位身份证号
      let birthday = value.substr(6, 4) + "-" + value.substr(10, 2) + "-" + value.substr(12, 2);
      theme.form.setFieldsValue({
        [_.datePickerProps.name]: moment(birthday, 'YYYY/MM/DD')
      });
    } else if (value.length === 15) {
      // 15位身份证号
      let birthday = "19" + value.substr(6, 2) + "-" + value.substr(8, 2) + "-" + value.substr(10, 2);
      theme.form.setFieldsValue({
        [_.datePickerProps.name]: moment(birthday, 'YYYY/MM/DD'),
      });
    }
  }

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
              <InputDatePicker style={{display: "flex"}}>
                <div className="box">
                  <Label
                    style={{
                      width: '100%'
                    }}
                    col={3}
                    className="contentItem-name"
                  >
                    <span className="required">*</span>
                    {_.inputProps.label}
                  </Label>
                  <div className="box-right-side-box">
                    <Form.Item name={_.inputProps.name} rules={props.rules}>
                      <Minput
                        style={_.inputProps.style}
                        disabled={_data.state === 'disabled'}
                        placeholder={_.inputProps.placeholder}
                        size={_.inputProps.size}
                        onBlur={(e) => {
                          console.log(e.target.value)
                          getBirthday(e.target.value);

                        }}
                      />
                    </Form.Item>
                  </div>
                </div>
                <div className="box">
                  <Label
                    style={{
                      width: '100%'
                    }}
                    col={3}
                    className="contentItem-name"
                  >
                    {_.datePickerProps.label}
                  </Label>
                  <div className="box-right-side-box">
                    <Form.Item name={_.datePickerProps.name} rules={props.rules}>
                      <MDatePicker
                        style={_.datePickerProps.style}
                        showTime={_.datePickerProps.showTime}
                        disabledDate={(current: number) => {
                          if (typeof _.datePickerProps.disabledDate === 'function') {
                            return _.disabledDate(current);
                          }
                          if (_.datePickerProps.disabledDate === '>') {
                            return current && current > Number(moment().endOf('day').subtract(1, 'days'));
                          }
                          if (_.datePickerProps.disabledDate === '<') {
                            return current && current < Number(moment().endOf('day').subtract(1, 'days'));
                          }
                        }}
                        disabledTime={_.datePickerProps.showTime && _.datePickerProps.disabledTime ? _.datePickerProps.disabledTime : null}
                        disabled={_data.state === 'disabled'}
                        format={_.datePickerProps.showTime ? 'YYYY/MM/DD HH:mm:ss' : 'YYYY/MM/DD'}
                      />
                    </Form.Item>
                  </div>
                </div>
              </InputDatePicker>
            );
            break;
        }
      }}
    </wrapContext.Consumer>
  );
};
export default connect(({}) => ({}))(InputAndDatePicker);
