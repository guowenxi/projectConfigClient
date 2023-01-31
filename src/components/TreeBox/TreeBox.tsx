import React, { useState, useEffect,useMemo } from 'react';
import { Input, Button ,Tree} from 'antd';
import styled from 'styled-components';

import { string } from 'prop-types';
import type { AProps } from '@/globalTyping';

const { Search } = Input;

const ContentBox = styled.div`
  position: relative;
  left:0;
  width: 100%; 
  .search-box{
    margin:1vh 0;
  }
`;


interface MProps extends AProps {
  dispatch?: any,
  /**
   * class名
   */
  className: string,
  /**
   * 树形选择的keys
   */
  checkedTreeKeys: (number | string)[],
  /**
   * 选择树形的回调
   */
  onCheck: object,
  /**
   * 选择树形的回调
   */
  onSelect: object,
  /**
   * 点击时的回调
   */
  changeKey?: any,
  selectable: boolean;
  data: [
    {
      name: string,
      id: number | string,
      children: [
        {
          name: string,
          id: number | string
        }
      ]
    }
  ]
}

const TreeBox = (props: MProps) => {
  const { data,checkedTreeKeys,className,changeKey } = props;

  const [treeListData,setTreeListData]=useState([]);

  const [searchValue,setSearchValue]=useState("");/*  */

  const [autoExpandParent,setAutoExpandParent]=useState(false);

  const [expandedKeys,setExpandedKeys]=useState([]);



  /* 处理数据 */
  const dealTreeData=(data,index)=>{
    if(Array.isArray(data)&&data.length){
      data.map((item,idx)=>{
        item.title=item.name;
        item.key=item.id;
        item.keyIndex=`${index}-${idx}`
        if(item.children){
          dealTreeData(item.children,item.keyIndex)
        }
      })
    }
    setTreeListData(data)
  }





  useMemo(() => {

  }, [changeKey]);

  useEffect(() => {
    dealTreeData(data,0)
  }, [])


  /* 树形图选择 */
   const onCheck=(checkedKeys, info)=>{
    props.onCheck(checkedKeys, info);
  };
   /* 树形图选择 */
   const onSelect=(checkedKeys, info)=>{
    props.onSelect(checkedKeys, info);
  }

  /* 改变数据 */
  const getParentKey = (title, tree,data) => {
    if(Array.isArray(tree)){
      tree.map((item,idx)=>{
        if(item.title.indexOf(title)>=0){
         data.push(item.keyIndex)
        }
        if(item.children){
          getParentKey(title,item.children,data)
        }
      })
    }
    return data
  };

  /* 搜索框改变的时候触发 */
  const onChange=(e)=>{
    const  {value}  = e.target;
    let titleText;
    if(value){
      titleText=getParentKey(value, treeListData,[]);
    }
    let data=[];
    if(titleText){
     titleText.map((item01,index01)=>{
        data=getParentKeyData(item01, treeListData,data)
      })
    }
    setExpandedKeys(data)
    setSearchValue(value);
    setAutoExpandParent(false)
  }


  const getParentKeyData = (key, tree,data) => {
    const keyLength=key.length;
    for (let i = 0; i < tree.length; i++) {
      if(tree[i].keyIndex.length>keyLength){
        if(tree[i].keyIndex.substr(0,keyLength)===key){
          data.push(tree[i].key)
        }
      }else if(tree[i].keyIndex===key.substr(0,tree[i].keyIndex.length)){
          data.push(tree[i].key)
        }
      if(tree[i].children){
        getParentKeyData(key, tree[i].children,data);
      }
    }
    return data;
   };

  const onExpand=(expandedKeys)=>{
    setExpandedKeys(expandedKeys);
     setAutoExpandParent(false)
  }

  return (
    <ContentBox className={className || ""}>
      <div className='search-box'>
      <Search  placeholder="请输入关键字" value={searchValue} onChange={onChange} />
      </div>
     <Tree
          className='hide-file-icon'
          checkable={props.checkable!=null&&props.checkable!=undefined?props.checkable:true}
          onCheck={onCheck}
          onSelect={onSelect}
          treeData={treeListData}
          selectable={props.selectable!=null&&props.selectable!=undefined?props.selectable:false}
          checkedKeys={checkedTreeKeys}
          autoExpandParent={autoExpandParent}
          onExpand={onExpand}
          expandedKeys={expandedKeys}
      ></Tree>
    </ContentBox>
  );
};

export default TreeBox;
