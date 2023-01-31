import React, {useState, useEffect, useContext} from 'react';
import styled from 'styled-components';

import {connect} from "dva";

import {Input, Button, Modal, Tag, Input as AInput} from 'antd';
import type {Iconf} from '../TableInfo';
import {wrapContext} from '../TableInfo';
import {ShowData} from './_css_comm';
import {Form} from 'antd';
import MixinTable from '../../MixinTable/MixinTable';

import {useList} from 'react-use';

const SelectTableBox = styled.div`
  border: 1px solid #ccc;
  display: flex;
  align-items: center;
  height: 100%;
  .ant-form-item {
    width: 100%!important;
  }
  .select-main-box {
    display: flex;
    flex-flow: row wrap;

    .select-item-box {
      margin: 1vh;
    }
  }
`;

const NButton = styled(Button)`
  margin: 0 1vh;
`;
const Minput = styled(AInput)`
  && {
    height: 100%;
    width: 100%;
    padding: 1vh;


  }
`;
const AModal = styled(Modal)`
  && {
    width: 70vw !important;

    .ant-form {
      margin-top: 2vh;
    }

    .select-tree-modal-box {
      width: 100%;
      display: flex;

      .tree-box-main-box {
        width: 30%;
        margin-right: 1vw;
      }
    }
  }
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

interface ISelect {
  dispatch?: any;
  conf: IconfSelect;
  name: string;
  rules: any;
}

const Select: React.FC<ISelect> = (props) => {
  const _: any = props.conf;

  const {name} = props;

  const __ = _.tableSetting ? _.tableSetting : {};
  const theme: any = useContext(wrapContext);
  const [OPTION, {set}] = useList([]);
  const [VAL, setVAL] = useState();
  const [VISIBLE, setVISIBLE] = useState(false);
  const [SELECTROWKEYS, setSELECTROWKEYS] = useState([]);

  function filterData() {
    let _op = [];
    const data = theme.form.getFieldValue();
    console.log(data)
    set({name: data.name});

    theme.form.setFieldsValue({
      [name]: data.name,
    });

    console.log(OPTION)

  }

  // 只在初始化时进行加载
  useEffect(() => {

    // filterData();
  }, []);

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
          case 'new':
          case 'disabled':
            return (
              <div>
                <SelectTableBox>
                  <div className="select-main-box" style={_.style}>

                    {OPTION.length > 0
                      ? OPTION.map((item: any) => {
                        return (
                          <Form.Item name='name' rules={props.rules}>
                            <Minput placeholder={_.placeholder}  value={item.name} disabled={_data.state === 'disabled'}
                                    onChange={(val) => {
                                      set({...item, name: val.target.value})
                                      theme.form.setFieldsValue({
                                        [name]: val.target.value,
                                      });
                                    }}/>
                          </Form.Item>
                        );
                      })
                      : <Form.Item name='name' rules={props.rules}>
                        <Minput placeholder={_.placeholder} disabled={_data.state === 'disabled'}
                                onChange={(val) => {
                                  theme.form.setFieldsValue({
                                    [name]: val.target.value,
                                  });
                                }}/>
                      </Form.Item>}
                  </div>

                  {_data.state === 'disabled' ? null : (
                    <NButton type="primary" onClick={() => setVISIBLE(true)}>
                      {_.btnText}
                    </NButton>
                  )}
                </SelectTableBox>

                <AModal
                  title={_.modalTitle}
                  visible={VISIBLE}
                  onOk={() => {
                    const ids: any = [];
                    const value: any = [];

                    const data: any = SELECTROWKEYS.map((item: any) => {
                      ids.push(__.idKey ? item[__.idKey] : item.id);
                      value.push(item.phone);
                      return {
                        ...item,
                        name: __.nameKey ? item[__.nameKey] : item.name,
                        id: __.idKey ? item[__.idKey] : item.id,
                      };
                    });

                    /// ///////
                    theme.form.setFieldsValue({
                      [name]: data[0].name,
                    });
                    /// /////
                    set(data);
                    setVAL(ids);
                    setVISIBLE(false);


                    _data.focus$.emit({
                      relateNames: _.relateNames,
                      relatekeys: _.relatekeys,
                      // type: _.clickType ? _.clickType : "onChange",
                      value: value
                    })


                  }}
                  onCancel={() => setVISIBLE(false)}
                >
                  <MixinTable
                    url={__.url}
                    changeKey={VISIBLE}
                    params={__.params}
                    columns={__.columnsList}
                    rowSelection={(res: any, data: any) => {
                      res.map((item01: any, index01: number) => {
                        Array.isArray(OPTION) && OPTION.map((item02: any) => {
                          if (item01 === item02.id) {
                            data[index01] = item02;
                          }
                        });
                      });
                      setSELECTROWKEYS(data);
                      // setOPTION(data);
                      // setVAL(data)
                    }}
                    rowKey="item"
                    defaultValue={VAL}
                    checkboxType={__.checkboxType}
                  ></MixinTable>
                </AModal>
              </div>
            );
            break;
        }
      }}
    </wrapContext.Consumer>
  );
};
export default connect(({select}: { select: any }) => ({
  select,
}))(Select);
