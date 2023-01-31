import React, {useState, useEffect} from 'react';
import {Tree, Input} from 'antd';
import styled from 'styled-components';
// 
import type {AProps} from '@/globalTyping';
import {
  PlusOutlined,
  EditOutlined,
  // MinusOutlined,
  // ExclamationCircleOutlined,
  // CheckOutlined,
  DeleteOutlined,
} from '@ant-design/icons';

const {TreeNode} = Tree;
const TreeDiv = styled.div`
  height: 100%;

  .TreeDiv_main {
    height: 100%;
    overflow: auto;
  }

  // .ant-tree{
  //     height: 100%;
  //     overflow: auto;
  // }
`

interface TProps extends AProps {
  // dispatch: Dispatch,
  // tree数据
  treeData: any,
  //  添加回调
  onAdd: any,
  //  编辑回调
  onEdit: any,
  //  删除回调
  onDelete: any,
  //  详情回调
  detailClick: any
}

const TreeNodes = (props: TProps) => {
  const {treeData, onEdit, onAdd, onDelete, detailClick, selectedKeys, treeExpandedKeys} = props;
  const [expandedKeys, setExpandedKeys] = useState([]);
  // search
  const [searchValue, setsearchValue] = useState('')
  const [autoExpandParent, setautoExpandParent] = useState(true)
  const dataList: any = []

  const generateList = (data: any) => {
    for (let i = 0; i < data.length; i++) {
      const node = data[i];
      const {key} = node;
      const {name} = node;
      dataList.push({key, name});
      if (node.children) {
        generateList(node.children);
      }
    }
  };
  generateList(treeData);
  const getParentKey = (key, tree) => {
    let parentKey;
    for (let i = 0; i < tree.length; i++) {
      const node = tree[i];
      if (node.children) {
        if (node.children.some(item => item.key === key)) {
          parentKey = node.key;
        } else if (getParentKey(key, node.children)) {
          parentKey = getParentKey(key, node.children);
        }
      }
    }
    return parentKey;
  };

  const onChange = (e: any) => {
    const {value} = e.target;
    const expandedKeys: any = dataList.map(item => {
      if (item.name.indexOf(value) > -1) {
        return getParentKey(item.key, treeData);
      }
      return null;
    })
    // .filter((item, i, self) => item && self.indexOf(item) === i);
    if (!value) {
      setExpandedKeys([]);
    } else {
      setExpandedKeys(expandedKeys);
    }
    setsearchValue(value)
    setautoExpandParent(true)
  };
  const loop = data =>
    data.map(item => {
      // const index = item.name.indexOf(searchValue);
      // const beforeStr = item.name.substr(0, index);
      // const afterStr = item.name.substr(index + searchValue.length);
      const title =
        // index > -1 ? (
        //     <span>
        //         {beforeStr}
        //         <span>{searchValue}1</span>
        //         {afterStr}
        //     </span>
        // ) : (
        <span style={{color: item.num === 0 ? "red" : "#333"}} onClick={() => {
          detailClick(item)
        }}>
                {item.name}（{item.num}）
          {onEdit ?
            <EditOutlined
              style={{marginLeft: 20}}
              onClick={(e) => {
                e.stopPropagation()
                onEdit(item)
              }}
            /> : null
          }
          {onAdd ?
            <PlusOutlined style={{marginLeft: 10}} onClick={(e) => {
              e.stopPropagation()
              onAdd(item)
            }}/>
            : null
          }
          {onDelete ?
            <DeleteOutlined
              style={{marginLeft: 10}}
              onClick={(e) => {
                e.stopPropagation()
                onDelete(item)
              }}
            />
            : null
          }
                </span>
      // );


      if (item.children) {
        return {title, key: item.key, children: loop(item.children)};
      }

      return {
        title,
        key: item.key,
      };



    });
  const onExpand = (expandedKeys: any) => {
    setExpandedKeys(expandedKeys);
    setautoExpandParent(false)
  };
  //
  const renderTreeNodes = (data: any) =>
    data.map((item: any) => {
      item.title = (
        <div onClick={() => {

          detailClick(item)
        }}>
          <span style={{color: item.num === 0 ? "red" : "#333"}}>{item.name}（{item.num}）</span>
          <span>
                        {onEdit ?
                          <EditOutlined
                            style={{marginLeft: 20}}
                            onClick={() => onEdit(item)}
                          /> : null
                        }
            {item.level != 4 && onAdd ?
              <PlusOutlined style={{marginLeft: 10}} onClick={() => onAdd(item)}/>
              : null
            }
            {onDelete ?
              <DeleteOutlined
                style={{marginLeft: 10}}
                onClick={() => onDelete(item)}
              />
              : null
            }
                    </span>
        </div>
      );
      if (item.children) {
        return (
          <TreeNode title={item.title} key={item.key}>
            {renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode {...item} />;
    });


  useEffect(() => {
    if (treeExpandedKeys) {
      setExpandedKeys(treeExpandedKeys)
    }
  }, [treeExpandedKeys])
  useEffect(()=>{
  },[])

  // 是否显示弹框
  const displaySearch = () => {
    return props.searchState != undefined && props.searchState != null ? props.searchState : true;
  }

  return (
    <TreeDiv>
      <div className="TreeDiv_main">
        {
          displaySearch() ? <Input.Search style={{marginBottom: 8}} placeholder="请输入关键词" onChange={(e) => {
            onChange(e)
          }}/> : ""
        }

        <Tree
          onExpand={onExpand}
          expandedKeys={expandedKeys}
          autoExpandParent={autoExpandParent}
          treeData={loop(treeData)}
          selectedKeys={selectedKeys}
        >
          {/* {renderTreeNodes(treeData)} */}
        </Tree>
      </div>
      {/* <Tree
                expandedKeys={expandedKeys}
                onExpand={onExpand}
            >
                {renderTreeNodes(treeData)}
            </Tree> */}
    </TreeDiv>
  )
}
export default TreeNodes
