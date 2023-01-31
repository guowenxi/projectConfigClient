import React, { useState, useMemo, useEffect } from 'react';
import { Table, Spin, Popconfirm  ,Drawer} from 'antd';
import type { Icommon } from '@/models/common';
import type { Iselect } from '@/models/select';
import {connect} from "dva";
import styled from 'styled-components';
import { useList } from 'react-use';
import { useAntdTable, useUpdate, useDynamicList, useUpdateEffect } from 'ahooks';
import type { PaginatedParams } from 'ahooks/lib/useAntdTable';
import MixinTable from '@/components/MixinTable/MixinTable';


import { notification } from 'antd';
import { ButtonBox } from '@/globalStyled';
import type { AProps, AColumns } from '@/globalTyping';
import { Modal, Button, Form, Input } from 'antd';
const { TextArea } = Input;

const { Search } = Input;

const TableBox = styled.div`
  flex: 1;
  .top-box {
    margin: 1.85vh 0 2.04vh;
    padding: 0 1.04vw;
  }
  .first-span {
    height: 36px;
    margin-right: 10px;
    padding: 0 10px;
    color: #fff;
    line-height: 36px;
    background: #1572e8;
    border-radius: 4px;
    cursor: pointer;
    &:hover {
      opacity: 0.8;
    }
    &:last-child {
      margin-right: 0;
    }
  }
`;
const MainBox = styled.div`
  display: flex;
  flex-flow: column;
  .table-full-box {
    width: 100%;
  }
  .pagination-box {
    padding: 1vh 0;

    .Pagination {
      float: right;
    }
  }
  .search-box {
    float: right;
    margin: 1vh 0;
  }
`;

const TableTitle = styled.div`
  display: flex;
  flex-flow: row;
  height: 40px;
  width: 100%;
  background: #fafafa;
  padding: 10px;
`;
const TableList = styled.div`
  display: flex;
  flex-flow: row;
  height: 40px;
  width: 100%;
  background: #fff;
  padding: 10px;
`;
const Column = styled.div<{ itemWidth?: string | number }>`
  flex: 1;
  min-width: ${(props) => (props.itemWidth ? props.itemWidth : '20%')};
  max-width: ${(props) => (props.itemWidth ? props.itemWidth : '20%')};
  display: flex;
  flex-flow: row nowrap;
`;
interface Props extends AProps {
  common: any;
  params: any;
  url: string;
  columns: AColumns[];
  handle: Handle[];
  data: Record<string, any>;
  rowSelection: {};
  changeKey: string;
  rowKey: string;
  defaultValue: never[];
}
interface Handle {
  type: string;
  config?: {
    title: string;
    okText: string;
    cancelText: string;
  };
  name: string;
  bolName: string;
  click: any;
}

const ScrollTable: React.FC<Props> = (props) => {
  const { params, url, columns, handle, data, edit, changeKey, defaultValue, changeList } = props;
  const { selectedId } = props.common;

  const update = useUpdate();
  const [form] = Form.useForm();
  const [SELINDEX] = useState(null);
  const [SELECTROWKEYS, setSELECTROWKEYS] = useState([]);
  const [List, setList] = useState([]);
  const [ItemIdx, setItemIdx] = useState({});
  const [editState, seteditState] = useState(false);
  const [delState, setdelState] = useState(false);
  const [DrawerSate, setDrawerSate] = useState(false);
  const { dispatch } = props;

  // -------------------------------状态操作-------------------------------

  useEffect(() => {
    setList(data);
  }, [data]);

  const editItem = () => {
    var _item = form.getFieldsValue();
    dispatch({
      type: `common/requestData`,
      method:"PUT",
      url: "/water_obj/update_item",
      payload: {
        id:_item.id,
        name:_item.name,
        desc:_item.desc,
      },
      callback:(res: string)=>{
        notification.success({
          description: '提示',
          message: '编辑成功!',
        });
        var _List = List;
        _List[ItemIdx] = _item;
        setList(JSON.parse(JSON.stringify(_List)))
      }
    });

  };
  const newItem = (_item) => {
    // var _item = form.getFieldsValue();
    dispatch({
      type: `common/requestData`,
      method:"POST",
      url: "/water_obj/new_item",
      payload: {
        id:props.common.selectedId,
        cameraid:_item.cameraid,
      },
      callback:(res: string)=>{
        notification.success({
          description: '提示',
          message: '新增成功!',
        });
        var _List = List;
        _List.push({
          name:_item.cameraname,
          cameraid:_item.cameraid,
          id:res
        })
        setList(JSON.parse(JSON.stringify(_List)));
        setDrawerSate(false)
      }
    });
  };

  const delItem = () => {
    dispatch({
      type: `common/requestData`,
      method:"delete",
      url: "/water_obj/del_item",
      payload: {
        id:List[ItemIdx].id,
      },
      callback:(res: string)=>{
        notification.success({
          description: '提示',
          message: '删除成功!',
        });
        var _List = List;
        _List.splice(ItemIdx, 1);
        setList(JSON.parse(JSON.stringify(_List)));
      }
    });



  };

  return (
    <TableBox>

      <div style={{"margin-bottom":"20px"}}>
        <Button  type="primary" onClick={()=>{
          setDrawerSate(true)
        }}>
          新增
        </Button>
      </div>
      <MainBox>
        {/* <Form
          form={form}
          >
          <Form.Item name={"keyWord"} noStyle>
                  <Search
                        placeholder="关键字查询"
                        onSearch={submit}
                        style={{ width: 200 }}
                        className='search-box'
                      />
              </Form.Item>
          </Form> */}
        <TableTitle>
          {columns.map((i) => {
            return <Column itemWidth={i.width}>{i.title}</Column>;
          })}
          <Column>操作</Column>
        </TableTitle>
        {List.map((item, idx) => {
          return (
            <TableList key={idx}>
              {columns.map((i) => {
                return <Column itemWidth={i.width}>{item[i.key]}</Column>;
              })}
              <Column>
                <ButtonBox
                  onClick={() => {
                    setItemIdx(idx);
                    form.setFieldsValue(item);
                    seteditState('edit');
                  }}
                >
                  <a>编辑</a>
                </ButtonBox>
                <ButtonBox
                  onClick={() => {
                    setItemIdx(idx);
                    setdelState(true);
                  }}
                >
                  {' '}
                  <a>删除</a>{' '}
                </ButtonBox>
              </Column>
            </TableList>
          );
        })}
      </MainBox>
      <Drawer
              key={0}
              title="选择视频点位"
              placement="right"
              width={'56vw'}
              closable={true}
              onClose={() => {
                setDrawerSate(false)
              }}
              visible={DrawerSate}
              destroyOnClose={true}
            >
              <MixinTable
                url="/water_obj/camera/page"
                params={{
                  cityId:selectedId
                }}
                handle={[
                  {name:"加入视频列表",click:(item)=>{
                    newItem(item)
                  }}
                ]}
                columns={[
                  {
                    title: '视频名称',
                    dataIndex: 'cameraname',
                    key: 'cameraname',
                    className: 'no-flex',
                    width: "15%",
                  },
                  {
                    title: '视频所在城市',
                    dataIndex: 'city',
                    key: 'city',
                    className: 'no-flex',
                    width: "10%",
                  },
                  {
                    title: '视频区域地址',
                    dataIndex: 'areaname',
                    key: 'areaname',
                    className: 'no-flex',
                    width: "30%",
                  },
                  {
                    title: '视频ID',
                    dataIndex: 'cameraid',
                    key: 'cameraid',
                    className: 'no-flex',
                    width: "10%",
                  },
                  {
                    title: '视频所属流域',
                    dataIndex: 'basin',
                    key: 'basin',
                    className: 'no-flex',
                    width: "15%",
                  },
                ]}
              ></MixinTable>
            </Drawer>
      <Modal
       title="删除"
       visible={delState}
       onOk={(item) => {
        delItem()
        setdelState(false);
      }}
      onCancel={() => {
        setdelState(false);
      }}
       >
         是否删除
      </Modal>
      <Modal
        title="编辑"
        visible={editState == 'edit' ||  editState == 'new'?  true : false}
        onOk={(item) => {
          if(editState == 'edit'){
            editItem();
          }else if(editState == 'new'){
            newItem();
          }

          seteditState(false);
        }}
        onCancel={() => {
          seteditState(false);
        }}
      >
        <Form form={form}>
          <Form.Item
          style={{'display':'none'}}
            label="id"
            name="id"
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="视频名称"
            name="name"
            rules={[{ required: true, message: '请输入视频名称' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="绑定视频的ID"
            name="cameraid"
            rules={[{ required: false, message: '请输入视频ID' }]}
          >
            <Input  disabled />
          </Form.Item>
          <Form.Item
            label="大屏描述内容"
            name="desc"
            rules={[{ required: true, message: '请输入视频内容' }]}
          >
            <TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </TableBox>
  );
};

export default connect(({ common, select }: { common: Icommon; select: Iselect }) => ({
  common,
  select,
}))(ScrollTable);
