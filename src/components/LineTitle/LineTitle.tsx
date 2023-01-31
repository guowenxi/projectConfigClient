import React, {  } from 'react';

import {connect} from "dva";
import styled from 'styled-components';
import { wrapContext } from '../TableInfo';
const TableTitle = styled.div<{ lineColor?: string }>`
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
let Line = styled.div`

`;

interface IconfInput extends Iconf {
  placeholder?: string;
}
interface Iinput {
  dispatch?: any;
  conf: IconfInput;
  name: string;
}

const LineTitle: React.FC<Iinput> = (props) => {
  const _: any = props;

  return (
    <TableTitle lineColor={_.lineColor}>
    {_.value}
  </TableTitle>
  );
};
export default connect(({}) => ({}))(LineTitle);
