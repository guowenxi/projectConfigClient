import React, { Component } from 'react';
import styled, { ThemeProvider } from 'styled-components';

import styles from './index.less';

export const Item = styled.div<{ minHeight?: string; itemWidth?: string }>`
  display: flex;
  flex-flow: row;
  float: left;
  width:${props => `${props.itemWidth}%`};
  .contentItem-name {
    text-align: center;
    max-width: 5.21vw;
    min-width: 5.21vw;
    padding: 1vh 0;
    border: 1px solid #dcdcdc;
    //box-shadow: 0 0 0 0.5px #dcdcdc inset;
    background: #ebebeb;
  }
  .contentItem-val {
    height:100%;
    min-height: ${props => `${props.minHeight}`};
    flex: 1;
    padding: 1vh;
    border: 1px solid #dcdcdc;
    textarea {
      border: none;
      padding: 0;
      outline: none;
      font-size: 0.83vw;

      &:focus {
        border: none;
      }
    }
  }


`;
interface props {
  type: any;
  name: any;
  val: any;
  children: any;
  minHeight: any;
  itemWidth: any;
}

export default class ContentItem extends Component<props> {
  render() {
    const { type, name, val, children, minHeight, itemWidth } = this.props;
    minHeight === true ? console.error('minHeight参数不能为空') : null;
    return (
      <Item minHeight={minHeight} itemWidth={itemWidth}>
          <div className="contentItem-name">{name}</div>
          <div className="contentItem-val">{val || children}</div>
      </Item>
    );
  }
}
