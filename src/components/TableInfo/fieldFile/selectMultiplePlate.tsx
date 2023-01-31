import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';

import {connect} from "dva";
import { useDynamicList, useUpdateEffect } from 'ahooks';
import { Select as ASelect } from 'antd';
import { Input ,message } from 'antd';
import type { Iconf} from '../TableInfo';
import { wrapContext } from '../TableInfo';
import { ShowData } from './_css_comm';
import { Form } from 'antd';
import { CloseCircleTwoTone, PlusSquareTwoTone } from '@ant-design/icons';


const WrapBox = styled(Form.Item)`
  float: left;
  width: 100%;
  height: 100%;
  border: 1px solid #ccc;
`;
const Add = styled(PlusSquareTwoTone)`
  font-size: 18px;
  position: absolute;
  top: -5px;
  right: -7px;
  color: #ec2828;
  cursor: pointer;
`;
const Close = styled(CloseCircleTwoTone)`
  font-size: 18px;
  position: absolute;
  top: -5px;
  right: -7px;
  color: #ec2828;
  cursor: pointer;
`;
const Inputs = styled(Input)`
  && {
    min-width: 110px;
    text-align: left !important;
    /* margin-left: 10px; */
    letter-spacing: 6px;
    font-weight: bold;
  }
`;
const PlateSelect = styled.div`
  min-width: 110px;
  font-weight: bold;
  float: left;
  background: #3a93f8;
  border-radius: 6px;
  height: 40px;
  margin: 1vh;
  display: flex;
  position: relative;
  padding: 10px;
  text-align: center;
  color: #fff;
  letter-spacing: 3px;
  &::before {
    content: '';
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 96%;
    height: 33px;
    border: 1px solid #fff;
    border-radius: 3px;
  }
  input {
    color: #fff;
    max-width: 20px;
    min-width: 20px;
    border: none;
    background: transparent;
    padding: 0 !important;
  }
`;

const PlateSelectBox = styled.div`
  width: 100%;
  float: left;
`;
const PlateList = styled.div`
  width: 100%;
  float: left;
`;

interface Ioptions {
  name: string;
  id: number;
}
interface IconfSelect extends Iconf {
  placeholder?: string;
  relationType: string;
  options: Ioptions[];
  defaultValue: string;
}
interface ISelect {
  dispatch?: any;
  conf: IconfSelect;
  name: string;
}

const Select: React.FC<ISelect> = (props) => {
  const {name} = props;
  const theme: any = useContext(wrapContext);
  const [INPUT, setINPUT] = useState('浙C');
  const { list, resetList, remove, push } = useDynamicList<any>([]);
  useUpdateEffect(() => {
    theme.form.setFieldsValue({
      [name]: list,
    });
  }, [list]);
  useEffect(() => {
    const data = theme.form.getFieldsValue();
    resetList(data[name] === '' ? [] : data[name]);
  }, []);
  return (
    <wrapContext.Consumer>
      {(_data: any): any => {
        switch (_data.state) {
          case 'default':
            // return <ShowData>{VAL}</ShowData>;
            return <ShowData></ShowData>;
            break;
          case 'edit':
          case 'new':
          case 'disabled':
            return (
              <WrapBox name={name}>
                {_data.state != 'disabled' ? (
                  <PlateSelectBox>
                    <PlateSelect>
                      <Input.Group>
                        {/* <Input maxLength="1"/>
                      <Input maxLength="1"/>
                      <Circle>·</Circle> */}
                        <Inputs
                          maxLength={7}
                          value={INPUT}
                          onChange={(e) => {
                            setINPUT(e.target.value);
                            // theme.form.setFieldsValue({
                            //   [name]: e.target.value,
                            // });
                          }}
                        />
                      </Input.Group>
                      <Add
                        onClick={() => {
                          if (INPUT.length === 7) {
                            push(INPUT.toUpperCase());
                            setINPUT('浙C');
                          }else{
                            message.error('请输入完整的车牌信息');
                          }
                        }}
                      />
                    </PlateSelect>
                  </PlateSelectBox>
                ) : null}
                <PlateList>
                  {list.map((item: any, idx: number) => {
                    return (
                      <PlateSelect key={idx}>
                        {
                        _data.state != 'disabled'?
                          <Close onClick={() => remove(idx)} twoToneColor="#ec2828" /> :null
                        }
                        {item}
                      </PlateSelect>
                    );
                  })}
                </PlateList>
              </WrapBox>
            );
            break;
        }
      }}
    </wrapContext.Consumer>
  );
};
export default connect(({ select }: {select: any}) => ({
  select,
}))(Select);
