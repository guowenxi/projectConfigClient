import React, { useState, useEffect ,useContext } from 'react';
import styled from 'styled-components';

import {connect} from "dva";

import { Select as ASelect, Button, Modal } from 'antd';
import type { Iconf } from '../TableInfo';
import { wrapContext } from '../TableInfo';
import { ShowData } from './_css_comm';
import { Form } from 'antd';
import type { AProps } from '@/globalTyping';
const { Option } = ASelect;

import TreeBox from '../../TreeBox/TreeBox';
import MixinTable from '../../MixinTable/MixinTable';

const MSelect = styled<any>(ASelect)`
  && {
    width:100%;
    height:100%;
    .ant-select-selector{
      height:100%;
      padding:1vh;
    }
    .ant-select-selection-search-input{
      height:100% !important;
    }
    .ant-select-selection-item{
    }

  }
`;
const AModal = styled(Modal)`
  && {
    width: 70vw !important;
    .select-tree-modal-box {
      display: flex;
      width: 100%;
      margin-top: 5vh;
      .tree-box-main-box {
        width: 30%;
        margin-right: 1vw;
      }
    }
  }
`;

const SelectedBox = styled.div`
margin:10px 0 ;
    position: relative;
    display: flex;
    flex: auto;
    flex-wrap: wrap;
    max-width: 100%;
`;
const SelectedBoxItem = styled.div`
    position: relative;
    display: flex;
    flex: none;
    box-sizing: border-box;
    max-width: 100%;
    height: 24px;
    margin-top: 2px;
    margin-bottom: 2px;
    line-height: 22px;
    background: #f5f5f5;
    border: 1px solid #f0f0f0;
    border-radius: 2px;
    cursor: default;
    transition: font-size .3s,line-height .3s,height .3s;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    -webkit-margin-end: 4px;
    margin-inline-end: 4px;
    -webkit-padding-start: 8px;
    padding-inline-start: 8px;
    -webkit-padding-end: 4px;
    padding-inline-end: 4px;
    .ant-select-selection-item-content{
      display: inline-block;
    margin-right: 4px;
    overflow: hidden;
    white-space: pre;
    text-overflow: ellipsis;
    }
    .ant-select-selection-item-remove{
      color: inherit;
    font-style: normal;
    line-height: 0;
    text-align: center;
    text-transform: none;
    vertical-align: -.125em;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    display: inline-block;
    color: #00000073;
    font-weight: 700;
    font-size: 10px;
    line-height: inherit;
    cursor: pointer;
    }
`;

const NButton = styled(Button)`
  margin: 1vh;
`;

interface Ioptions {
  name: string;
  id: number;
}
interface IconfSelect extends Iconf {
  placeholder?: string;
  relationType: string;
  options: Ioptions[];
  defaultValue: string;
}
interface MProps extends AProps {
  dispatch: any;
  conf: IconfSelect;
  name: string;
  rules: any;
}

const SelectTree = (props: MProps) => {
  const _: any = props.conf;
  const { name } = props;
  const {dispatch} = props;
  const theme: any = useContext(wrapContext);
  const __ = _.tableSetting ? _.tableSetting : {};
  const [visible, setVISIBLE] = useState(false); /* 模态层状态 */
  const [OPTION, setOPTION] = useState<any>([]); /* 树形数据 */
  const [selTreeListData, setSelTreeListData] = useState(_.defaultValue);
  const [tableData, setTableData] = useState([]);
  const [SelectList, setSelectList] = useState([]);

  const openModal = () => {
    setVISIBLE(true);
  };
  const selTree = () => {
    setVISIBLE(false);
    if(__.url) theme.form.setFieldsValue({
      [name]:SelectList,
    }); ;
  };



  async function filterData(namespace: string,conf: any){
    let _op = [];
    if(conf.relationType){
      _op = props[namespace][conf.relationType];
    }else if(conf.url){
      const data = await dispatch({
        type: 'common/requestData',
        url: conf.url,
        method: 'GET',
        payload: {
          ...conf.params
        },
      })

      if(conf.keyName){
          data.map(function(item: any,idx: number){
            item.name = item[conf.keyName];
            item.id = item[conf.idName];
          })
      }


      // const { data, error, loading } = useRequest()
      _op = data;
    }else{
      _op = conf.options;
    }
    setOPTION(_op);
    // filterDefaultValue(_op,_.defaultValue)
  }



  // 初始化加载树形选择的组件
  useEffect(() => {
    filterData('select', _);
  }, []);

    // 只在初始化时进行加载
    useEffect(() => {
      const _list = theme.form.getFieldValue(name);
      if(_list.length)  setSelectList(_list);
    }, [theme.form.getFieldValue(name)]);


  /* 选中数据 */
  const onCheck = async (data: any, info: any) => {
    setSelTreeListData(info.checkedNodes);
    if(__.url){
      const _data = await dispatch({
        type: 'common/requestData',
        url: __.url,
        method: 'GET',
        payload: {
          [__.paramsConfig.idName] : info.node[__.paramsConfig.keyName]
        },
      })
      setTableData(_data.list || _data);
    }else{
      setTableData(info.checkedNodes[0].userList);
    }
  };
  /* 选中数据 */
  const onSelect = (data: any) => {
    setSelTreeListData(data.list);
    if (Array.isArray(data.data[0].userList)) {
    }
    setTableData(data.data);
  };

  /* 取消弹框 */
  const cancelModal = () => {
    setVISIBLE(false);
  };



  return (
    <wrapContext.Consumer>
      {(_data: any): any => {
        switch (_data.state) {
          case 'default':
            // return <ShowData>{VAL}</ShowData>;
            return <ShowData></ShowData>;
            break;
          case 'edit':
          case 'new':
          case 'disabled':
            return (
              <Form.Item name={name} noStyle rules={props.rules}>
                <div style={{'boxShadow':'0 0 0 1px #eee inside'}}>
                <SelectedBox>
                  {
                    SelectList.map((item,idx)=>{
                        return <SelectedBoxItem>
                          <span className="ant-select-selection-item-content">{item[_.keyName || 'name']}</span>
                        </SelectedBoxItem>
                    })
                  }
                </SelectedBox>
{/*
               <MSelect
                 initialValue="null"
                 mode="multiple"
                showSearch
                disabled="disabled"
                onChange={()=>{
                }}
                filterOption={(input: any, option: any) =>{
                  return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }}
                >
                  {
                    SelectList.map((item: any)=>{
                      return  <Option title={item.name} value={item.id.toString()}>{item.name}</Option>
                    })
                  }
                </MSelect> */}

                <NButton onClick={openModal}>选择</NButton>
                <AModal visible={visible} onOk={selTree} onCancel={cancelModal}>
                  <div className={'select-tree-modal-box'}>
                    <TreeBox
                      data={OPTION}
                      selectable={false}
                      onCheck={onCheck}
                      onSelect={onSelect}
                      checkedTreeKeys={selTreeListData}
                      className={'tree-box-main-box'}
                    ></TreeBox>
                    <MixinTable
                    noSearch
                      columns={__.columnList}
                      data={tableData}
                      handle={[
                        {
                          name: '添加',
                          show:__.url ? true : false,
                          click: (text: any, record: any, search: any) => {
                            //如果列表是请求而来 则将数据切换到列表点击添加
                            //因为添加只在列表带地址时存在 则直接写死
                            if(__.url){
                              const _sel_item = SelectList.find((item : any,idx : number)=>{
                                return (item[_.idName || 'id'] == text[_.idName || 'id']);
                              })
                              if(_sel_item) return;
                              SelectList.push(record)
                              setSelectList(JSON.parse(JSON.stringify(SelectList)))
                            }
                          },
                        },
                        {
                          type: 'popconfirm',
                          bolName: '删除',
                          show:__.url ? false : true ,
                          click: (text: any, record: any, search: any) => {
                            //如果列表是请求而来 则将数据切换到列表点击删除
                            tableData.map((item: any, idx: number) => {
                              if (item.key == text.key) {
                                tableData.splice(idx, 1);
                              }
                            });
                            setTableData(tableData);
                            search.reset();
                          },
                          config: {
                            okText: '确认',
                            cancelText: '取消',
                            title: '是否确认删除？',
                          },
                        },
                      ]}
                      changeKey={tableData}
                    ></MixinTable>
                  </div>
                  {
                    __.url ?
                  <SelectedBox>
                  {
                    SelectList.map((item,idx)=>{
                        return <SelectedBoxItem>
                           <span className="ant-select-selection-item-content">{item[_.keyName || 'name']}</span>
                          <span className="ant-select-selection-item-remove" onClick={()=>{
                              const _idx = SelectList.findIndex((it : any,idx : number)=>{
                                return (it[_.idName || 'id'] == item[_.idName || 'id']);
                              })
                              SelectList.splice(_idx, 1);
                              setSelectList(JSON.parse(JSON.stringify(SelectList)))
                          }}>x</span>
                        </SelectedBoxItem>
                    })
                  }
                </SelectedBox>
              :null
                  }
                </AModal>
                </div>
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
}))(SelectTree);
