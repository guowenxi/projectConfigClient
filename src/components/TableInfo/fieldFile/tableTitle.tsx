import React, { useCallback } from 'react';

import {connect} from "dva";
import type { Iconf} from '../TableInfo';
import { wrapContext } from '../TableInfo';
import styled from 'styled-components';
const ATableTitle = styled.div<{ lineColor?: string }>`
  width: 100%;
  height: 45px;
  line-height: 45px;
  font-weight: bold;
  font-size:16px;
  padding: 0 3vh;
  position: relative;
  display: flex;
  &:before {
    position: absolute;
    top: 50%;
    left: 1vh;
    width: 5px;
    height: 40%;
    background: ${(props) => (props.lineColor ? props.lineColor : `#000`)};
    transform: translateY(-50%);
    content: '';
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

const TableTitle: React.FC<Iinput> = (props) => {
  const _: any = props.conf;
  return (
    <wrapContext.Consumer>
      {(_data) => {
        return (
          <ATableTitle lineColor={_.lineColor}>{_.defaultValue}</ATableTitle>
        );
      }}
    </wrapContext.Consumer>
  );
};
export default connect(({}) => ({}))(TableTitle);
