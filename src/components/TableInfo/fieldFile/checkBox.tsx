import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import {connect} from "dva";
import { Checkbox as ACheckbox } from 'antd';
import type { Iconf } from '../TableInfo';
import { wrapContext } from '../TableInfo';
import { ShowData } from './_css_comm';

import { Form } from 'antd';

const Minput = styled<any>(ACheckbox)`
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
}

const Input: React.FC<Iinput> = (props: any) => {
  const _: any = props.conf;
  const { name } = props;
  const theme: any = useContext(wrapContext);
  const [valueData, setValueData] = useState('');

  useEffect(() => {
    const value = theme.form.getFieldValue(name);
    setValueData(value);
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
              <Form.Item name={name} rules={props.rules}>
                <Minput
                  style={_.style}
                  disabled={_data.state === 'disabled'}
                  placeholder={_.placeholder}
                  size={_.size}
                  value={valueData}
                  checked={valueData}
                  onChange={(val: any) => {
                    const checkedStatus = val.target.checked;
                    theme.form.setFieldsValue({
                      [name]: checkedStatus,
                    });
                    setValueData(checkedStatus);
                    if (_.relateNames) {
                      _data.focus$.emit({
                        relateNames: _.relateNames,
                        relatekeys: _.relatekeys,
                        type: _.clickType ? _.clickType : 'onChange',
                        value: val,
                      });
                    }
                  }}
                >
                  {_.displayName ? _.displayName : ''}
                </Minput>
              </Form.Item>
            );
            break;
        }
      }}
    </wrapContext.Consumer>
  );
};
export default connect(({}) => ({}))(Input);
