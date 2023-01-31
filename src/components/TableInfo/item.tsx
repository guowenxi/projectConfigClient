import React, { Component } from 'react';
import styled from 'styled-components';
import loadable from '@loadable/component';
import type { IitemData } from './TableInfo';

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

const Field = styled.div<{ col?: string | number }>`
  flex: ${(props) => (props.col ? props.col : 7)};
`;

const Item = styled.div<{ minHeight?: string; itemWidth?: string; style?: any }>`
  display: flex;
  flex-flow: row;
  float: left;
  width: ${(props) => `${props.itemWidth}%`};
  .required {
    color: red;
  }
  .contentItem-name {
    min-width: 10vw;
    max-width: 10vw;
    padding: 1vh 0;
    text-align: center;
    background: #ebebeb;
    border: 1px solid #d9d9d9;
  }
  .ant-form-item {
    height: 100%;
    margin-bottom: 0;
  }
  .ant-form-item-explain {
    ::after {
      position: absolute;
      top: -3px;
      z-index: 111;
      width: 5px;
      height: 5px;
      background: #fff;
      border-top: 1px solid #ccc;
      border-left: 1px solid #ccc;
      transform: rotate(45deg);
      content: '';
    }
    position: absolute;
    top: calc(100% + 5px);
    left: 0;
    z-index: 100;
    padding: 5px;
    background: #fff;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
  .default-field {
    padding: 1vh;
    border: 1px solid #ccc;
  }
  .contentItem-val {
    position: relative;
    min-height: ${(props) => (props.minHeight ? `${props.minHeight}` : 'auto')};
    /* border: 1px solid #d9d9d9; */
    textarea {
      padding: 0;
      //font-size: 0.83vw;
      border: none;
      outline: none;

      &:focus {
        border: none;
      }
    }
  }
`;

interface props {
  _item: IitemData;
  className: string;
  focus$?: any;
}

export default class ContentItem extends Component<props> {
  filter_type(type: string, _: IitemData) {
    // 如果是默认数据 不可编辑的
    if (type === 'default') {
      return <div>{_.field.props.defaultValue || '　'}</div>;
    }
    // 如果是可编辑的
    const Dom = loadable(() => import(`./fieldFile/${type}.tsx`));

    return <Dom {..._} focus$={this.props.focus$} conf={_.field.props}></Dom>;
  }

  render() {
    const _ = this.props._item;
    return (
      <Item
        className={this.props.className}
        style={_.style}
        minHeight={_.height}
        itemWidth={_.width}
      >
        {/* 左侧 */}
        <Label
          style={Object.keys(_.label.style).length ? _.label.style : {}}
          col={_.label.col}
          className="contentItem-name"
        >
          {_.rules[0].required.toString() === 'true'  ? <span className="required">*</span> : null}
          {_.label.name}
        </Label>
        {/* 右侧 */}
        <Field col={_.field.col} className="contentItem-val">
          {_.costomNode || this.filter_type(_.field.type, _)}
        </Field>
      </Item>
    );
  }
}

interface Dprops extends IitemData {
  className: string;
}
export const DefaultItem: React.FC<Dprops> = (props) => {
  return (
    <Item className={props.className} minHeight={props.height} itemWidth={props.width}>
      {/* 左侧 */}
      <Label col={props.label.col} className="contentItem-name">
        {props.label.name}
      </Label>
      {/* 右侧 */}
      <Field col={props.field.col} className="contentItem-val default-field">
        {props.field.name}
      </Field>
    </Item>
  );
};
