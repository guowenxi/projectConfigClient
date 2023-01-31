import styled from 'styled-components';
import React, { useEffect, useState, useRef } from 'react';
import { Spin, Modal, Form, Pagination, Switch, Button, Row, Col, Radio, Table, Input, Image } from 'antd';
import { SearchOutlined } from '@ant-design/icons'
import styles from './myStyle.less'

// 按键box
export const ButBox = styled.div<{ butSize: any, pos?: any }>`
  display: flex;
  ${(props) => {
    if (props.pos) {
      if (props.pos == 'right') {
        return ` 
        width:'100%';
        justify-content: right;
        `
      }
    }
    return `
    width:${props.butSize * 110}px;
    justify-content: space-between;
    `
  }}
`;
// 搜索按键
export const SearchBut = () => {
  return <span style={{ display: "inline-block", backgroundColor: '#1db0ff', padding: '3px 12px 0px', borderRadius: '4px' }}>
    <SearchOutlined style={{ color: 'white', fontSize: '23px' }} />
  </span>
}
// 小标题
export const LitTilte = (title: any, iconObj?: any) => {
  return <div className={styles['litTitle']}>
    {
      iconObj ?
        <img src={iconObj} style={{ marginRight: '10px' }} /> : ''
    }
    <span>{title}</span>
  </div>
}
// 报格样式
export const FormItem = styled.div`
  display:flex;
  align-items:center;
  margin-bottom:27px;
  >div:nth-child(1){
    color:white;
    min-width:120px;
    letter-spacing: 7px;
  }
  >div:nth-child(2){
    min-width:300px;
  }
`
