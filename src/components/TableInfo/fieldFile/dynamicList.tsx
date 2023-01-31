import React, { useEffect, useContext } from 'react';
import styled from 'styled-components';
import { Input, Form } from 'antd';
import { useUpdateEffect } from 'ahooks';
// import { FormComponentProps } from 'antd/lib/form';
import { useDynamicList } from 'ahooks';
import {connect} from "dva";
import type { Iconf } from '../TableInfo';
import { wrapContext } from '../TableInfo';
import { ShowData } from './_css_comm';
import { PlusCircleOutlined, MinusCircleOutlined } from '@ant-design/icons';

const FromList = styled(Form.Item)`
  && {
    height: 100%;
    padding: 1vh;
    border: 1px solid #ccc;
  }
  .items {
    margin: 5px 0;
  }
`;
interface IconfInput extends Iconf {
  placeholder?: string;
  // keyName:string;
}

interface Iinput {
  name: string;
  conf: IconfInput;
  rules: any;
}

const DynamicList: React.FC<Iinput> = (props) => {
  const theme: any = useContext(wrapContext);
  const { list, resetList, insert, remove, getKey } = useDynamicList<any>([]);
  const _: any = props.conf;
  const { name } = props;
  const Row = (index: number, item: any) => {
    return (
      <div className="items" key={getKey(index)}>
        <Input
          style={{ width: 300 }}
          placeholder={_.placeholder}
          value={item[_.keyName]}
          //   defaultValue={item[_.keyName]}
          onChange={(e) => {
            const _list: any = list;
            _list[index][_.keyName] = e.target.value;
            resetList(_list);
            theme.form.setFields([
              {
                name,
                value: _list,
              },
            ]);
          }}
        />
        {list.length > 1 && (
          <MinusCircleOutlined
            style={{ marginLeft: 8 }}
            onClick={() => {
              remove(index);
            }}
          />
        )}
        <PlusCircleOutlined
          style={{ marginLeft: 8 }}
          onClick={() => {
            insert(index + 1, {});
          }}
        />
      </div>
    );
  };
  const filterData = (props: any) => {
    const data = theme.form.getFieldsValue();
    resetList(data[name].length == 0 ? [{}] : data[name]);
    return data[name];
  };

  // 只在初始化时进行加载
  useEffect(() => {
    filterData(props);
  }, []);
  // 只在初始化时进行加载
  useUpdateEffect(() => {
    theme.form.setFields([
      {
        name,
        value: list,
      },
    ]);
  }, [list]);

  return (
    <wrapContext.Consumer>
      {(_data) => {
        switch (_data.state) {
          case 'default':
            return <ShowData>{_.defaultValue || '　'}</ShowData>;
            break;
          case 'edit':
          case 'new':
          case 'disabled':
            return (
              <FromList name={name} rules={props.rules}>
                {list.map((ele, index) => {
                  return Row(index, ele);
                })}
              </FromList>
            );
            break;
        }
      }}
    </wrapContext.Consumer>
  );
};
export default connect(({}) => ({}))(DynamicList);
