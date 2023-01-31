import React, { useState, useEffect,useContext } from 'react';
import styled from 'styled-components';

import {connect} from "dva";

import { Select as ASelect,Button,Modal,Tag  } from 'antd';
import type { Iconf} from '../TableInfo';
import { wrapContext } from '../TableInfo';
import { ShowData } from './_css_comm';
import { Form } from 'antd';
import MixinTable from '../../MixinTable/MixinTable';



import {useList} from 'react-use'


const SelectTableBox= styled.div`
border:1px solid #ccc;
  display:flex;
  align-items:center;
  .select-main-box{
    display:flex;
    flex-flow:row  wrap;
    .select-item-box{
      margin:1vh;
    }
  }
`;

const NButton=styled(Button)`
  margin:0 1vh;
`




const AModal = styled(Modal)`
&& {
  width: 70vw !important;
  .select-tree-modal-box {
    width:100%;
    display:flex;
    .tree-box-main-box{
      width:30%;
      margin-right:1vw;
    }
  }
}
`;

interface Ioptions {
  name: string,
  id: number
}
interface IconfSelect extends Iconf {
  placeholder?: string,
  relationType: string,
  options: Ioptions[],
  defaultValue: string 
}
interface ISelect {
  dispatch?: any;
  conf: IconfSelect;
  name: string;
  rules: any;
}

const Select: React.FC<ISelect> = (props) => {
  const _: any = props.conf;
  const {name} = props;

  const __ =_.tableSetting?_.tableSetting:{}
  const theme: any = useContext(wrapContext);
  const [OPTION, {set}] = useList();
  const [VAL, setVAL]  = useState();
  const [VISIBLE,setVISIBLE]=useState(false);
  const [SELECTROWKEYS, setSELECTROWKEYS] = useState([]);
  function filterData(){
    let _op = [];
    const data=theme.form.getFieldValue();
    _op = data[_.itemKey]?data[_.itemKey]:[];
    const value=data[name]?data[name]:[]
    set(_op);
    setVAL(value)
  }

    // 只在初始化时进行加载
  useEffect(()=>{
    filterData()
  },[])

  /* 删除 */
  // const deleteTableData=(item:any,index:any)=>{
  //   OPTION.splice(index,1);
  //   VAL.splice(index,1);
  //   set(OPTION);
  //   setVAL(VAL);
  // }


  return (
    <wrapContext.Consumer>
      {(_data) => {
        switch (_data.state) {
          case 'default':
            return <ShowData>{VAL}</ShowData>;
            break;
          case 'edit':
            case "new" :
          case 'disabled':
            return (
              <Form.Item name={name} noStyle
              rules={props.rules}>
                <SelectTableBox>
                    <div className="select-main-box">
                      {
                          Array.isArray(OPTION)?OPTION.map((item: any)=>{
                            return  <Tag 
                            className="select-item-box"
                            // closable
                            // onClose={e => {
                            //   e.preventDefault();
                            //   deleteTableData(item,idx)
                            // }}
                            >{item.name}</Tag>
                          }):""
                  }
                    </div>
                     {/* <MSelect
                     value={VAL}
                      mode="multiple"
                      placeholder={_.placeholder}
                      showSearch
                      disabled={_data.state === 'disabled' ? true : false}
                      filterOption={(input, option) =>{
                        return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }}
                      open={false}
                    >
                        {
                    Array.isArray(OPTION)?OPTION.map((item,idx:number)=>{
                      return  <Option title={item.name} value={item.id.toString()}>{item.name}</Option>
                    }):""
                  }
                  </MSelect> */}

                  <NButton  type="primary" onClick={()=>(setVISIBLE(true))} >
                    {_.btnText}
                  </NButton>
              </SelectTableBox>

                <AModal title={_.modalTitle} visible={VISIBLE}
                 onOk={()=>{
                  const ids: any = [];
                  const data: any = SELECTROWKEYS.map((item: any)=>{
                    ids.push(__.idKey ? item[__.idKey] :item.id);
                    return {
                      ...item,
                      name:__.nameKey ? item[__.nameKey] : item.name,
                      id:__.idKey ? item[__.idKey] :item.id,
                    }
                  });

                  /// ///////
                  theme.form.setFieldsValue({
                    [name]:ids,
                  });
                  /// /////
                  set(data),
                  setVAL(ids),
                  setVISIBLE(false);
                 }}
                 onCancel={()=>(setVISIBLE(false))}>
                  <MixinTable url={__.url}
                  changeKey={VISIBLE}
                   params={__.params} 
                  columns={__.columnsList}
                  rowSelection={(res: any,data: any)=>{
                    res.map((item01: any,index01: number)=>{
                      OPTION.map((item02: any)=>{
                        if(item01===item02.id){
                          data[index01]=item02;
                        }
                      })
                    })
                    setSELECTROWKEYS(data);
                    // setOPTION(data);
                    // setVAL(data)
                  }}
                  rowKey="item" 
                  defaultValue={VAL}
                      ></MixinTable>
                </AModal>

              </Form.Item>

            );
            break;
        }
      }}
    </wrapContext.Consumer>
  );
};
export default connect(({
  select
}: {select: any}) => ({
  select
}))(Select);
