import React, {useState, useEffect, useContext} from 'react';
import styled from 'styled-components';
import {connect} from "dva";

import type {Iconf} from '../TableInfo';
import {wrapContext} from '../TableInfo';
import {ShowData} from './_css_comm';

import 'braft-editor/dist/index.css';
import BraftEditor from 'braft-editor';
import {Form} from 'antd';

let instance: any = '';
const MBraftEditor = styled(BraftEditor)`
  overflow: hidden;

  && {
    height: 100%;
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
  const theme: any = useContext(wrapContext);

  const [, setCurrentData] = useState(''); /* 当前数据 */
  // const [instance, set_instance] = useState({}); /* 当前数据 */

  const handleChange = (editorState: any) => {
    if (editorState.toHTML() === "<p></p>") {
      theme.form.setFieldsValue({
        [name]: "",
      });
      setCurrentData("");
    } else {
      theme.form.setFieldsValue({
        [name]: editorState.toHTML(),
      });
      setCurrentData(editorState.toHTML());
    }

  };

  useEffect(() => {
    getDefault();
  }, [instance]);

  /* 获取默认值 */
  const getDefault = () => {
    const data = theme.form.getFieldValue(name);

    if (data) {
      const editorState = BraftEditor.createEditorState(data);
      setCurrentData(editorState);
      instance.setValue(editorState);
    }
  };

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
                <MBraftEditor
                  ref={(ins) => {
                    instance = ins;
                  }}
                  // value={currentData}
                  readOnly={_data.state === 'disabled'}
                  onChange={handleChange}
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
