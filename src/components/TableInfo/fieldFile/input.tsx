import React, {useState, useEffect} from 'react';
import styled, {ThemeProvider} from 'styled-components';
import {connect} from "dva";
import {Input as AInput} from 'antd';
import type {Iconf} from '../TableInfo';
import {wrapContext} from '../TableInfo';
import {ShowData} from './_css_comm';

import {Form} from 'antd';

const Minput = styled(AInput)`
  && {
    //height: 100%;
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

const Input: React.FC<Iinput> = (props) => {
    const _: any = props.conf;
    const {name} = props;

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
                                <Minput
                                    style={_.style}
                                    disabled={_data.state === 'disabled'}
                                    placeholder={_.placeholder}
                                    size={_.size}
                                />
                            </Form.Item>
                        );
                        break;
                }
            }}
        </wrapContext.Consumer>
    );
};
export default connect(({}) => ({}))(Input);
