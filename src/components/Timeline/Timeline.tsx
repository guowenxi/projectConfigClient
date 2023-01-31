import React from 'react';
import { useState } from 'react';
import { Timeline as  ATimeline} from 'antd';
import styled from 'styled-components';
import { Scrollbars } from 'react-custom-scrollbars';


export const WrapBox = styled(Scrollbars)<{ minHeight?: string; itemWidth?: string }>`
  margin: 1vh 0;
  box-shadow: ${(props) => (props.border ? `0 0 0 1px #ccc` : `0`)};
`;


interface Props {
  list: any,
  onClick: Function
}
const Timeline: React.FC<Props> = (props) => {
  const { list} = props;


  return (
    <WrapBox>
      <ATimeline mode={"alternate"}>
        {
          Array.isArray(list)?list.map((item,idx)=>{
          return <ATimeline.Item label={item.label}>{item.content}</ATimeline.Item>
          }):null
        }
      </ATimeline>
    </WrapBox>
  );
};

export default Timeline;
