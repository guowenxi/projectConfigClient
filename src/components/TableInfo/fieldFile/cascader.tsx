import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import {connect} from "dva";

import type { Iconf } from '../TableInfo';
import { wrapContext } from '../TableInfo';
import { ShowData } from './_css_comm';
import { Form } from 'antd';

import { Cascader as ACascader } from 'antd';
import { G } from '@/global';
import request from '@/services/request';

const {  rbacToken } = G;


const MCascader = styled<any>(ACascader)`
  && {
    width: 100%;
    height: 43px;
    .ant-cascader-input {
      height: 100%;
    }
  }
`;

interface Ioptions {
  name: string;
  id: number;
}
interface IconfInput extends Iconf {
  placeholder?: string;
  relationType: string;
  parentKeyName: string;
  options: Ioptions[];
}
interface ICascader {
  dispatch?: any;
  conf: IconfInput;
  name: string;
}

const Cascader: React.FC<ICascader> = (props: any) => {
  // const { dispatch } = props;
  const _ = props.conf;
  const { name } = props;


  const [OPTION, setOPTION] = useState<any>([{ name: 1, id: 1 }]);
  async function filterData(conf: any) {
    let _op = [];
    if (conf.relationList) {
      const i = conf.relationList[0];

      _op = await request(process.env.ROOT_URL_HTTP + i.url, {
        method: 'GET',
        params: {
          ...i.payload,
          rbacToken,
        },
      });
      _op = _op.data;
      //  dispatch({
      //   type: `${i.type}/getData`,
      //   url: i.url,
      //   name: i.name,
      //   payload: i.payload,
      //   callback:(data)=>{
      //     _op = data;
      //   }
      // });

      // 暂不支持使用url地址
      // let data = useRequest({
      //   url:process.env.ROOT_URL_HTTP+joinUrl(conf.url,conf.params),
      //   method:"GET",
      // })
      // setOPTION(data.data);
    } else {
      _op = conf.options;
    }
    setOPTION(filterListData(_op));
    // filterDefaultValue(_op,_.defaultValue)
  }

  // 只在初始化时进行加载
  useEffect(() => {
    filterData(_);
  }, []);

  const loadData = async (selectedOptions: any) => {
    const idx = selectedOptions.length - 1;
    const sel = selectedOptions[idx];
    if (!_.relationList[idx + 1]) {
      return;
    }
    const i = _.relationList[idx + 1];

    const children: any = await request(process.env.ROOT_URL_HTTP + i.url, {
      method: 'GET',
      params: {
        [_.parentKeyName ? _.parentKeyName : 'id']: sel.id,
        ...i.payload,
        rbacToken,
      },
    });
    sel.children = filterListData(children.data);
    setOPTION(OPTION.slice());
  };
  const onChange = (value: any, selectedOptions: any) => {
    console.log(value, selectedOptions);
  };
  const filterListData = (data: any) => {
    return data.map(function (item: any) {
      item.isLeaf = false;
      if (_.keyName) item.name = item[_.keyName];
      return item;
    });
  };

  return (
    <wrapContext.Consumer>
      {(_data: any): any => {
        switch (_data.state) {
          case 'default':
            return <ShowData>{""}</ShowData>;
            break;
          case 'edit':
          case 'disabled':
            return (
              <Form.Item name={name} rules={props.rules}>
                <MCascader
                  style={_.style}
                  disabled={_data.state === 'disabled'}
                  fieldNames={{ label: 'name', value: 'id' }}
                  displayRender={(label: any) => {
                    if (label.join) {
                      return label.join(' / ');
                    }
                    return label;
                  }}
                  options={OPTION}
                  loadData={loadData}
                  onChange={onChange}
                  changeOnSelect
                ></MCascader>
              </Form.Item>
            );
            break;
        }
      }}
    </wrapContext.Consumer>
  );
};
export default connect(({ select }: {select: any}) => ({
  select,
}))(Cascader);
