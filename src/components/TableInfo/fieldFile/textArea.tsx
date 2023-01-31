import React, {} from 'react';
import styled from 'styled-components';
import {connect} from "dva";
import {Input} from 'antd';
import type {Iconf} from '../TableInfo';
import {wrapContext} from '../TableInfo';
import {ShowData} from './_css_comm';


import {
    Form,
} from 'antd';

const MTextArea = styled(Input.TextArea)`
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

const TextArea: React.FC<Iinput> = (props) => {
    const _: any = props.conf;
    const {name} = props;


    return (
        <wrapContext.Consumer>

            {(_data: any): any => {
                switch (_data.state) {
                    case "default" :
                        return <ShowData>{_.defaultValue || "　"}</ShowData>;
                        break;
                    case "edit" :
                    case "new" :
                    case "disabled" :
                        return <Form.Item name={name}
                                          rules={props.rules}
                        >
                            <MTextArea
                                style={_.style}
                                disabled={_data.state === 'disabled'}
                                placeholder={_.placeholder}
                                size={_.size}
                                bordered={_.bordered}
                                showCount={_.showCount}
                                maxLength={_.maxLength}
                                autoSize={_.autoSize}

                            />

                        </Form.Item>
                        break;
                }
            }}
        </wrapContext.Consumer>
    );
};
export default connect(({}) => ({}))(TextArea);
