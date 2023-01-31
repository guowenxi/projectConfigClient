import { Button } from "antd";
import { PlusCircleOutlined, DeleteOutlined } from '@ant-design/icons';
import React from "react";
import styled from "styled-components";
import styles from './index.module.less'
export const AllButton = (name: string, fn: any, other1?: any) => {
  let other = !!other1 ? other1 : { type: undefined, icon: undefined }
  const { type, icon, } = other
  // type add delte search 
  if (!!type) {
    switch (type) {
      case 'add':
        return <Button
          type="primary"
          //  className={`${styles['but-style-add']}`}
          style={{ minWidth: '5vw' }}
          onClick={fn}>
          <PlusCircleOutlined />
          {name}
        </Button>
        break;
      case 'delte':
        return <Button
          danger
          type="primary"
          style={{ minWidth: '5vw' }}
          //  className={`${styles['but-style-delte']}`} 
          onClick={fn}>
          <DeleteOutlined />
          {name}
        </Button>
        break;
      case 'search':
        break;

      case 'primary':
        return <Button
          type="primary"
          // className={`${styles['but-style-add']}`}
          style={{ minWidth: '45px' }} onClick={fn}>{name}</Button>
        break;

      default:
        break;
    }
  }
  return <Button onClick={fn}>{name}</Button>
}

export const ButBox = styled.div<{ butNum?: any, type?: any }>`
  display:flex;
  // justify-content: space-between;
  >button{
    // border-radius: 5px;
    ${(props: any) => {
    if (props.type == 'left') {
      return `margin-right:10px;`
    } else {
      return `margin-left:10px;`
    }
  }
  }
  }
`

export const FormLineBox = styled.div<{ lableWidth?: any, contentWidth?: any, marginright?: any }>`
  display:flex;
  ${(props) => {
    if (!(!!props.marginright)) {
      return 'margin-right:10px;'
    } else {
      return `margin-right:${props.marginright};`
    }
  }
  }
  >span{
    min-width:${props => props.lableWidth ? props.lableWidth : '3.2vw'};
    margin-right:10px;
    // word-break:break-all;
    line-height:35px;
  }
  .infoBox{
    width:${prop => prop.contentWidth ? prop.contentWidth : '100%'};
  }
`